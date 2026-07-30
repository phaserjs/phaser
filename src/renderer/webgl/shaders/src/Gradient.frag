// GRADIENT
#pragma phaserTemplate(shaderName)

precision highp float;

#pragma phaserTemplate(fragmentHeader)

#define PI 3.14159265358979323846

uniform int uRepeatMode;
uniform float uOffset;
uniform int uShapeMode;
uniform vec2 uShape;
uniform vec2 uStart;

varying vec2 outTexCoord;

float linear()
{
    float len = length(uShape);
    return dot(uShape, outTexCoord - uStart) / len / len;
}

float bilinear()
{
    return abs(linear());
}

float radial()
{
    return distance(uStart, outTexCoord) / length(uShape);
}

float conicSymmetric()
{
    return dot(normalize(uShape), normalize(outTexCoord - uStart)) * 0.5 + 0.5;
}

float conicAsymmetric()
{
    vec2 fromStart = outTexCoord - uStart;
    float angleFromStart = atan(fromStart.y, fromStart.x);
    float shapeAngle = atan(uShape.y, uShape.x);
    float angle = (angleFromStart - shapeAngle) / PI / 2.0;
    if (angle < 0.0) angle += 1.0;
    return angle;
}

float repeat(float value)
{
    if (uRepeatMode == 1)
    {
        // TRUNCATE: don't fill outside 0-1.
        if (value < 0.0 || value > 1.0)
        {
            discard;
        }
        return value;
    }
    else if (uRepeatMode == 2)
    {
        // SAWTOOTH: repeat modulo 1.
        return mod(value, 1.0);
    }
    else if (uRepeatMode == 3)
    {
        // TRIANGULAR: repeat back and forth, modulo 1.
        return 1.0 - abs(1.0 - mod(value, 2.0));
    }
    // EXTEND: clamp to 0 at bottom and 1 at top.
    return clamp(value, 0.0, 1.0);
}


void main()
{
    float progress = 0.0;
    if (uShapeMode == 0)
    {
        progress = linear();
    }
    else if (uShapeMode == 1)
    {
        progress = bilinear();
    }
    else if (uShapeMode == 2)
    {
        progress = radial();
    }
    else if (uShapeMode == 3)
    {
        progress = conicSymmetric();
    }
    else if (uShapeMode == 4)
    {
        progress = conicAsymmetric();
    }

    progress -= uOffset;
    progress = repeat(progress);

// `getRampAt` should be imported from Ramp.glsl to fragmentHeader via shader additions.
    vec4 bandCol = getRampAt(progress);

    // Premultiply.
    bandCol.rgb *= bandCol.a;

    gl_FragColor = bandCol;
}
