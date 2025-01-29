# Version 4.0 - beta 4

## Fixes and Improvements

- Limit `roundPixels` to only operate when objects are axis-aligned and unscaled. This prevents flicker on transforming objects.
- Fix `TextureSource.resolution` being ignored in WebGL.
  - This fixes an issue where increasing text resolution increased text size.
- Fix `DynamicTexture` using a camera without the required methods.
- Remove `WebGLAttribLocationWrapper` as it is unused.
- Remove `WebGLRenderer.textureIndexes` as `glTextureUnits.unitIndices` now fills this role.
- Remove dead code and unused/unconnected properties from `WebGLRenderer`.
- Switch texture orientation to match WebGL standards.
