#extension GL_EXT_draw_buffers : require

#define SHADER_NAME PHASER_GBUFFER_FS

precision mediump float;

uniform sampler2D uMainSampler;
uniform sampler2D uNormSampler;

varying vec2 outTexCoord;
varying vec4 outTint;

void main()
{
    vec4 color = texture2D(uMainSampler, outTexCoord) * vec4(outTint.rgb * outTint.a, outTint.a);
    vec3 normal = texture2D(uNormSampler, outTexCoord).rgb;

    gl_FragData[0] = color;
    gl_FragData[1] = vec4(normal, color.a);
}
