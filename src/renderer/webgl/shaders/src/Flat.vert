#pragma phaserTemplate(shaderName)

#pragma phaserTemplate(extensions)

#pragma phaserTemplate(features)

#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

#pragma phaserTemplate(vertexDefine)

uniform mat4 uProjectionMatrix;
uniform vec2 uResolution;

attribute vec2 inPosition;
attribute vec4 inTint;

varying vec4 outTint;

#pragma phaserTemplate(outVariables)

#pragma phaserTemplate(vertexHeader)

void main ()
{
    gl_Position = uProjectionMatrix * vec4(inPosition, 1.0, 1.0);

    outTint = vec4(inTint.bgr * inTint.a, inTint.a);

    #pragma phaserTemplate(vertexProcess)
}
