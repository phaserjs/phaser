#pragma phaserTemplate(shaderName)

#pragma phaserTemplate(extensions)

#pragma phaserTemplate(features)

#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

// Bias to avoid floating-point rounding errors around 0.5.
#define ROUND_BIAS 0.5001

#pragma phaserTemplate(vertexDefine)

uniform mat4 uProjectionMatrix;
uniform mat3 uViewMatrix;
uniform vec3 uCameraScrollAndAlpha;
uniform int uRoundPixels;
uniform vec2 uResolution;
uniform float uTime;
uniform vec2 uDiffuseResolution;
uniform vec2 uFrameDataResolution;
uniform sampler2D uFrameDataTexture;
uniform float uGravity;

// Vertex buffer attributes

// 0 - BL, 1 - TL, 2 - BR, 3 - TR
attribute float inVertex;

// Instance buffer attributes
attribute vec4 inPositionX;
attribute vec4 inPositionY;
attribute vec4 inRotation;
attribute vec4 inScaleX;
attribute vec4 inScaleY;
attribute vec4 inAlpha;
attribute vec4 inFrame;
attribute vec4 inTintBlend;
attribute vec4 inTintTL;
attribute vec4 inTintTR;
attribute vec4 inTintBL;
attribute vec4 inTintBR;
attribute vec4 inOriginAndTintFillAndCreationTime;
attribute vec2 inScrollFactor;

varying vec2 outTexCoord;
varying float outTintEffect;
varying vec4 outTint;

#pragma phaserTemplate(outVariables)

#pragma phaserTemplate(vertexHeader)

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
    float b = abs(anim.z);
    float c = abs(anim.w);
    bool yoyo = anim.z < 0.0;
    bool loop = anim.w > 0.0;

    int type = int(floor(c));

    if (type == 0|| b == 0.0)
    {
        // None
        return value;
    }

    float duration = b;
    float delay = mod(c, 1.0) * 2.0;

    float rawTime = ((uTime - inOriginAndTintFillAndCreationTime.w) / duration) - delay;
    float time = mod(rawTime, 1.0);
    if (yoyo && (mod(rawTime, 2.0) >= 1.0))
    {
        time = 1.0 - time;
    }

    float repeats = loop ? 0.0 : floor(a);
    float timeContinuous = loop ? time : rawTime;

    #ifdef FEATURE_LINEAR
    if (type == 1)
    {
        // Linear
        return value + a * timeContinuous;
    }
    #endif
    #ifdef FEATURE_GRAVITY
    if (type == 2)
    {
        // Gravity

        // Split amplitude into integer velocity and fractional acceleration.
        float v = floor(a);
        float gravityFactor = (a - v) * 2.0 - 1.0;
        if (gravityFactor == 0.0)
        {
            gravityFactor = 1.0;
        }
        float seconds = timeContinuous * duration / 1000.0;
        float accel = uGravity * gravityFactor;

        // Compute distance from acceleration and velocity.
        // d = v * t + 0.5 * a * t^2
        return value + (v * seconds) + (0.5 * accel * seconds * seconds);
    }
    #endif
    #ifdef FEATURE_QUAD_EASEOUT

    if (type == 10)
    {
        // Quad_easeOut
        return value + a * time * (2.0 - time)
            + repeats * a;
    }
    #endif
    #ifdef FEATURE_QUAD_EASEIN
    if (type == 11)
    {
        // Quad_easeIn
        return value + a * time * time
            + repeats * a;
    }
    #endif
    #ifdef FEATURE_QUAD_EASEINOUT
    if (type == 12)
    {
        // Quad_easeInOut
        time *= 2.0;
        if (time < 1.0)
        {
            return value + a * time * time * 0.5
                + repeats * a;
        }
        time -= 1.0;
        return value + a * -0.5 * (time * (time - 2.0) - 1.0)
            + repeats * a;
    }
    #endif
    #ifdef FEATURE_CUBIC_EASEOUT
    if (type == 20)
    {
        // Cubic_easeOut
        time -= 1.0;
        return value + a * (time * time * time + 1.0)
            + repeats * a;
    }
    #endif
    #ifdef FEATURE_CUBIC_EASEIN
    if (type == 21)
    {
        // Cubic_easeIn
        return value + a * time * time * time
            + repeats * a;
    }
    #endif
    #ifdef FEATURE_CUBIC_EASEINOUT
    if (type == 22)
    {
        // Cubic_easeInOut
        time *= 2.0;
        if (time < 1.0)
        {
            return value + a * time * time * time * 0.5
                + repeats * a;
        }
        time -= 2.0;
        return value + a * 0.5 * (time * time * time + 2.0)
            + repeats * a;
    }
    #endif
    #ifdef FEATURE_QUART_EASEOUT
    if (type == 30)
    {
        // Quart_easeOut
        time -= 1.0;
        return value + a * (1.0 - time * time * time * time)
            + repeats * a;
    }
    #endif
    #ifdef FEATURE_QUART_EASEIN
    if (type == 31)
    {
        // Quart_easeIn
        return value + a * time * time * time * time
            + repeats * a;
    }
    #endif
    #ifdef FEATURE_QUART_EASEINOUT
    if (type == 32)
    {
        // Quart_easeInOut
        time *= 2.0;
        if (time < 1.0)
        {
            return value + a * time * time * time * time * 0.5
                + repeats * a;
        }
        time -= 2.0;
        return value + a * -0.5 * (time * time * time * time - 2.0)
            + repeats * a;
    }
    #endif
    #ifdef FEATURE_QUINT_EASEOUT
    if (type == 40)
    {
        // Quint_easeOut
        time -= 1.0;
        return value + a * (time * time * time * time * time + 1.0)
            + repeats * a;
    }
    #endif
    #ifdef FEATURE_QUINT_EASEIN
    if (type == 41)
    {
        // Quint_easeIn
        return value + a * time * time * time * time * time
            + repeats * a;
    }
    #endif
    #ifdef FEATURE_QUINT_EASEINOUT
    if (type == 42)
    {
        // Quint_easeInOut
        time *= 2.0;
        if (time < 1.0)
        {
            return value + a * time * time * time * time * time * 0.5
                + repeats * a;
        }
        time -= 2.0;
        return value + a * 0.5 * (time * time * time * time * time + 2.0)
            + repeats * a;
    }
    #endif
    #ifdef FEATURE_SINE_EASEOUT
    if (type == 50)
    {
        // Sine_easeOut
        return value + a * sin(time * HALF_PI)
            + repeats * a;
    }
    #endif
    #ifdef FEATURE_SINE_EASEIN
    if (type == 51)
    {
        // Sine_easeIn
        return value + a * (1.0 - cos(time * HALF_PI))
            + repeats * a;
    }
    #endif
    #ifdef FEATURE_SINE_EASEINOUT
    if (type == 52)
    {
        // Sine_easeInOut
        return value + a * 0.5 * (1.0 - cos(PI * time))
            + repeats * a;
    }
    #endif
    #ifdef FEATURE_EXPO_EASEOUT
    if (type == 60)
    {
        // Expo_easeOut
        return value + a * (1.0 - pow(2.0, -10.0 * time))
            + repeats * a;
    }
    #endif
    #ifdef FEATURE_EXPO_EASEIN
    if (type == 61)
    {
        // Expo_easeIn
        return value + a * pow(2.0, 10.0 * (time - 1.0) - 0.001)
            + repeats * a;
    }
    #endif
    #ifdef FEATURE_EXPO_EASEINOUT
    if (type == 62)
    {
        // Expo_easeInOut
        time *= 2.0;
        if (time < 1.0)
        {
            return value + a * 0.5 * pow(2.0, 10.0 * (time - 1.0))
                + repeats * a;
        }
        time -= 1.0;
        return value + a * 0.5 * (2.0 - pow(2.0, -10.0 * (time - 1.0)))
            + repeats * a;
    }
    #endif
    #ifdef FEATURE_CIRC_EASEOUT
    if (type == 70)
    {
        // Circ_easeOut
        time -= 1.0;
        return value + a * sqrt(1.0 - time * time)
            + repeats * a;
    }
    #endif
    #ifdef FEATURE_CIRC_EASEIN
    if (type == 71)
    {
        // Circ_easeIn
        return value + a * (1.0 - sqrt(1.0 - time * time))
            + repeats * a;
    }
    #endif
    #ifdef FEATURE_CIRC_EASEINOUT
    if (type == 72)
    {
        // Circ_easeInOut
        time *= 2.0;
        if (time < 1.0)
        {
            return value + a * -0.5 * (sqrt(1.0 - time * time) - 1.0)
                + repeats * a;
        }
        time -= 2.0;
        return value + a * 0.5 * (sqrt(1.0 - time * time) + 1.0)
            + repeats * a;
    }
    #endif
    #ifdef FEATURE_BACK_EASEOUT
    if (type == 90)
    {
        // Back_easeOut
        time -= 1.0;
        return value + a * (time * time * (BOUNCE_OVERSHOOT_PLUS * time + BOUNCE_OVERSHOOT) + 1.0)
            + repeats * a;
    }
    #endif
    #ifdef FEATURE_BACK_EASEIN
    if (type == 91)
    {
        // Back_easeIn
        return value + a * time * time * (BOUNCE_OVERSHOOT_PLUS * time - BOUNCE_OVERSHOOT)
            + repeats * a;
    }
    #endif
    #ifdef FEATURE_BACK_EASEINOUT
    if (type == 92)
    {
        // Back_easeInOut
        time *= 2.0;
        if (time < 1.0)
        {
            return value + a * 0.5 * (time * time * (BOUNCE_OVERSHOOT_IN_OUT_PLUS * time - BOUNCE_OVERSHOOT_IN_OUT))
                + repeats * a;
        }
        time -= 2.0;
        return value + a * 0.5 * (time * time * (BOUNCE_OVERSHOOT_IN_OUT_PLUS * time + BOUNCE_OVERSHOOT_IN_OUT) + 2.0)
            + repeats * a;
    }
    #endif
    #ifdef FEATURE_BOUNCE_EASEOUT
    if (type == 100)
    {
        // Bounce_easeOut
        if (time < 1.0 / 2.75)
        {
            return value + a * (7.5625 * time * time)
                + repeats * a;
        }
        else if (time < 2.0 / 2.75)
        {
            time -= 1.5 / 2.75;
            return value + a * (7.5625 * time * time + 0.75)
                + repeats * a;
        }
        else if (time < 2.5 / 2.75)
        {
            time -= 2.25 / 2.75;
            return value + a * (7.5625 * time * time + 0.9375)
                + repeats * a;
        }
        else
        {
            time -= 2.625 / 2.75;
            return value + a * (7.5625 * time * time + 0.984375)
                + repeats * a;
        }
    }
    #endif
    #ifdef FEATURE_BOUNCE_EASEIN
    if (type == 101)
    {
        // Bounce_easeIn
        time = 1.0 - time;
        if (time < 1.0 / 2.75)
        {
            return value + a * (1.0 - 7.5625 * time * time)
                + repeats * a;
        }
        else if (time < 2.0 / 2.75)
        {
            time -= 1.5 / 2.75;
            return value + a * (1.0 - (7.5625 * time * time + 0.75))
                + repeats * a;
        }
        else if (time < 2.5 / 2.75)
        {
            time -= 2.25 / 2.75;
            return value + a * (1.0 - (7.5625 * time * time + 0.9375))
                + repeats * a;
        }
        else
        {
            time -= 2.625 / 2.75;
            return value + a * (1.0 - (7.5625 * time * time + 0.984375))
                + repeats * a;
        }
    }
    #endif
    #ifdef FEATURE_BOUNCE_EASEINOUT
    if (type == 102)
    {
        // Bounce_easeInOut
        bool reverse = false;
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
            return value + a * (1.0 - time) * 0.5
                + repeats * a;
        }
        return value + a * time * 0.5 + 0.5
            + repeats * a;
    }
    #endif
    #ifdef FEATURE_STEPPED
    if (type == 110)
    {
        // Stepped
        return value + a * floor(time + 0.5)
            + repeats * a;
    }
    #endif
    #ifdef FEATURE_SMOOTHSTEP_EASEOUT
    if (type == 120)
    {
        // Smoothstep_easeOut
        return value + a * (smoothstep(0.0, 1.0, time / 2.0 + 0.5) * 2.0 - 1.0)
            + repeats * a;
    }
    #endif
    #ifdef FEATURE_SMOOTHSTEP_EASEIN
    if (type == 121)
    {
        // Smoothstep_easeIn
        return value + a * smoothstep(0.0, 1.0, time / 2.0) * 2.0
            + repeats * a;
    }
    #endif
    #ifdef FEATURE_SMOOTHSTEP_EASEINOUT
    if (type == 122)
    {
        // Smoothstep_easeInOut
        return value + a * smoothstep(0.0, 1.0, time)
            + repeats * a;
    }
    #endif

    // Default (should not happen)
    return value;
}

struct Frame {
    vec2 position;
    vec2 size;
    vec2 offset;
};

Frame getFrame (float frame)
{
    float index1 = floor(frame) * 3.0;
    float index2 = index1 + 1.0;
    float index3 = index1 + 2.0;
    float width = uFrameDataResolution.x;

    float x = mod(index1, width);
    float y = floor(index1 / width);

    vec4 texelUV = texture2D(
        uFrameDataTexture,
        vec2(x + 0.5, y + 0.5) / uFrameDataResolution
    );

    x = mod(index2, width);
    y = floor(index2 / width);

    vec4 texelWH = texture2D(
        uFrameDataTexture,
        vec2(x + 0.5, y + 0.5) / uFrameDataResolution
    );

    x = mod(index3, width);
    y = floor(index3 / width);

    vec4 texelOrigin = texture2D(
        uFrameDataTexture,
        vec2(x + 0.5, y + 0.5) / uFrameDataResolution
    );

    return Frame(
        vec2(
            texelUV.r + texelUV.g * 256.0,
            texelUV.b + texelUV.a * 256.0
        ) * 255.0,
        vec2(
            texelWH.r + texelWH.g * 256.0,
            texelWH.b + texelWH.a * 256.0
        ) * 255.0,
        vec2(
            texelOrigin.r + texelOrigin.g * 256.0,
            texelOrigin.b + texelOrigin.a * 256.0
        ) * 255.0 - 32768.0
    );
}

void main ()
{
    float positionX = animate(inPositionX);
    float positionY = animate(inPositionY);
    float rotation = animate(inRotation);
    float scaleX = animate(inScaleX);
    float scaleY = animate(inScaleY);
    float frame = animate(inFrame);
    float tintBlend = animate(inTintBlend);
    float alpha = animate(inAlpha);

    vec2 origin = inOriginAndTintFillAndCreationTime.xy;
    float tintFill = inOriginAndTintFillAndCreationTime.z;
    float scrollFactorX = inScrollFactor.x;
    float scrollFactorY = inScrollFactor.y;

    Frame frameData = getFrame(frame);
    vec2 uv = frameData.position / uDiffuseResolution;
    vec2 wh = frameData.size / uDiffuseResolution;
    float u = uv.s;
    float v = uv.t;
    float w = wh.s;
    float h = wh.t;
    float width = frameData.size.s;
    float height = frameData.size.t;
    vec4 tint = inTintTL;

    float x = -origin.x;
    float y = -origin.y;

    if (inVertex == 0.0)
    {
        // Bottom-left
        y = 1.0 - origin.y;
        v += h;
        tint = inTintBL;
    }
    // 1.0 is top-left and uses the initial values.
    else if (inVertex == 2.0)
    {
        // Bottom-right
        x = 1.0 - origin.x;
        y = 1.0 - origin.y;
        u += w;
        v += h;
        tint = inTintBR;
    }
    else if (inVertex == 3.0)
    {
        // Top-right
        x = 1.0 - origin.x;
        u += w;
        tint = inTintTR;
    }

    vec3 position = vec3(
        (x * width - frameData.offset.x) * scaleX,
        (y * height - frameData.offset.y) * scaleY,
        1.0
    );

    // Create the view matrix.
    mat3 viewMatrix = uViewMatrix * mat3(
        1.0, 0.0, 0.0,
        0.0, 1.0, 0.0,
        uCameraScrollAndAlpha.x * (1.0 - scrollFactorX), uCameraScrollAndAlpha.y * (1.0 - scrollFactorY), 1.0
    );

    // Create and initialize the transform matrix.
    float sine = sin(rotation);
    float cosine = cos(rotation);
    mat3 transformMatrix = mat3(
        cosine, sine, 0.0,
        -sine, cosine, 0.0,
        positionX, positionY, 1.0
    );

    // Transform the position.
    position = viewMatrix * transformMatrix * position;

    // Alpha handling.
    alpha *= uCameraScrollAndAlpha.z;
    tint.a *= alpha;

    // Round corner coordinates if the quad is not transformed.
    if (uRoundPixels == 1 && rotation == 0.0 && scaleX == 1.0 && scaleY == 1.0)
    {
        position.xy = floor(position.xy + ROUND_BIAS);
    }

    gl_Position = uProjectionMatrix * vec4(position.xy, 1.0, 1.0);

    outTexCoord = vec2(u, 1.0 - v);
    outTint = mix(vec4(1.0, 1.0, 1.0, tint.a), tint, tintBlend);
    outTintEffect = tintFill;

    #pragma phaserTemplate(vertexProcess)
}
