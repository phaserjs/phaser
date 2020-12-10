#define SHADER_NAME PHASER_BITMAP_MASK_FS

precision mediump float;

uniform vec2 uResolution;
uniform sampler2D uMainSampler;
uniform sampler2D uMaskSampler;
uniform bool uInvertMaskAlpha;

void main ()
{
    vec2 uv = gl_FragCoord.xy / uResolution;
    vec4 mainColor = texture2D(uMainSampler, uv);
    vec4 maskColor = texture2D(uMaskSampler, uv);
    float alpha = mainColor.a;

    if (!uInvertMaskAlpha)
    {
        alpha *= (maskColor.a);
    }
    else
    {
        alpha *= (1.0 - maskColor.a);
    }

    gl_FragColor = vec4(mainColor.rgb * alpha, alpha);
}
