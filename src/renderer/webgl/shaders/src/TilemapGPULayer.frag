#version 100
#pragma phaserTemplate(shaderName)

#pragma phaserTemplate(extensions)

#pragma phaserTemplate(features)

#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

/* Redefine MAX_ANIM_FRAMES to support animations with different frame numbers. */
#define MAX_ANIM_FRAMES 0

#pragma phaserTemplate(fragmentDefine)

uniform vec2 uResolution;
uniform sampler2D uMainSampler;
uniform sampler2D uLayerSampler;
uniform vec2 uMainResolution;
uniform vec2 uLayerResolution;
uniform float uTileColumns;
uniform vec4 uTileWidthHeightMarginSpacing;
uniform float uAlpha;
uniform float uTime;

#if MAX_ANIM_FRAMES > 0
uniform sampler2D uAnimSampler;
uniform vec2 uAnimResolution;
#endif

varying vec2 outTexCoord;
varying vec2 outTileStride;

#pragma phaserTemplate(outVariables)

// Utility to support smooth pixel art.
vec2 getTexRes ()
{
    return uMainResolution;
}

// Convert a vec4 texel to a float.
float floatTexel (vec4 texel)
{
    return texel.r * 255.0 + (texel.g * 255.0 * 256.0) + (texel.b * 255.0 * 256.0 * 256.0) + (texel.a * 255.0 * 256.0 * 256.0 * 256.0);
}

struct Tile
{
    float index;
    vec2 uv; // In texels.
    #if MAX_ANIM_FRAMES > 0
    bool animated;
    #endif
    bool empty;
};

Tile getLayerData (vec2 coord)
{
    vec2 texelCoord = coord * uLayerResolution;
    vec2 tile = floor(texelCoord);
    vec2 uv = fract(texelCoord);

    // Invert Y, as textures are flipped in GL.
    uv.y = 1.0 - uv.y;

    vec4 texel = texture2D(uLayerSampler, (tile + 0.5) / uLayerResolution) * 255.0;

    float flags = texel.a;

    /* Check for empty tile flag in bit 28. */
    if (flags == 16.0)
    {
        return Tile(
            0.0,
            vec2(0.0),
            #if MAX_ANIM_FRAMES > 0
            false,
            #endif
            true
        );
    }

    /* Bit 31 is flipX. */
    bool flipX = flags > 127.0;

    /* Bit 30 is flipY. */
    bool flipY = mod(flags, 128.0) > 63.0;

    #if MAX_ANIM_FRAMES > 0
    /* Bit 29 is animation. */
    bool animated = mod(flags, 64.0) > 31.0;
    #endif

    if (flipX)
    {
        uv.x = 1.0 - uv.x;
    }

    if (flipY)
    {
        uv.y = 1.0 - uv.y;
    }

    float index = texel.r + (texel.g * 256.0) + (texel.b * 256.0 * 256.0);

    return Tile(
        index,
        uv * uTileWidthHeightMarginSpacing.xy,
        #if MAX_ANIM_FRAMES > 0
        animated,
        #endif
        false
    );
}

// Returns the texel coordinates of the tile in the main texture.
vec2 getFrameCorner (float index)
{
    float x = mod(index, uTileColumns);
    float y = floor(index / uTileColumns);
    vec2 xy = vec2(x, y);

    return xy * outTileStride + uTileWidthHeightMarginSpacing.zz;
}

#if MAX_ANIM_FRAMES > 0
// Given an animation index, returns the current frame index.
float animationIndex (float index)
{
    // Get initial animation data.
    float animTextureWidth = uAnimResolution.x;
    vec2 index2D = vec2(mod(index, animTextureWidth), floor(index / animTextureWidth));
    vec4 animDurationTexel = texture2D(uAnimSampler, (index2D + 0.5) / uAnimResolution);
    index2D = vec2(mod(index + 1.0, animTextureWidth), floor((index + 1.0) / animTextureWidth));
    vec4 animIndexTexel = texture2D(uAnimSampler, (index2D + 0.5) / uAnimResolution);

    float animDuration = floatTexel(animDurationTexel);
    float animIndex = floatTexel(animIndexTexel);

    // Seek the correct frame.
    float animTime = mod(uTime, animDuration);
    float animTimeAccum = 0.0;
    for (int i = 0; i < MAX_ANIM_FRAMES; i++)
    {
        index2D = vec2(mod(animIndex, animTextureWidth), floor(animIndex / animTextureWidth));
        animDurationTexel = texture2D(uAnimSampler, (index2D + 0.5) / uAnimResolution);
        float frameDuration = floatTexel(animDurationTexel);
        animTimeAccum += frameDuration;
        if (animTime <= animTimeAccum)
        {
            // Found the frame.
            break;
        }

        // Proceed to the next frame, in 2-texel strides.
        animIndex += 2.0;
    }
    // The index is 1 texel over from the duration.
    animIndex += 1.0;

    // Derive the animation frame index.
    index2D = vec2(mod(animIndex, animTextureWidth), floor(animIndex / animTextureWidth));
    animIndexTexel = texture2D(uAnimSampler, (index2D + 0.5) / uAnimResolution);
    float animFrameIndex = floatTexel(animIndexTexel);

    return animFrameIndex;
}
#endif

vec2 getTileTexelCoord (Tile tile)
{
    if (tile.empty)
    {
        return vec2(0.0);
    }
    float index = tile.index;

    #if MAX_ANIM_FRAMES > 0
    // Animated tile seek.
    if (tile.animated)
    {
        index = animationIndex(index);
    }
    #endif

    vec2 frameCorner = getFrameCorner(index);
    return frameCorner + tile.uv;
}

#pragma phaserTemplate(fragmentHeader)

struct Samples {
    vec4 color;
    #pragma phaserTemplate(defineSamples)
};

// Get all samples that directly contribute to a given texel color.
Samples getColorSamples (vec2 texCoord)
{
    Samples samples;

    // // Debug: show the texture coordinates.
    // samples.color = vec4(texCoord, 0.0, 1.0);
    // return samples;

    samples.color = texture2D(
        uMainSampler,
        // Flip Y to convert from texel space to GL texture space.
        vec2(texCoord.x, 1.0 - texCoord.y)
    );

    #pragma phaserTemplate(getSamples)

    return samples;
}

Samples mixSamples (Samples samples1, Samples samples2, float alpha)
{
    Samples samples;

    samples.color = mix(samples1.color, samples2.color, alpha);

    #pragma phaserTemplate(mixSamples)

    return samples;
}

// Get the set of samples that will be used to calculate the final color of a fragment.
Samples getFinalSamples (Tile tile, vec2 layerTexCoord)
{
    vec2 texelCoord = getTileTexelCoord(tile);
    vec2 texCoord = texelCoord / uMainResolution;
    #pragma phaserTemplate(texCoord)
    #ifndef FEATURE_BORDERFILTER
    return getColorSamples(texCoord);
    #else
    #pragma phaserTemplate(finalSamples)
    vec2 wh = uTileWidthHeightMarginSpacing.xy;
    vec2 frameCorner = getFrameCorner(tile.index);
    vec2 frameCornerOpposite = frameCorner + wh;
    vec2 texCoordClamped = clamp(texCoord, (frameCorner + 0.5) / uMainResolution, (frameCornerOpposite - 0.5) / uMainResolution);
    vec2 dTexelCoord = (texCoord - texCoordClamped) * uMainResolution;
    dTexelCoord.y = -dTexelCoord.y;
    vec2 offsets = sign(dTexelCoord);
    Samples samples0 = getColorSamples(texCoordClamped);
    if (offsets.x == 0.0)
    {
        if (offsets.y == 0.0)
        {
            // No border conditions.
            return samples0;
        }
        // Vertical border condition.
        Tile tileY = getLayerData(layerTexCoord + (offsets - dTexelCoord) / wh / uLayerResolution);
        vec2 texelCoordY = getTileTexelCoord(tileY);
        vec2 texCoordY = texelCoordY / uMainResolution;
        Samples samplesY = getColorSamples(texCoordY);
        return mixSamples(samples0, samplesY, abs(dTexelCoord.y));
    }
    else
    {
        if (offsets.y == 0.0)
        {
            // Horizontal border condition.
            Tile tileX = getLayerData(layerTexCoord + (offsets - dTexelCoord) / wh / uLayerResolution);
            vec2 texelCoordX = getTileTexelCoord(tileX);
            vec2 texCoordX = texelCoordX / uMainResolution;
            Samples samplesX = getColorSamples(texCoordX);
            return mixSamples(samples0, samplesX, abs(dTexelCoord.x));
        }
        // Corner border condition.
        Tile tileX = getLayerData(layerTexCoord + (offsets * vec2(1.0, 0.0) - dTexelCoord) / wh / uLayerResolution);
        vec2 texelCoordX = getTileTexelCoord(tileX);
        vec2 texCoordX = texelCoordX / uMainResolution;
        Samples samplesX = getColorSamples(texCoordX);

        Tile tileY = getLayerData(layerTexCoord + (offsets * vec2(0.0, 1.0) - dTexelCoord) / wh / uLayerResolution);
        vec2 texelCoordY = getTileTexelCoord(tileY);
        vec2 texCoordY = texelCoordY / uMainResolution;
        Samples samplesY = getColorSamples(texCoordY);

        Tile tileXY = getLayerData(layerTexCoord + (offsets - dTexelCoord) / wh / uLayerResolution);
        vec2 texelCoordXY = getTileTexelCoord(tileXY);
        vec2 texCoordXY = texelCoordXY / uMainResolution;
        Samples samplesXY = getColorSamples(texCoordXY);

        // Mix the samples.
        Samples samples1 = mixSamples(samples0, samplesX, abs(dTexelCoord.x));
        Samples samples2 = mixSamples(samplesY, samplesXY, abs(dTexelCoord.x));
        return mixSamples(samples1, samples2, abs(dTexelCoord.y));
    }
    #endif
}

void main ()
{
    vec2 layerTexCoord = outTexCoord;
    Tile tile = getLayerData(layerTexCoord);

    Samples samples = getFinalSamples(tile, layerTexCoord);

    vec4 fragColor = samples.color;
    #pragma phaserTemplate(declareSamples)

    #pragma phaserTemplate(fragmentProcess)

    fragColor *= uAlpha;

    gl_FragColor = fragColor;
}
