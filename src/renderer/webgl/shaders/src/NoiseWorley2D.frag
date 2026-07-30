// NOISE_WORLEY_2D
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

uniform vec2 uSeedX;
uniform vec2 uSeedY;
uniform vec2 uCells;
uniform vec2 uCellOffset;
uniform vec2 uVariation;
uniform vec2 uWrap;
uniform float uSmoothing;
uniform float uNormalScale;
uniform vec4 uColorStart;
uniform vec4 uColorEnd;

varying vec2 outTexCoord;

float trig(vec2 p)
{
    return fract(43757.5453*sin(dot(p, vec2(12.9898,78.233))));
}

// Convert fractional texture coordinates into 1x1 grid cells.
vec2 bigCoord (vec2 coord, float scale)
{
    return (coord + uCellOffset) * scale * uCells;
}

vec2 hash2D (vec2 coord)
{
    return vec2(
        trig(coord + uSeedX),
        trig(coord + uSeedY)
    ) * uVariation;
}

// Sharp Worley noise.
float worley2D (vec2 uv, float scale)
{
    vec2 coord = bigCoord(uv, scale);
    vec2 point = floor(coord);
    vec2 frac = fract(coord);

    float dist = 12.0;

    for (float j = -1.0; j <= 1.0; j++)
    for (float i = -1.0; i <= 1.0; i++)
    {
        vec2 cellNeighbor = vec2(i, j);
        vec2 jitter = hash2D(mod(point + cellNeighbor, uWrap * scale));
        vec2 diff = cellNeighbor - frac + jitter;
        float d = dot(diff, diff); // Squared length of diff.
        if (d < dist)
        {
            dist = d;
        }
    }
    return sqrt(dist);
}

// Worley index.
float worley2DIndex (vec2 uv, float scale)
{
    vec2 coord = bigCoord(uv, scale);
    vec2 point = floor(coord);
    vec2 frac = fract(coord);

    float dist = 12.0;
    float random = 0.0;

    for (float j = -1.0; j <= 1.0; j++)
    for (float i = -1.0; i <= 1.0; i++)
    {
        vec2 cellNeighbor = vec2(i, j);
        vec2 jitter = hash2D(mod(point + cellNeighbor, uWrap * scale));
        vec2 diff = cellNeighbor - frac + jitter;
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
float worley2DSmooth (vec2 uv, float scale)
{
    vec2 coord = bigCoord(uv, scale);
    vec2 point = floor(coord);
    vec2 frac = fract(coord);

    float value = 0.0;
    for (float j = -1.0; j <= 1.0; j++)
    for (float i = -1.0; i <= 1.0; i++)
    {
        vec2 cellNeighbor = vec2(i, j);
        vec2 jitter = hash2D(mod(point + cellNeighbor, uWrap * scale));
        vec2 diff = cellNeighbor - frac + jitter;
        float d = length(diff);
        value += exp2(-32.0 / uSmoothing * d); // Accumulate fast-decaying exponential of length.
    }
    return -(1.0 / 32.0 * uSmoothing) * log2(value);
}

float iterateWorley2D (vec2 uv)
{
    float value = 0.0;
    float itValue = 0.0;
    for (float iteration = 0.0; iteration < ITERATION_COUNT; iteration++)
    {
        float scale = exp2(iteration);
        #ifdef MODE_DISTANCE
            itValue = worley2D(uv + iteration, scale);
        #endif
        #ifdef MODE_INDEX
            itValue = worley2DIndex(uv + iteration, scale);
        #endif
        #ifdef MODE_DISTANCE_SMOOTH
            itValue = worley2DSmooth(uv + iteration, scale);
        #endif
        value += (itValue - 0.5) / scale;
    }
    return value + 0.5;
}

void main ()
{
    float value = iterateWorley2D(outTexCoord);
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
