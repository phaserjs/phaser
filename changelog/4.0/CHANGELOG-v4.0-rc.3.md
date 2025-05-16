# Version 4.0 - Release Candidate 3

This release candidate introduces better pixel art controls, and fixes performance issues related to pixel art options.

Updates since RC2:

## New Features

- `GameObject#vertexRoundMode` added to control vertex pixel rounding on a per-object basis.
  - Options include:
    - `"off"`: Never round vertex positions.
    - `"safe"`: Round vertex positions if the object is "safe": it is rendering with a transform matrix which only affects the position, not other properties such as scale or rotation.
    - `"safeAuto"` (default): Like "safe", but only if rendering through a camera where `roundPixels` is enabled.
    - `"full"`: Always round vertex positions. This can cause sprites to wobble if their vertices are not safely aligned with the pixel resolution, e.g. during rotations. This is good for a touch of PlayStation 1 style jank.
    - `"fullAuto"`: Like "full", but only if rendering through a camera where `roundPixels` is enabled.
  - `GameObject#willRoundVertices(camera, onlyTranslated)` returns whether vertices should be rounded. In the unlikely event that you need to control vertex rounding even more precisely, you are intended to override this method.
- `Blocky` filter added. This is similar to Pixelate, but it picks just a single color from the image, preserving the palette of pixel art. You can also configure the pixel width and height, and offset. This is a good option for pixelating a retro game at high resolution, setting up for additional filters such as CRT emulation.

## Changes

- WebGL2 canvases are now compatible with the WebGL renderer.
- Optimize multi-texture shader.
  - Shader branching pattern changed to hopefully be more optimal on a wider range of devices.
  - Shader will not request the maximum number of textures if it doesn't need them, improving performance on many mobile devices.
  - Shader no longer performs vertex rounding. This will prevent many situations where a batch was broken up, degrading performance.

## Fixes

- `WebGLSnapshot` and snapshot functions based on it now return the correct pixel, instead of the one above it (or nothing if they're at the top of the image).
- `ArcadePhysics#closest()` and `#furthest()` are properly defined (thanks @samme).
- `GamepadPlugin.stopListeners` and `GamepadPlugin.disconnectAll` now have guards around them so they won't try to invoke functions on potentially undefined gamepads (thanks @cryonautlex)
- Arcade Physics OverlapCirc() and OverlapRect() error when useTree is false. Fix #7112 (thanks @samme)

## Documentation / TypeScript Enhancements

Thanks to the following people:

@ospira 
@samme
@OuttaBounds
@raaaahman
