#define SHADER_NAME PHASER_TEXTURE_TINT_FS

precision mediump float;

uniform sampler2D uMainSampler;

varying vec2 outTexCoord;
varying vec4 outTint;

void main() 
{
    vec4 texel = texture2D(uMainSampler, outTexCoord);
    texel *= vec4(outTint.rgb * outTint.a, outTint.a);
    gl_FragColor = texel;
}
