# Version 3.86 - Aoi - 11th October 2024

## Updates

* `RenderTarget.init` is a new method that will create the underlying framebuffer and texture for a Render Target. This is called in the constructor only, avoiding the need to call the `resize` method.
* `Phaser.GameObjects.Container#tempTransformMatrix` has been removed. This was an internal private Transform Matrix. It has been replaced by a global single matrix that is used instead. This removes the need for every Container to have its own instance of this temporary matrix, reducing object allocation and memory overhead.
* `BaseCamera.renderRoundPixels` is a new read-only property that is set during the Camera `preRender` method every frame. It is true if the Camera is set to render round pixels and the zoom values are integers, otherwise it is false. This is then fed into the MultiPipeline when rendering sprites and textures.

## Bug Fixes

* The Canvas Renderer and WebGL Multi Pipeline now uses the new `renderRoundPixels` boolean to determine if it can render a Sprite or a Texture with rounded position values, or not. This fixes an issue where black lines would appear between tightly grouped sprites or tiles at non-integer Camera zoom values. Fix #6907 (thanks @MarcJamesIO)
* `RenderTarget.resize` will now check the `autoResize` property before applying the change. Textures that have been locked to a fixed size, such as FX POT buffers, will no longer be resized to the full canvas dimensions, causing Out of Memory errors on some mobile devices. Fix #6914 (thanks @mikaleerhart @DavidTalevski)
* The `Array.MoveAbove` function didn't recalculate the baseIndex after the splice, meaning the item would end up in the wrong location.
* The `HexagonalTileToWorldXY` function incorrectly used `this` instead of `layer` causing it to error in hex tilemaps with x axis staggering. Fix #6913 (thanks @jummy123)
* The `Text` Game Object could truncate the length of the Text when `setLetterSpacing` was used. Fix #6915 (thanks @monteiz @rexrainbow)
* The `EXPAND` Scale Mode would cause the error "Framebuffer status: Incomplete Attachment" under WebGL if the Phaser game loaded into an iframe or element with a size of 0 on either axis, such as when you load the game into a 0x0 iframe before expanding it. It now protects against divide by zero errors.
* The `RenderTarget.willResize` method will now check if the values given to it are actually numbers. If not it will return false.

## Examples, Documentation, Beta Testing and TypeScript

Thanks to the following for helping with the Phaser Examples, Beta Testing, Docs, and TypeScript definitions, either by reporting errors, fixing them, or helping author the docs:

@thompson318
