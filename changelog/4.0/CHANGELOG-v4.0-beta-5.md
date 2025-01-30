# Version 4.0 - beta 5

As well as bug fixes, beta 5 includes two major components:

- SpriteGPULayer game object. This advanced renderer is designed to handle millions of background objects.
- Texture coordinates now match WebGL standards. This should bring greater compatibility with other technologies. Note that compressed textures must be re-compressed to work with this system: ensure that the Y axis starts at the bottom and increases upwards.

## Fixes and Improvements

- Limit `roundPixels` to only operate when objects are axis-aligned and unscaled. This prevents flicker on transforming objects.
- Fix `TextureSource.resolution` being ignored in WebGL.
  - This fixes an issue where increasing text resolution increased text size.
- Fix `DynamicTexture` using a camera without the required methods.
- Remove `WebGLAttribLocationWrapper` as it is unused.
- Remove `WebGLRenderer.textureIndexes` as `glTextureUnits.unitIndices` now fills this role.
- Remove dead code and unused/unconnected properties from `WebGLRenderer`.
- Switch texture orientation to match WebGL standards.
- Add SpriteGPULayer game object.
