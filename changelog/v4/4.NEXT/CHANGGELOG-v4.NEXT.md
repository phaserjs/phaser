# Phaser 4 Changelog

## Version 4.NEXT

### New Features

- New game config options:
    - `render.alphaStrategy`: hint to shaders to handle alpha in different ways.
    - `render.stencil`: disable stencil buffer creation in a game, saving memory.
    - `render.stencilAlphaStrategy`: set the default alpha strategy used within `Stencil` objects, where regular alpha does nothing.
- `CustomContext` game object is a container which can modify the `DrawingContext` at render time. This is an advanced rendering technique which reaches into the deep settings of the renderer. Potential uses include:
    - Toggling stencil testing
    - Selectively activating alpha handling strategies
    - Freehand GL scissor modification
- `Mesh2D` game object renders textured triangles. It batches with regular sprites.
- `Stencil` game object is a container whose contents modify the stencil buffer. This is a fast way to persistently mask the game canvas. There are many ways to combine stencils. The default approach is to add layers to the stencil mask.
    - Unlike stencil masks in Phaser 3, Stencil objects are universal, persistent, and support anything as a stencil source, so long as it draws pixels. Use sprites and filter outputs as stencil sources!
    - Operating modes include `addLayer`, `subtractLayer`, `clear`, and `clearRegion`. Add and subtract can be inverted.
- `StencilReference` game object re-renders a target `Stencil` with different settings. This is useful for removing or reusing stencil geometry.
- `AlphaStrategy` setting used in the render system allows you to use GLSL `discard` instead of alpha in many shaders. This is inefficient, but is useful for some effects and situations.
    - Game config can set a default alpha strategy.
    - Stencil and CustomContext allow you to set an alpha strategy.
    - Most Phaser shaders handle alpha strategy. Custom shaders must implement it themselves, but you can use compositing (`filtersForceComposite`) to run graphics through a compatible shader.
    - Strategies include:
        - `keep`: use alpha as normal.
        - `dither`: use a dithering algorithm to select pixels to discard.
        - `threshold`: discard all pixels below a certain alpha.
- `BatchHandler` render node now has a config option for `topology`, allowing extended nodes to opt into different triangulation modes.
- `DrawingContext` adds more controls:
    - Alpha strategy
    - Color writemask
    - Stencil parameters
- `WebGLGlobalWrapper` now handles stencil write mask.
- `WebGLStencilParametersFactory` now takes an extra `writeMask` parameter.
- `TintModes.MULTIPLY_TWO` is a new tint mode which uses a secondary color. This can create powerful new tint effects, such as fire or inversion.
  - To support this, the encoding of tint mode in shaders with the `ApplyTint` addition has been changed. The `inTintEffect` shader attribute has changed from a `float` to a `vec4`, and its encoding has changed from a float32 to four uint8s. This should only affect deep uses of the render system.
  - Game objects with the Tint component now support a second tint per corner (`tint2TopLeft` etc), and have a new method `setTint2()`. Additionally, the Mesh2D and Tile objects support constant tint via `tint2`. (TilemapGPULayer does not support tinting on tiles.)
- `Timestep#setFPSLimit` method changes the frame rate at runtime. This method updates derived properties, making it safer than manually adjusting `Timestep#fpsLimit`.

### Changes

- `GameObjects.Components.Filters` now adds its RenderStep just before the core render method. This allows other steps to run beforehand.
- `WebGLStencilParametersFactory` now defaults to:
    - `enabled: true` (stencil test is on by default; testing showed little performance impact)
    - `func: gl.EQUAL` (stencil test now passes if the stencil buffer is EQUAL to 0)

### Fixes

- `Layer` no longer has a duplicate RenderStep which does nothing.
- SpriteGPULayer no longer tries to access global namespace for Phaser functionality, which can cause a crash in modules.
- SpriteGPULayer no longer has a Mask component, as it's a Canvas feature but the object is WebGL only.
- `DrawingContext` no longer attempts to unbind textures based on the game canvas, which cannot exist and just wastes time.
