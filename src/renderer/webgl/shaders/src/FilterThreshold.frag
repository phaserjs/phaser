// THRESHOLD_FS
#pragma phaserTemplate(shaderName)

precision mediump float;

uniform sampler2D uMainSampler;
uniform vec4 edge1;
uniform vec4 edge2;
uniform vec4 invert;

varying vec2 outTexCoord;

void main ()
{
    vec4 color = texture2D(uMainSampler, outTexCoord);

    // Smoothstep color between edge1 and edge2, but linear.
    color = clamp((color - edge1) / (edge2 - edge1), 0.0, 1.0);

    // Invert the color if needed.
    color = mix(color, 1.0 - color, invert);

    gl_FragColor = color;
}
