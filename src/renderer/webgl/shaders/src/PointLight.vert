#define SHADER_NAME PHASER_POINTLIGHT_VS

precision mediump float;

uniform mat4 uProjectionMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uModelMatrix;

attribute vec2 inPosition;
attribute vec2 inLightPosition;
attribute vec4 inLightColor;
attribute float inLightRadius;

varying vec2 lightPosition;
varying vec4 lightColor;
varying float lightRadius;

void main ()
{
    lightRadius = inLightRadius;
    lightColor = inLightColor;
    lightPosition = inLightPosition;

    gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(inPosition, 1.0, 1.0);
}
