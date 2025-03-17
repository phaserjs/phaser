# Version 4.0 - beta 8

## Changes

* Mask Filter now uses world transforms by preference when drawing the mask. This improves expected outcomes when mask objects are inside Containers.

## Additions

* Extend `RenderWebGLStep` to take the currently rendering object list and index as parameters. This allows render methods to know their context in the display list, which can be useful for optimizing third-party renderers.
  * This takes the place of `nextTypeMatch` from Phaser v3, but is much more flexible.
* Add `DynamicTexture#capture`, for rendering game objects more accurately and with greater control than `draw`.
* Add `CaptureFrame` game object, which copies the current framebuffer to a texture when it renders. This is useful for applying post-processing prior to post.

## Fixes

* Prevent `RenderTexture` from rendering while it's rendering, thus preventing infinite loops.
* Fix boundary errors on the Y axis in `TilemapGPULayer` shader, introduced after switching to GL standard texture orientation.
* Fix `Filters#focusFilters` setting camera resolution too late, leading to unexpected results on the first frame.
* Fix parent matrix application order, resolving unexpected behavior within Containers.
* Fix `FillCamera` node being misaligned/missing in cameras rendering to framebuffers.
* Fix errors when running a scene without the lighting plugin.
* Fixes to TypeScript documentation: thanks to SBCGames and mikuso for contributions!
