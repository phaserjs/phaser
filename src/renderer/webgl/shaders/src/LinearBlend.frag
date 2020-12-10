#define SHADER_NAME PHASER_LINEAR_BLEND_FS

precision mediump float;

uniform sampler2D uMainSampler1;
uniform sampler2D uMainSampler2;
uniform float uStrength;

varying vec2 outTexCoord;

void main ()
{
    vec4 frame1 = texture2D(uMainSampler1, outTexCoord);
    vec4 frame2 = texture2D(uMainSampler2, outTexCoord);

    gl_FragColor = mix(frame1, frame2 * uStrength, 0.5);
}
