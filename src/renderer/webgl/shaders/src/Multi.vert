#define SHADER_NAME PHASER_MULTI_VS

#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform mat4 uProjectionMatrix;
// uniform bool uRoundPixels;
// uniform vec2 uResolution;

attribute vec2 inPosition;
attribute vec2 inTexCoord;
attribute float inTexId;
attribute float inTintEffect;
attribute vec4 inTint;

varying vec2 outTexCoord;
varying float outTexId;
varying float outTintEffect;
varying vec4 outTint;

void main ()
{
    gl_Position = uProjectionMatrix * vec4(inPosition, 1.0, 1.0);

    /*
    if (uRoundPixels)
    {
        //  Round to nearest pixel
        gl_Position.xy = round((gl_Position.xy + 1.0) * 0.5 * uResolution) / uResolution * 2.0 - 1.0;
    }
    */

    outTexCoord = inTexCoord;
    outTexId = inTexId;
    outTint = inTint;
    outTintEffect = inTintEffect;
}
