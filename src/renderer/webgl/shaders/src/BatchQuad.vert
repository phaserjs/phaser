#define SHADER_NAME PHASER_BATCH_QUAD_VS

precision mediump float;

uniform mat4 uProjectionMatrix;
uniform int uRoundPixels;
uniform vec2 uResolution;

attribute vec2 inTexIdAndTintEffect;
attribute vec4 inTextureBox;
attribute vec4 inTintTL;
attribute vec4 inTintBL;
attribute vec4 inTintTR;
attribute vec4 inTintBR;
attribute mat4 inMatrix;
attribute vec3 inPositionAndIndex;

varying vec2 outTexCoord;
varying float outTexId;
varying float outTintEffect;
varying vec4 outTint;

void main ()
{
    vec2 position = inPositionAndIndex.xy;
    float index = inPositionAndIndex.z;

    gl_Position = uProjectionMatrix * inMatrix * vec4(position, 1.0, 1.0);

    if (uRoundPixels == 1)
    {
        gl_Position.xy = floor(((gl_Position.xy + 1.0) * 0.5 * uResolution) + 0.5) / uResolution * 2.0 - 1.0;
    }

    outTexCoord = position * inTextureBox.pq + inTextureBox.st;
    outTexId = inTexIdAndTintEffect.x;
    outTintEffect = inTexIdAndTintEffect.y;

    // Which corner are we?
    if (index == 0.0)
    {
        outTint = inTintTL;
    }
    else if (index == 1.0)
    {
        outTint = inTintBL;
    }
    else if (index == 2.0)
    {
        outTint = inTintTR;
    }
    else
    {
        outTint = inTintBR;
    }
}
