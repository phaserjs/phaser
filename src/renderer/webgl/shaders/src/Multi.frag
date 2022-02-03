#define SHADER_NAME PHASER_MULTI_V2_FS
#define numTextures %count%

precision highp float;

uniform sampler2D uMainSampler[%count%];

varying vec2 outTexCoord;
varying float outTexId;
varying float outTintEffect;
varying vec4 outTint;

%getSampler%

void main ()
{
    vec4 texel = vec4(outTint.bgr * outTint.a, outTint.a);

    vec4 texture = getSampler(int(outTexId), outTexCoord);

    //  Multiply texture tint
    vec4 color = texture * texel;

    if (outTintEffect == 1.0)
    {
        //  Solid color + texture alpha
        color.rgb = mix(texture.rgb, outTint.bgr * outTint.a, texture.a);
    }
    else if (outTintEffect == 2.0)
    {
        //  Solid color, no texture
        color = texel;
    }

    gl_FragColor = color;
}
