#define SHADER_NAME SHADOW_FS

precision mediump float;

uniform sampler2D uMainSampler;

varying vec2 outTexCoord;

uniform vec2 lightPosition;
uniform vec4 color;
uniform float decay;
uniform float power;
uniform float intensity;
uniform int samples;

const int MAX = 12;

void main ()
{
    vec4 texture = texture2D(uMainSampler, outTexCoord);

    vec2 pc = (lightPosition - outTexCoord) * intensity;

    float shadow = 0.0;
    float limit = max(float(MAX), float(samples));

    for (int i = 0; i < MAX; ++i)
    {
        if (i >= samples)
        {
            break;
        }

        shadow += texture2D(uMainSampler, outTexCoord + float(i) * decay / limit * pc).a * power;
    }

    float mask = 1.0 - texture.a;

    gl_FragColor = mix(texture, color, shadow * mask);
}
