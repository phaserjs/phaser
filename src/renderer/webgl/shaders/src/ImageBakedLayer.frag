#define SHADER_NAME PHASER_IMAGE_BAKED_LAYER_FS

#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform sampler2D uMainSampler;

varying vec2 outTexCoord;
varying float outTintEffect;
varying vec4 outTint;

void main ()
{
    vec4 texture = texture2D(uMainSampler, outTexCoord);

    //  Multiply texture tint
    vec4 color = texture * outTint;

    if (outTintEffect == 1.0)
    {
        //  Solid color + texture alpha
        color.rgb = mix(texture.rgb, outTint.rgb, texture.a);
    }

    gl_FragColor = color;
}
