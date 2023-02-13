#define SHADER_NAME SHADOW_FS

precision mediump float;

uniform sampler2D uMainSampler;
uniform vec2 lightPosition;
uniform vec4 shadowColor;
uniform float decay;
uniform float power;
uniform float intensity;

varying vec2 outTexCoord;

const int SAMPLES = __SAMPLES__;

void main ()
{
    vec4 texture = texture2D(uMainSampler, outTexCoord);

    vec2 pc = (lightPosition - outTexCoord) * intensity;

    float shadow = 0.0;

    for (int i = 0; i < SAMPLES; ++i)
    {
        shadow += texture2D(uMainSampler, outTexCoord + float(i) * decay / float(SAMPLES) * pc).a * power;
    }

    float mask = 1.0 - texture.a;

    gl_FragColor = mix(texture, shadowColor, shadow * mask);
}
