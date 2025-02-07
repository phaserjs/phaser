// ShaderQuad vertex shader
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

attribute vec2 inPosition;
attribute vec2 inTexCoord;

// The position of the fragment within the quad.
// This is a value between 0 and 1 across the quad.
// 0,1 is the top-left, 1,0 is the bottom right.
varying vec2 outTexCoord;

#pragma phaserTemplate(outVariables)

#pragma phaserTemplate(vertexHeader)

void main ()
{
    gl_Position = uProjectionMatrix * vec4(inPosition, 1.0, 1.0);

    outTexCoord = inTexCoord;

    #pragma phaserTemplate(vertexProcess)
}
