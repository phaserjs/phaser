# Version 3.85.3 - Itsuki - in development

## Bug Fixes

* The `Array.MoveAbove` function didn't recalculate the baseIndex after the splice, meaning the item would end up in the wrong location.
* The `HexagonalTileToWorldXY` function incorrectly used `this` instead of `layer` causing it to error in hex tilemaps with x axis staggering. Fix #6913 (thanks @jummy123)
* The `Text` Game Object could truncate the length of the Text when `setLetterSpacing` was used. Fix #6915 (thanks @monteiz @rexrainbow)
* The `EXPAND` Scale Mode would cause the error "Framebuffer status: Incomplete Attachment" under WebGL if the Phaser game loaded into an iframe or element with a size of 0 on either axis, such as when you load the game into a 0x0 iframe before expanding it. It now protects against divide by zero errors.
* The `RenderTarget.willResize` method will now check if the values given to it are actually numbers. If not it will return false.

## Examples, Documentation, Beta Testing and TypeScript

Thanks to the following for helping with the Phaser Examples, Beta Testing, Docs, and TypeScript definitions, either by reporting errors, fixing them, or helping author the docs:

