# Version 4.0 - beta 7

## Major Changes

- Camera System Rewrite

The camera system rewrite changes the way camera matrices are calculated.

The Phaser 3 camera combined position, rotation, and zoom into `Camera#matrix`. Camera scroll was appended later.

The new camera system uses two matrices. `Camera#matrix` is now a combination of rotation, zoom, and scroll. A new `Camera#matrixExternal` property includes camera position. This allows us to cleanly divide the view from the position.

This change doesn't affect how you set camera properties to change the view. It mostly affects internal systems. However, if you use camera matrices directly, be aware that they have changed.

- `Camera#matrix` now includes scroll, and excludes position.
- `Camera#matrixExternal` is a new matrix, which includes the position.
- `Camera#matrixCombined` is the multiplication of `matrix` and `matrixExternal`. This is sometimes relevant.
- The `GetCalcMatrix(src, camera, parentMatrix, ignoreCameraPosition)` method now takes `ignoreCameraPosition`, causing its return value to use the identity matrix instead of the camera's position.
- `GetCalcMatrixResults` now includes a `matrixExternal` property, and factors scroll into the `camera` and `calc` matrices.
- To get a copy of a matrix with scroll factor applied, use `TransformMatrix#copyWithScrollFactorFrom(matrix, scrollX, scrollY, scrollFactorX, scrollFactorY)`. This generally replaces cases where phrases such as `spriteMatrix.e -= camera.scrollX * src.scrollFactorX` were used.

The new system fixes many issues with nested transforms, filters, and other uses of transforms.

## Minor Additions

- Add documentation explaining how to modify a `SpriteGPULayer` efficiently.
- Add `SpriteGPULayer#insertMembers` method.
- Add `SpriteGPULayer#insertMembersData` method.
- Add `SpriteGPULayer#getDataByteSize` method.
- Add non-looping animations to `SpriteGPULayer` (set animation to `loop: false`) to support one-time particle effects and dynamic sources.
- Add creation time to `SpriteGPULayer` members.
- Add documentation for writing a `Extern#render` function.
- `TilemapLayer` and `TilemapGPULayer` now support a parent matrix during rendering.
- `Shape` now sets `filtersFocusContext = true` by default, to prevent clipping stroke off at the edges.

## Fixes and Tweaks

- Fix missing reference to Renderer events in `BatchHandler` (thanks @mikuso)
- Fix `SpriteGPULayer` segment handling (segments changed from 32 to 24 to avoid problems with 32-bit number processing)
- Allow negative acceleration in `SpriteGPULayer` member animations using Gravity.
- Rearrange `SpriteGPULayer` data encoding.
- Fix `SpriteGPULayer` failing to generate frame animations from config objects.
- Allow `TextureSource#setFlipY` to affect all textures (except compressed textures, which have fixed orientation).
- `WebGLProgramWrapper` now correctly recognizes uniforms with a value of `undefined` and can recognize if they have not changed and do not need updates.
- Set `roundPixels` game option to `false` by default. It's very easy to get messy results with this option, but it remains available for use cases where it is necessary.
- Throw an error if `DOMElement` has no container.
- Fix `TileSprite` applying `smoothPixelArt` game option incorrectly.
