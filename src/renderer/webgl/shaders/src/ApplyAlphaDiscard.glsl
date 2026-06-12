// Alpha discard strategy can be applied to selectively discard fragments based on their alpha value.
// This is useful for stencil operations, where transparent fragments should not be considered for the stencil buffer.
// Retained fragments are increased to alpha 1.0.
vec4 applyAlphaDiscard(vec4 fragColor)
{
    #ifdef ALPHA_DISCARD_STRATEGY_THRESHOLD
    if (fragColor.a < ALPHA_DISCARD_STRATEGY_THRESHOLD)
    {
        discard;
    }
    #endif

    #ifdef ALPHA_DISCARD_STRATEGY_DITHER
    // Generate a dither value using interleaved gradient noise.
    // Derive noise coordinates from the fragment position.
    float noise = fract(52.9829189 * fract(0.06711056 * gl_FragCoord.x + 0.00583715 * gl_FragCoord.y));
    if (noise >= fragColor.a)
    {
        discard;
    }
    #endif

    // Unpremultiply.
    return fragColor / fragColor.a;
}
