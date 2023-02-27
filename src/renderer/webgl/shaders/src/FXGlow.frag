#define SHADER_NAME GLOW_FS

precision mediump float;

uniform sampler2D uMainSampler;

varying vec2 outTexCoord;

uniform float outerStrength;
uniform float innerStrength;

uniform vec2 resolution;
uniform vec4 glowColor;
uniform bool knockout;

const float PI = 3.14159265358979323846264;

const float DIST = __DIST__;
const float SIZE = min(__SIZE__, PI * 2.0);
const float STEP = ceil(PI * 2.0 / SIZE);
const float MAX_ALPHA = STEP * DIST * (DIST + 1.0) / 2.0;

void main ()
{
    vec2 px = vec2(1.0 / resolution.x, 1.0 / resolution.y);

    float totalAlpha = 0.0;

    vec2 direction;
    vec2 displaced;
    vec4 color;

    for (float angle = 0.0; angle < PI * 2.0; angle += SIZE)
    {
        direction = vec2(cos(angle), sin(angle)) * px;

        for (float curDistance = 0.0; curDistance < DIST; curDistance++)
        {
            displaced = outTexCoord + direction * (curDistance + 1.0);

            color = texture2D(uMainSampler, displaced);

            totalAlpha += (DIST - curDistance) * color.a;
        }
    }

    color = texture2D(uMainSampler, outTexCoord);

    float alphaRatio = (totalAlpha / MAX_ALPHA);

    float innerGlowAlpha = (1.0 - alphaRatio) * innerStrength * color.a;
    float innerGlowStrength = min(1.0, innerGlowAlpha);

    vec4 innerColor = mix(color, glowColor, innerGlowStrength);

    float outerGlowAlpha = alphaRatio * outerStrength * (1.0 - color.a);
    float outerGlowStrength = min(1.0 - innerColor.a, outerGlowAlpha);

    vec4 outerGlowColor = outerGlowStrength * glowColor.rgba;

    if (knockout)
    {
        float resultAlpha = outerGlowAlpha + innerGlowAlpha;

        gl_FragColor = vec4(glowColor.rgb * resultAlpha, resultAlpha);
    }
    else
    {
        gl_FragColor = innerColor + outerGlowColor;
    }
}
