// NOISE_SIMPLEX_3D
#version 100
#pragma phaserTemplate(shaderName)

#pragma phaserTemplate(fragmentIterations)
#pragma phaserTemplate(fragmentNormalMap)

#ifndef ITERATION_COUNT
#define ITERATION_COUNT 1.0
#endif

#ifndef WARP_ITERATION_COUNT
#define WARP_ITERATION_COUNT 1.0
#endif

#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform vec2 uCells;
uniform vec2 uPeriod;
uniform vec2 uOffset;
uniform float uFlow;
uniform float uDetailPower;
uniform float uFlowPower;
uniform float uContributionPower;
uniform float uWarpDetailPower;
uniform float uWarpFlowPower;
uniform float uWarpContributionPower;
uniform float uWarpAmount;
uniform vec4 uColorStart;
uniform vec4 uColorEnd;
uniform float uNormalScale;
uniform float uValueFactor;
uniform float uValueAdd;
uniform float uValuePower;
uniform vec2 uSeed;

varying vec2 outTexCoord;

// psrdnoise2.glsl, version 2021-12-02
// Copyright (c) 2021 Stefan Gustavson and Ian McEwan
// (stefan.gustavson@liu.se, ijm567@gmail.com)
// Published under the MIT license, see:
// https://opensource.org/licenses/MIT
float psrdnoise(vec2 x, vec2 period, float alpha)
{
    // 2. Transform input point to find simplex "base" i0.
    vec2 uv = vec2(x.x+x.y*0.5, x.y);
    vec2 i0 = floor(uv), f0 = fract(uv);
    // 3. Enumerate simplex corners and transform back.
    float cmp = step(f0.y, f0.x);
    vec2 o1 = vec2(cmp, 1.0-cmp);
    vec2 i1 = i0 + o1, i2 = i0 + 1.0;
    vec2 v0 = vec2(i0.x - i0.y*0.5, i0.y);
    vec2 v1 = vec2(v0.x + o1.x - o1.y*0.5, v0.y + o1.y);
    vec2 v2 = vec2(v0.x + 0.5, v0.y + 1.0);
    // 4. Compute distances to corners before we wrap them.
    vec2 x0 = x - v0, x1 = x - v1, x2 = x - v2;
    vec3 iu, iv, xw, yw;
    // 5, 6. wrap to period and adjust i0, i1, i2 accordingly.
    if(any(greaterThan(period, vec2(0.0)))) {
        xw = vec3(v0.x, v1.x, v2.x); yw = vec3(v0.y, v1.y, v2.y);
        if(period.x > 0.0)
            xw = mod(vec3(v0.x, v1.x, v2.x), period.x);
        if(period.y > 0.0)
            yw = mod(vec3(v0.y, v1.y, v2.y), period.y);
        iu = floor(xw + 0.5*yw + 0.5); iv = floor(yw + 0.5);
    } else {
        iu = vec3(i0.x, i1.x, i2.x); iv = vec3(i0.y, i1.y, i2.y);
    }
    // Custom: Seed the noise.
    iu += uSeed.xxx; iv += uSeed.yyy;
    // 7. Compute the hash for each of the simplex corners.
    vec3 hash = mod(iu, 289.0);
    hash = mod((hash*51.0 + 2.0)*hash + iv, 289.0);
    hash = mod((hash*34.0 + 10.0)*hash, 289.0);
    // 8, 9a. Generate the gradients with an optional rotation.
    vec3 psi = hash*0.07482 + alpha;
    vec3 gx = cos(psi); vec3 gy = sin(psi);
    vec2 g0 = vec2(gx.x, gy.x);
    vec2 g1 = vec2(gx.y, gy.y);
    vec2 g2 = vec2(gx.z, gy.z);
    // 10. Compute radial falloff.
    vec3 w = 0.8 - vec3(dot(x0, x0), dot(x1, x1), dot(x2, x2));
    w = max(w, 0.0); vec3 w2 = w*w; vec3 w4 = w2*w2;
    // 11. Linear ramp along gradient (by a scalar product)
    vec3 gdotx = vec3(dot(g0, x0), dot(g1, x1), dot(g2, x2));
    // 12, 13. Multiply and sum up noise terms.
    float n = dot(w4, gdotx);
    // Scale the noise value to [-1,1] (empirical factor).
    return 10.9*n;
}

// --- End psrdnoise excerpt.

float iterate (vec2 coord, float detailPower, float flowPower, float contributionPower)
{
    float value = 0.;
    float itValue = 0.;
    for (float iteration = 0.; iteration < ITERATION_COUNT; iteration++)
    {
        float detailScale = pow(detailPower, iteration);
        float flowScale = pow(flowPower, iteration);
        itValue = psrdnoise((coord + iteration) * detailScale, uPeriod * detailScale, uFlow * flowScale + iteration);
        value += itValue / pow(contributionPower, iteration);
    }
    return value;
}

float iterateWarp (vec2 coord, float detailPower, float flowPower, float contributionPower)
{
    float value = 0.;
    float itValue = 0.;
    for (float iteration = 0.; iteration < WARP_ITERATION_COUNT; iteration++)
    {
        float detailScale = pow(detailPower, iteration);
        float flowScale = pow(flowPower, iteration);
        itValue = psrdnoise((coord + iteration) * detailScale, uPeriod * detailScale, uFlow * flowScale + iteration);
        value += itValue / pow(contributionPower, iteration);
    }
    return value;
}

vec2 warp (vec2 coord)
{
    vec2 o2 = vec2(11.3, 23.7);
    float coord1 = iterateWarp(coord, uWarpDetailPower, uWarpFlowPower, uWarpContributionPower);
    float coord2 = iterateWarp(coord + o2, uWarpDetailPower, uWarpFlowPower, uWarpContributionPower);
    return vec2(coord1, coord2);
}

void main ()
{
    vec2 coord = outTexCoord * uCells + uOffset;

    if (uWarpAmount > 0.)
    {
        coord += warp(coord) * uWarpAmount;
    }

    float value = iterate(coord, uDetailPower, uFlowPower, uContributionPower) * uValueFactor + uValueAdd;

    value = pow(clamp(value, 0., 1.), uValuePower);

    #ifndef NORMAL_MAP
    vec4 color = mix(uColorStart, uColorEnd, value);
    color.rgb *= color.a;
    gl_FragColor = color;
    #else
    float dx = dFdx(value) * uNormalScale;
    float dy = dFdy(value) * uNormalScale;
    vec3 normal = vec3(dx, dy, 1.0 - sqrt(dx * dx + dy * dy)) * 0.5 + 0.5;
    gl_FragColor = vec4(normal, 1.0);
    #endif
}
