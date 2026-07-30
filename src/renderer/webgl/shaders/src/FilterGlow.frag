// GLOW_FS
#pragma phaserTemplate(shaderName)

#define DISTANCE 10.0
#define QUALITY 10.0

#pragma phaserTemplate(fragmentDefine)

precision mediump float;

uniform sampler2D uMainSampler;

varying vec2 outTexCoord;

uniform float outerStrength;
uniform float innerStrength;
uniform float scale;

uniform vec2 resolution;
uniform vec4 glowColor;
uniform bool knockout;

const float PI = 3.14159265358979323846264;

const float MAX_ALPHA = DISTANCE * (DISTANCE + 1.0) * QUALITY / 2.0;

#pragma phaserTemplate(fragmentHeader)

void main ()
{
    vec2 px = vec2(1.0 / resolution.x, 1.0 / resolution.y) * scale;

    float totalAlpha = 0.0;
    float curAngle = 0.0;

    vec2 direction;
    vec2 displaced;
    vec4 color;

    for (float curDistance = 0.0; curDistance < DISTANCE; curDistance++)
    {
        // Offset each ring of samples by a pseudorandom factor.
        // These numbers are arbitrary.
        curAngle += fract(sin(dot(vec2(curDistance, outTexCoord.x + outTexCoord.y), vec2(12.9898, 78.233))) * 43758.5453);

        for (float i = 0.0; i < QUALITY; i++)
        {
            curAngle += PI * 2.0 / (QUALITY);
            direction = vec2(cos(curAngle), sin(curAngle)) * px;
            displaced = outTexCoord + direction * (curDistance + 1.0);

            color = boundedSampler(uMainSampler, displaced);

            totalAlpha += (DISTANCE - curDistance) * color.a;
        }
    }

    color = boundedSampler(uMainSampler, outTexCoord);

    float alphaRatio = (totalAlpha / MAX_ALPHA);

    float innerGlowAlpha = (1.0 - alphaRatio) * innerStrength * color.a;
    float innerGlowStrength = min(1.0, innerGlowAlpha);

    vec4 innerColor = mix(color, glowColor, innerGlowStrength);

    float outerGlowAlpha = alphaRatio * outerStrength * (1.0 - color.a);
    float outerGlowStrength = min(1.0 - innerColor.a, outerGlowAlpha);

    if (knockout)
    {
        float resultAlpha = outerGlowStrength + innerGlowStrength;

        gl_FragColor = vec4(glowColor.rgb * resultAlpha, resultAlpha);
    }
    else
    {
        vec4 outerGlowColor = outerGlowStrength * glowColor.rgba;

        gl_FragColor = innerColor + outerGlowColor;
    }
}
