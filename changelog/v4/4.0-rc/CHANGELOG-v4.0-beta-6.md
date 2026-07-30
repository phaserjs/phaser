# Version 4.0 - beta 6

## Additions

- Add Filter support to `Layer`.
- Allow `RenderTexture` to automatically re-render.
  - `DynamicTexture#preserve()` allows you to keep the command buffer for reuse after rendering.
  - `DynamicTexture#callback()` allows you to run callbacks during command buffer execution.
  - `RenderTexture.setRenderMode()` allows you to set the RenderTexture to automatically re-render during the render loop.

## Fixes and Eliminations

- Fix `roundPixels` handling in many places, mostly by removing it from irrelevant situations.
  - Remove `TransformMatrix#setQuad` parameter `roundPixels`, as it is no longer used.
- Filters are correctly destroyed along with their owners, unless `ignoreDestroy` is enabled. This supports multi-owner Filter controllers.
- WebGLRenderer destroys itself properly.
- Remove unnecessary transform related to camera scroll.
- Remove references to Mesh.
- Fix UV coordinates in `Shader`.
- `Shader#setTextures()` now replaces the texture array, rather than adding to it.
- Fix `SpriteGPULayer#getMember()`, which previously multiplied the index by 4.
- Fix `flipX`/`flipY` in `Filter#focusFilters`.
- Fix `BatchHandlerQuad#run()` parameter `tintFill`, which was set as a Number but should be used as a Boolean.
- Eliminate rounding in `Camera#preRender()`.
