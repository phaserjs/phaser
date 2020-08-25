#define SHADER_NAME PHASER_MULTI_FS

precision mediump float;

uniform sampler2D uMainSampler[%count%];

varying vec2 outTexCoord;
varying float outTexId;
varying float outTintEffect;
varying vec4 outTint;

void main()
{
    vec4 texture;

    %forloop%

    vec4 texel = vec4(outTint.rgb * outTint.a, outTint.a);
    vec4 color = texture;

    if (outTintEffect == 0.0)
    {
        //  Multiply texture tint
        color = texture * texel;
    }
    else if (outTintEffect == 1.0)
    {
        //  Solid color + texture alpha
        color.rgb = mix(texture.rgb, outTint.rgb * outTint.a, texture.a);
        color.a = texture.a * texel.a;
    }
    else if (outTintEffect == 2.0)
    {
        //  Solid color, no texture
        color = texel;
    }

    gl_FragColor = color;
}
