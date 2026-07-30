// PANORAMA_BLUR_FS
#pragma phaserTemplate(shaderName)

precision mediump float;

uniform sampler2D uMainSampler;
uniform float uRadius;
uniform float uPower;

varying vec2 outTexCoord;

#define PI 3.14159265358979323846

#pragma phaserTemplate(fragmentHeader)

#define STEP_X 1.0 / SAMPLES_X
#define STEP_Y 1.0 / SAMPLES_Y

vec3 uvPanoramaNormal(vec2 uv)
{
    float y = uv.y * 2.0 - 1.0;

    float angle = (uv.x * 2.0 - 1.0) * PI;
    float x = sin(angle);
    float z = cos(angle);
    vec2 xz = vec2(x, z);
    xz *= sqrt(1.0 - y * y);
    return normalize(vec3(xz.x, y, xz.y));
}

void main()
{
    vec3 acc = vec3(0.0);
    float div = 0.0;

    vec3 texelNormal = uvPanoramaNormal(outTexCoord);

    for (float y = STEP_Y / 2.0; y < 1.0; y += STEP_Y)
    {
        // Texels towards the top and bottom of the panorama cover smaller arcs,
        // so we need to weight them less.
        float yWeight = cos((y * 2.0 - 1.0) * PI / 2.0);
        for (float x = STEP_X / 2.0; x < 1.0; x += STEP_X)
        {
            vec2 uv = vec2(x, y);
            vec3 sampleNormal = uvPanoramaNormal(uv);
            float dotProduct = dot(sampleNormal, texelNormal);
            dotProduct = (dotProduct - 1.0 + uRadius) / uRadius;

            if (dotProduct <= 0.0)
            {
                continue;
            }
            vec3 color = texture2D(uMainSampler, uv).rgb;

            // Reduce contribution of colors with low power.
            color *= pow(length(color), uPower);

            acc += color * dotProduct * yWeight;
            div += dotProduct * yWeight;
        }
    }

    gl_FragColor = vec4(acc / div, 1.0);
}
