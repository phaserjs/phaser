#define SHADER_NAME PHASER_IMAGE_BAKED_LAYER_VS

precision mediump float;

uniform mat4 uProjectionMatrix;
uniform mat3 uViewMatrix;
uniform vec3 uCameraScrollAndAlpha;
uniform int uRoundPixels;
uniform vec2 uResolution;
uniform float uTime;

// Vertex buffer attributes

// 0 - BL, 1 - TL, 2 - BR, 3 - TR
attribute float inVertex;

// Instance buffer attributes
attribute vec4 inPositionX;
attribute vec4 inPositionY;
attribute vec4 inRotation;
attribute vec4 inScaleX;
attribute vec4 inScaleY;
attribute vec3 inOriginAndTintFill;
attribute vec4 inScrollFactorX;
attribute vec4 inScrollFactorY;
attribute vec4 inFrameUVs;
attribute vec4 inTintBlend;
attribute vec4 inTintTL;
attribute vec4 inTintTR;
attribute vec4 inTintBL;
attribute vec4 inTintBR;
attribute vec4 inAlpha;

varying vec2 outTexCoord;
varying float outTintEffect;
varying vec4 outTint;

const float PI = 3.14159265359;
const float HALF_PI = PI / 2.0;
const float BOUNCE_OVERSHOOT = 1.70158;
const float BOUNCE_OVERSHOOT_PLUS = BOUNCE_OVERSHOOT + 1.0;
const float BOUNCE_OVERSHOOT_IN_OUT = BOUNCE_OVERSHOOT * 1.525;
const float BOUNCE_OVERSHOOT_IN_OUT_PLUS = BOUNCE_OVERSHOOT_IN_OUT + 1.0;

float animate (vec4 anim)
{
    float value = anim.x;
    float a = anim.y;
    float b = anim.z;
    float c = anim.w;

    int type = int(floor(c));

    if (type == 0 || a == 0.0 || b == 0.0)
    {
        // None
        return value;
    }

    float duration = b;
    float offset = mod(c, 1.0) * b;
    bool yoyo = b < 0.0;

    float rawTime = uTime / duration + offset;
    float time = mod(rawTime, 1.0);
    if (yoyo && mod(rawTime, 2.0) > 1.0)
    {
        time = 1.0 - time;
    }

    if (type == 1)
    {
        // Linear
        return value + a * time;
    }
    else if (type == 10)
    {
        // Quad.easeOut
        return value + a * time * (2.0 - time);
    }
    else if (type == 11)
    {
        // Quad.easeIn
        return value + a * time * time;
    }
    else if (type == 12)
    {
        // Quad.easeInOut
        time *= 2.0;
        if (time < 1.0)
        {
            return value + a * time * time * 0.5;
        }
        time -= 1.0;
        return value + a * -0.5 * (time * (time - 2.0) - 1.0);
    }
    else if (type == 20)
    {
        // Cubic.easeOut
        time -= 1.0;
        return value + a * (time * time * time + 1.0);
    }
    else if (type == 21)
    {
        // Cubic.easeIn
        return value + a * time * time * time;
    }
    else if (type == 22)
    {
        // Cubic.easeInOut
        time *= 2.0;
        if (time < 1.0)
        {
            return value + a * time * time * time * 0.5;
        }
        time -= 2.0;
        return value + a * 0.5 * (time * time * time + 2.0);
    }
    else if (type == 30)
    {
        // Quart.easeOut
        time -= 1.0;
        return value + a * (1.0 - time * time * time * time);
    }
    else if (type == 31)
    {
        // Quart.easeIn
        return value + a * time * time * time * time;
    }
    else if (type == 32)
    {
        // Quart.easeInOut
        time *= 2.0;
        if (time < 1.0)
        {
            return value + a * time * time * time * time * 0.5;
        }
        time -= 2.0;
        return value + a * -0.5 * (time * time * time * time - 2.0);
    }
    else if (type == 40)
    {
        // Quint.easeOut
        time -= 1.0;
        return value + a * (time * time * time * time * time + 1.0);
    }
    else if (type == 41)
    {
        // Quint.easeIn
        return value + a * time * time * time * time * time;
    }
    else if (type == 42)
    {
        // Quint.easeInOut
        time *= 2.0;
        if (time < 1.0)
        {
            return value + a * time * time * time * time * time * 0.5;
        }
        time -= 2.0;
        return value + a * 0.5 * (time * time * time * time * time + 2.0);
    }
    else if (type == 50)
    {
        // Sine.easeOut
        return value + a * sin(time * HALF_PI);
    }
    else if (type == 51)
    {
        // Sine.easeIn
        return value + a * (1.0 - cos(time * HALF_PI));
    }
    else if (type == 52)
    {
        // Sine.easeInOut
        return value + a * 0.5 * (1.0 - cos(PI * time));
    }
    else if (type == 60)
    {
        // Expo.easeOut
        return value + a * (1.0 - pow(2.0, -10.0 * time));
    }
    else if (type == 61)
    {
        // Expo.easeIn
        return value + a * pow(2.0, 10.0 * (time - 1.0) - 0.001);
    }
    else if (type == 62)
    {
        // Expo.easeInOut
        time *= 2.0;
        if (time < 1.0)
        {
            return value + a * 0.5 * pow(2.0, 10.0 * (time - 1.0));
        }
        time -= 1.0;
        return value + a * 0.5 * (2.0 - pow(2.0, -10.0 * (time - 1.0)));
    }
    else if (type == 70)
    {
        // Circ.easeOut
        time -= 1.0;
        return value + a * sqrt(1.0 - time * time);
    }
    else if (type == 71)
    {
        // Circ.easeIn
        return value + a * (1.0 - sqrt(1.0 - time * time));
    }
    else if (type == 72)
    {
        // Circ.easeInOut
        time *= 2.0;
        if (time < 1.0)
        {
            return value + a * -0.5 * (sqrt(1.0 - time * time) - 1.0);
        }
        time -= 2.0;
        return value + a * 0.5 * (sqrt(1.0 - time * time) + 1.0);
    }
    else if (type == 90)
    {
        // Back.easeOut
        time -= 1.0;
        return value + a * (time * time * (BOUNCE_OVERSHOOT_PLUS * time + BOUNCE_OVERSHOOT) + 1.0);
    }
    else if (type == 91)
    {
        // Back.easeIn
        return value + a * time * time * (BOUNCE_OVERSHOOT_PLUS * time - BOUNCE_OVERSHOOT);
    }
    else if (type == 92)
    {
        // Back.easeInOut
        time *= 2.0;
        if (time < 1.0)
        {
            return value + a * 0.5 * (time * time * (BOUNCE_OVERSHOOT_IN_OUT_PLUS * time - BOUNCE_OVERSHOOT_IN_OUT));
        }
        time -= 2.0;
        return value + a * 0.5 * (time * time * (BOUNCE_OVERSHOOT_IN_OUT_PLUS * time + BOUNCE_OVERSHOOT_IN_OUT) + 2.0);
    }
    else if (type == 100)
    {
        // Bounce.easeOut
        if (time < 1.0 / 2.75)
        {
            return value + a * (7.5625 * time * time);
        }
        else if (time < 2.0 / 2.75)
        {
            time -= 1.5 / 2.75;
            return value + a * (7.5625 * time * time + 0.75);
        }
        else if (time < 2.5 / 2.75)
        {
            time -= 2.25 / 2.75;
            return value + a * (7.5625 * time * time + 0.9375);
        }
        else
        {
            time -= 2.625 / 2.75;
            return value + a * (7.5625 * time * time + 0.984375);
        }
    }
    else if (type == 101)
    {
        // Bounce.easeIn
        time = 1.0 - time;
        if (time < 1.0 / 2.75)
        {
            return value + a * (1.0 - 7.5625 * time * time);
        }
        else if (time < 2.0 / 2.75)
        {
            time -= 1.5 / 2.75;
            return value + a * (1.0 - (7.5625 * time * time + 0.75));
        }
        else if (time < 2.5 / 2.75)
        {
            time -= 2.25 / 2.75;
            return value + a * (1.0 - (7.5625 * time * time + 0.9375));
        }
        else
        {
            time -= 2.625 / 2.75;
            return value + a * (1.0 - (7.5625 * time * time + 0.984375));
        }
    }
    else if (type == 102)
    {
        bool reverse = false;
        // Bounce.easeInOut
        if (time < 0.5)
        {
            time = 1.0 - time * 2.0;
            reverse = true;
        }

        if (time < 1.0 / 2.75)
        {
            time = 7.5625 * time * time;
        }
        else if (time < 2.0 / 2.75)
        {
            time -= 1.5 / 2.75;
            time = 7.5625 * time * time + 0.75;
        }
        else if (time < 2.5 / 2.75)
        {
            time -= 2.25 / 2.75;
            time = 7.5625 * time * time + 0.9375;
        }
        else
        {
            time -= 2.625 / 2.75;
            time = 7.5625 * time * time + 0.984375;
        }

        if (reverse)
        {
            return value + a * (1.0 - time) * 0.5;
        }
        return value + a * time * 0.5 + 0.5;
    }
    else if (type == 110)
    {
        // Stepped
        return value + a * floor(time + 0.5);
    }

    // Default (should not happen)
    return value;
}

void main ()
{
    float positionX = animate(inPositionX);
    float positionY = animate(inPositionY);
    float rotation = animate(inRotation);
    float scaleX = animate(inScaleX);
    float scaleY = animate(inScaleY);
    float scrollFactorX = animate(inScrollFactorX);
    float scrollFactorY = animate(inScrollFactorY);
    float tintBlend = animate(inTintBlend);
    float alpha = animate(inAlpha);

    vec2 origin = inOriginAndTintFill.xy;
    float tintFill = inOriginAndTintFill.z;

    float x = -origin.x;
    float y = -origin.y;
    float u = inFrameUVs.x;
    float v = inFrameUVs.y;
    vec4 tint = inTintTL;

    if (inVertex == 0.0)
    {
        // Bottom-left
        y = 1.0 - origin.y;
        v = inFrameUVs.w;
        tint = inTintBL;
    }
    // 1.0 is top-left and uses the initial values.
    else if (inVertex == 2.0)
    {
        // Bottom-right
        x = 1.0 - origin.x;
        y = 1.0 - origin.y;
        u = inFrameUVs.z;
        v = inFrameUVs.w;
        tint = inTintBR;
    }
    else if (inVertex == 3.0)
    {
        // Top-right
        x = 1.0 - origin.x;
        u = inFrameUVs.z;
        tint = inTintTR;
    }

    vec3 position = vec3(x * scaleX, y * scaleY, 1.0);

    // Create and initialize the transform matrix.
    float sine = sin(rotation);
    float cosine = cos(rotation);
    mat3 transformMatrix = mat3(
        cosine, sine, 0.0,
        -sine, cosine, 0.0,
        positionX - uCameraScrollAndAlpha.x * scrollFactorX, positionY - uCameraScrollAndAlpha.y * scrollFactorY, 1.0
    );

    // Transform the position.
    position = uViewMatrix * transformMatrix * position;

    // Alpha handling.
    alpha *= uCameraScrollAndAlpha.z;
    tint.a *= alpha;

    gl_Position = uProjectionMatrix * vec4(position.xy, 1.0, 1.0);

    if (uRoundPixels == 1)
    {
        gl_Position.xy = floor(((gl_Position.xy + 1.0) * 0.5 * uResolution) + 0.5) / uResolution * 2.0 - 1.0;
    }

    outTexCoord = vec2(u, v);
    outTint = mix(vec4(1.0, 1.0, 1.0, tint.a), tint, tintBlend);
    outTintEffect = tintFill;
}
