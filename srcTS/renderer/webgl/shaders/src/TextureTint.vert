#define SHADER_NAME PHASER_TEXTURE_TINT_VS

precision mediump float;

uniform mat4 uProjectionMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uModelMatrix;

attribute vec2 inPosition;
attribute vec2 inTexCoord;
attribute float inTintEffect;
attribute vec4 inTint;

varying vec2 outTexCoord;
varying float outTintEffect;
varying vec4 outTint;

void main () 
{
    gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(inPosition, 1.0, 1.0);

    outTexCoord = inTexCoord;
    outTint = inTint;
    outTintEffect = inTintEffect;
}

