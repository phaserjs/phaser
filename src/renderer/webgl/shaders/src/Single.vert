#define SHADER_NAME PHASER_SINGLE_VS

precision mediump float;

uniform mat4 uProjectionMatrix;
uniform vec2 uResolution;

attribute vec2 inPosition;
attribute vec2 inTexCoord;
attribute float inTexId;
attribute float inTintEffect;
attribute vec4 inTint;

varying vec2 outTexCoord;
varying float outTintEffect;
varying vec4 outTint;

void main ()
{
    gl_Position = uProjectionMatrix * vec4(inPosition, 1.0, 1.0);

    outTexCoord = inTexCoord;
    outTint = inTint;
    outTintEffect = inTintEffect;
}
