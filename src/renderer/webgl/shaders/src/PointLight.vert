#define SHADER_NAME PHASER_POINTLIGHT_VS

precision mediump float;

uniform mat4 uProjectionMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uModelMatrix;

attribute vec2 inPosition;
attribute vec2 inLightPosition;
attribute vec4 inLightColor;
attribute float inLightRadius;
attribute float inLightIntensity;

varying vec4 lightPosition;
varying vec4 lightColor;
varying float lightRadius;

void main ()
{
    mat4 mvp = uProjectionMatrix * uViewMatrix * uModelMatrix;

    lightColor = inLightColor;
    lightRadius = inLightRadius;
    lightPosition = mvp * vec4(inLightPosition, 1.0, 1.0);

    gl_Position = mvp * vec4(inPosition, 1.0, 1.0);
}
