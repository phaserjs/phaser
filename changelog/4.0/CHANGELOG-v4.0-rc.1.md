# Version 4.0 - Release Candidate 1

Updates since beta 8:

## Changes

- Mask filter now uses current camera by default.
- `GameObject#enableLighting` now works even if the scene light manager is not enabled. The light manager must still be enabled for lights to render, but the game object flag can be set at any time.
- `YieldContext` and `RebindContext` render nodes now unbind all texture units. These nodes are used for external renderer compatibility. An external renderer could change texture bindings, leading to unexpected textures being used, so we force texture rebind.

## New Features

- `WebGLSnapshot` (used in snapshot functions) supports unpremultiplication, which is on by default. This removes dark fringes on text and objects with alpha.
- Add chainable setter methods to `Filter` component: `setFiltersAutoFocus`, `setFiltersFocusContext`, `setFiltersForceComposite`, `setRenderFilters`.
- All enhancements from Phaser v3 development have been merged. This includes:
  - `Transform#getWorldPoint`
  - `Layer#getDisplayList`
  - `DynamicTexture` and `RenderTexture` changes:
    - `forceEven` parameter forces resolution to be divisible by 2.
    - `clear(x, y, width, height)` method now takes the listed optional parameters.
  - `Rectangle` now supports rounded corners.
  - `Physics.Matter.Components.Transform#scale` for setting scaleX and scaleY together.
  - `WebGLRenderer` reveals functions around context loss:
    - `setExtensions`
    - `setContextHandlers`
    - `dispatchContextLost`
    - `dispatchContextRestored`
  - Improvements to tile handling for non-orthogonal tiles.
  - `Tween#isNumberTween`
  - Many other fixes and tweaks.

## Fixes

- Fix `WebGLSnapshot` orientation.
- Fix filters rendering outside intended camera scissor area.
- Fix reversion in BitmapText kerning.
- Fix `CaptureFrame` compatibility with `Layer` and `Container`.
- Fix `Grid` using old methods. It was supposed to use 'stroke' just like other `Shape` objects, not a unique 'outline'.
- Add `@return` tag to `FilterList#addBlend` (thanks @phasereditor2d!).
- Fix `RenderSteps` parameter propagation into `Layer` and `Container`. This resolves some missing render operations in complex situations.
- Fix `DynamicTexture` errors when rendering Masks.
- Fix camera transform matrix order issues, as seen when rendering through transformed cameras.
- Fix GL scissor sometimes failing to update. The actual issue was, we were storing the screen coordinates, but applying GL coordinates, which can be different in different-sized framebuffers. `DrawingContext` now takes screen coordinates, and sets GL coordinates in the `WebGLGlobalWrapper`.
