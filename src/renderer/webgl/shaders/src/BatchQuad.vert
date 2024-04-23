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
attribute vec4 inObjectMatrixABCD;
attribute vec2 inObjectMatrixXY;
attribute vec4 inWorldMatrixABCD;
attribute vec2 inWorldMatrixXY;
attribute vec4 inViewMatrixABCD;
attribute vec2 inViewMatrixXY;
attribute vec3 inPositionAndIndex;

varying vec2 outTexCoord;
varying float outTexId;
varying float outTintEffect;
varying vec4 outTint;

mat4 assembleMatrix4 (vec4 abcd, vec2 xy)
{
    return mat4(abcd.xy, 0, 0, abcd.zw, 0, 0, 0, 0, 1, 0, xy.xy, 0, 1);
}

void main ()
{
    vec2 position = inPositionAndIndex.xy;
    float index = inPositionAndIndex.z;

    mat4 objectMatrix = assembleMatrix4(inObjectMatrixABCD, inObjectMatrixXY);
    mat4 worldMatrix = assembleMatrix4(inWorldMatrixABCD, inWorldMatrixXY);
    mat4 viewMatrix = assembleMatrix4(inViewMatrixABCD, inViewMatrixXY);

    gl_Position = uProjectionMatrix * viewMatrix * worldMatrix * objectMatrix * vec4(position, 1.0, 1.0);

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
