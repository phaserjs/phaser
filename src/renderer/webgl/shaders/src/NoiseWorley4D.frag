// NOISE_WORLEY_4D
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

uniform vec4 uSeedX;
uniform vec4 uSeedY;
uniform vec4 uSeedZ;
uniform vec4 uSeedW;
uniform vec4 uCells;
uniform vec4 uCellOffset;
uniform vec4 uVariation;
uniform vec4 uWrap;
uniform float uSmoothing;
uniform float uNormalScale;
uniform vec4 uColorStart;
uniform vec4 uColorEnd;

varying vec2 outTexCoord;

float trig(vec4 p)
{
    return fract(43757.5453*sin(dot(p, vec4(12.9898,78.233,9441.8953,61.99))));
}

// Convert fractional texture coordinates into 1x1x1x1 grid cells.
vec4 bigCoord (vec4 coord, float scale)
{
    return (coord + uCellOffset) * scale * uCells;
}

vec4 hash4D (vec4 coord)
{
    return vec4(
        trig(coord + uSeedX),
        trig(coord + uSeedY),
        trig(coord + uSeedZ),
        trig(coord + uSeedW)
    ) * uVariation;
}

// Sharp Worley noise.
float worley4D (vec4 uv, float scale)
{
    vec4 coord = bigCoord(uv, scale);
    vec4 point = floor(coord);
    vec4 frac = fract(coord);

    float dist = 16.0;

    for (float l = -1.0; l <= 1.0; l++)
    for (float k = -1.0; k <= 1.0; k++)
    for (float j = -1.0; j <= 1.0; j++)
    for (float i = -1.0; i <= 1.0; i++)
    {
        vec4 cellNeighbor = vec4(i, j, k, l);
        vec4 jitter = hash4D(mod(point + cellNeighbor, uWrap * scale));
        vec4 diff = cellNeighbor - frac + jitter;
        float d = dot(diff, diff); // Squared length of diff.
        if (d < dist)
        {
            dist = d;
        }
    }
    return sqrt(dist);
}

// Worley index.
float worley4DIndex (vec4 uv, float scale)
{
    vec4 coord = bigCoord(uv, scale);
    vec4 point = floor(coord);
    vec4 frac = fract(coord);

    float dist = 16.0;
    float random = 0.0;

    for (float l = -1.0; l <= 1.0; l++)
    for (float k = -1.0; k <= 1.0; k++)
    for (float j = -1.0; j <= 1.0; j++)
    for (float i = -1.0; i <= 1.0; i++)
    {
        vec4 cellNeighbor = vec4(i, j, k, l);
        vec4 jitter = hash4D(mod(point + cellNeighbor, uWrap * scale));
        vec4 diff = cellNeighbor - frac + jitter;
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
float worley4DSmooth (vec4 uv, float scale)
{
    vec4 coord = bigCoord(uv, scale);
    vec4 point = floor(coord);
    vec4 frac = fract(coord);

    float value = 0.0;

    for (float l = -1.0; l <= 1.0; l++)
    for (float k = -1.0; k <= 1.0; k++)
    for (float j = -1.0; j <= 1.0; j++)
    for (float i = -1.0; i <= 1.0; i++)
    {
        vec4 cellNeighbor = vec4(i, j, k, l);
        vec4 jitter = hash4D(mod(point + cellNeighbor, uWrap * scale));
        vec4 diff = cellNeighbor - frac + jitter;
        float d = length(diff);
        value += exp2(-32.0 / uSmoothing * d); // Accumulate fast-decaying exponential of length.
    }
    return -(1.0 / 32.0 * uSmoothing) * log2(value);
}

float iterateWorley4D (vec4 uv)
{
    float value = 0.0;
    float itValue = 0.0;
    for (float iteration = 0.0; iteration < ITERATION_COUNT; iteration++)
    {
        float scale = exp2(iteration);
        #ifdef MODE_DISTANCE
            itValue = worley4D(uv + iteration, scale);
        #endif
        #ifdef MODE_INDEX
            itValue = worley4DIndex(uv + iteration, scale);
        #endif
        #ifdef MODE_DISTANCE_SMOOTH
            itValue = worley4DSmooth(uv + iteration, scale);
        #endif
        value += (itValue - 0.5) / scale;
    }
    return value + 0.5;
}

void main ()
{
    vec4 uv = vec4(outTexCoord, 0.0, 0.0);
    float value = iterateWorley4D(uv);
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
