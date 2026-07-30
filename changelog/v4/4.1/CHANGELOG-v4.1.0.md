# Phaser 4 Changelog

## Version 4.1.0 - Salusa - 30th April 2026

### New Features

- `RenderConfig#mipmapRegeneration` option allows certain framebuffer-based objects to use mipmaps if the game is configured to use mipmaps. This has a cost because mipmaps must be recreated after every change. Currently it only applies to DynamicTextures; Filters cannot render mipmaps. Thanks @Flow!
- `Layer` is now a true `GameObject`. This fixes numerous small inconsistencies, and some big issues such as Filters not working. Thanks @rexrainbow for reporting the initial issue!
- The base filter `Controller` now has `getPaddingCeil()`, which returns the ceiling of the current padding. This is mostly used internally to avoid quality loss from fractional padding. If your code calls `getPadding()` on a filter controller (typically in a custom render node), you should replace it with `getPaddingCeil()`.

### Fixes

- Fix reversions in rounded rectangle handling. Thanks @laineus!
- Remove duplicate function definition and exposed internal code docs from `RectangleCanvasRenderer`.
- Fix duplicate texture name resulting from `RenderTexture#saveTexture`. Thanks @UnaiNeuronUp!
- Fix framebuffers (in filters and DynamicTextures) using mipmaps incorrectly. Now filters do not render with mipmaps. Thanks @Flow!
- Fix lack of default export in ESM build. Thanks @kibertoad!
- Fix lack of Class and LOG_VERSION export in ESM build. Thanks to many users including @Flow and @rex for helping investigate this!
- Fix `Utils.Array.GetRandom` often returning `null` if only `startIndex` was specified. Now it always returns an array element if part of the array is within range, as documented.
