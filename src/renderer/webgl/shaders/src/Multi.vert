#pragma phaserTemplate(shaderName)

#pragma phaserTemplate(extensions)

#pragma phaserTemplate(features)

#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

// Bias to avoid floating-point rounding errors around 0.5.
#define ROUND_BIAS 0.5001

#pragma phaserTemplate(vertexDefine)

uniform mat4 uProjectionMatrix;
uniform int uRoundPixels;
uniform vec2 uResolution;

attribute vec2 inPosition;
attribute vec2 inTexCoord;
attribute float inTexDatum;
attribute float inTintEffect;
attribute vec4 inTint;

varying vec2 outTexCoord;
varying float outTexDatum;
varying float outTintEffect;
varying vec4 outTint;

#pragma phaserTemplate(outVariables)

#pragma phaserTemplate(vertexHeader)

void main ()
{
    vec2 position = uRoundPixels == 1 ? floor(inPosition + ROUND_BIAS) : inPosition;

    gl_Position = uProjectionMatrix * vec4(position, 1.0, 1.0);

    outTexCoord = inTexCoord;
    outTexDatum = inTexDatum;
    outTint = inTint;
    outTintEffect = inTintEffect;

    #pragma phaserTemplate(vertexProcess)
}
