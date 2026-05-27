# Phaser 4 Changelog

## Version 4.NEXT

### New Features

- `Timestep#setFPSLimit` method changes the frame rate at runtime. This method updates derived properties, making it safer than manually adjusting `Timestep#fpsLimit`.

### Fixes

- SpriteGPULayer no longer tries to access global namespace for Phaser functionality, which can cause a crash in modules.
- SpriteGPULayer no longer has a Mask component, as it's a Canvas feature but the object is WebGL only.
- `DrawingContext` no longer attempts to unbind textures based on the game canvas, which cannot exist and just wastes time.
