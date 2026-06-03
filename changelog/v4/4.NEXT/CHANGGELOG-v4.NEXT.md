# Phaser 4 Changelog

## Version 4.NEXT

### New Features

- `Mesh2D` game object renders textured triangles. It batches with regular sprites.
- `TintModes.MULTIPLY_TWO` is a new tint mode which uses a secondary color. This can create powerful new tint effects, such as fire or inversion.
  - To support this, the encoding of tint mode in shaders with the `ApplyTint` addition has been changed. The `inTintEffect` shader attribute has changed from a `float` to a `vec4`, and its encoding has changed from a float32 to four uint8s. This should only affect deep uses of the render system.
- `Timestep#setFPSLimit` method changes the frame rate at runtime. This method updates derived properties, making it safer than manually adjusting `Timestep#fpsLimit`.

### Fixes

- SpriteGPULayer no longer tries to access global namespace for Phaser functionality, which can cause a crash in modules.
- SpriteGPULayer no longer has a Mask component, as it's a Canvas feature but the object is WebGL only.
- `DrawingContext` no longer attempts to unbind textures based on the game canvas, which cannot exist and just wastes time.
