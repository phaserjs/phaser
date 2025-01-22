# Version 4.0 - beta 4

## Fixes and Improvements

- Fix Arcade Physics group collisions, `nearest` and `furthest`, and static group refresh. Thanks samme!
- Fail gracefully when a texture isn't created in `addBase64()`
- Improve RenderSteps initialization, removing a private method substitution
- Fix Layer's use of RenderSteps
- Fix reversion that removed camera zoom on separate axes
- Fix filter padding precision
- Fix filter padding offset with internal filters
- Improve `TransformMatrix.setQuad` documentation
- Fix shader not switching when TilemapLayer and TileSprite are in the same scene
