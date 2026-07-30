// NOISE_WORLEY_3D
#version 100
#pragma phaserTemplate(shaderName)

#pragma phaserTemplate(fragmentMode)
#pragma phaserTemplate(fragmentIterations)
#pragma phaserTemplate(fragmentNormalMap)

#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform vec3 uSeedX;
uniform vec3 uSeedY;
uniform vec3 uSeedZ;
uniform vec3 uCells;
uniform vec3 uCellOffset;
uniform vec3 uVariation;
uniform vec3 uWrap;
uniform float uSmoothing;
uniform float uNormalScale;
uniform vec4 uColorStart;
uniform vec4 uColorEnd;

varying vec2 outTexCoord;

float trig(vec3 p)
{
    return fract(43757.5453*sin(dot(p, vec3(12.9898,78.233, 9441.8953))));
}

// Convert fractional texture coordinates into 1x1x1 grid cells.
vec3 bigCoord (vec3 coord, float scale)
{
    return (coord + uCellOffset) * scale * uCells;
}

vec3 hash3D (vec3 coord)
{
    return vec3(
        trig(coord + uSeedX),
        trig(coord + uSeedY),
        trig(coord + uSeedZ)
    ) * uVariation;
}

// Sharp Worley noise.
float worley3D (vec3 uv, float scale)
{
    vec3 coord = bigCoord(uv, scale);
    vec3 point = floor(coord);
    vec3 frac = fract(coord);

    float dist = 12.0;

    for (float k = -1.0; k <= 1.0; k++)
    for (float j = -1.0; j <= 1.0; j++)
    for (float i = -1.0; i <= 1.0; i++)
    {
        vec3 cellNeighbor = vec3(i, j, k);
        vec3 jitter = hash3D(mod(point + cellNeighbor, uWrap * scale));
        vec3 diff = cellNeighbor - frac + jitter;
        float d = dot(diff, diff); // Squared length of diff.
        if (d < dist)
        {
            dist = d;
        }
    }
    return sqrt(dist);
}

// Worley index.
float worley3DIndex (vec3 uv, float scale)
{
    vec3 coord = bigCoord(uv, scale);
    vec3 point = floor(coord);
    vec3 frac = fract(coord);

    float dist = 12.0;
    float random = 0.0;

    for (float k = -1.0; k <= 1.0; k++)
    for (float j = -1.0; j <= 1.0; j++)
    for (float i = -1.0; i <= 1.0; i++)
    {
        vec3 cellNeighbor = vec3(i, j, k);
        vec3 jitter = hash3D(mod(point + cellNeighbor, uWrap * scale));
        vec3 diff = cellNeighbor - frac + jitter;
        float d = dot(diff, diff); // Squared length of diff.
        if (d < dist)
        {
            dist = d;
            random = jitter.x;
        }
    }
    return random;
}

// Smooth Worley noise, based on Inigo Quilez' method: https://iquilezles.org/articles/smoothvoronoi/
float worley3DSmooth (vec3 uv, float scale)
{
    vec3 coord = bigCoord(uv, scale);
    vec3 point = floor(coord);
    vec3 frac = fract(coord);

    float value = 0.0;
    for (float k = -1.0; k <= 1.0; k++)
    for (float j = -1.0; j <= 1.0; j++)
    for (float i = -1.0; i <= 1.0; i++)
    {
        vec3 cellNeighbor = vec3(i, j, k);
        vec3 jitter = hash3D(mod(point + cellNeighbor, uWrap * scale));
        vec3 diff = cellNeighbor - frac + jitter;
        float d = length(diff);
        value += exp2(-32.0 / uSmoothing * d); // Accumulate fast-decaying exponential of length.
    }
    return -(1.0 / 32.0 * uSmoothing) * log2(value);
}

float iterateWorley3D (vec3 uv)
{
    float value = 0.0;
    float itValue = 0.0;
    for (float iteration = 0.0; iteration < ITERATION_COUNT; iteration++)
    {
        float scale = exp2(iteration);
        #ifdef MODE_DISTANCE
            itValue = worley3D(uv + iteration, scale);
        #endif
        #ifdef MODE_INDEX
            itValue = worley3DIndex(uv + iteration, scale);
        #endif
        #ifdef MODE_DISTANCE_SMOOTH
            itValue = worley3DSmooth(uv + iteration, scale);
        #endif
        value += (itValue - 0.5) / scale;
    }
    return value + 0.5;
}

void main ()
{
    vec3 uv = vec3(outTexCoord, 0.0);
    float value = iterateWorley3D(uv);
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
