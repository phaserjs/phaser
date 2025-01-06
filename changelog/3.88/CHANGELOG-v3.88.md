# Version 3.88 - Minami - in dev

## New Features

* `Transform.getWorldPoint` is a new method that will return the World point as a Vector2 of a Game Object, factoring in parents if applicable (thanks @samme)

## Updates

* `Tween.isNumberTween` is a new boolean property that tells if the Tween is a NumberTween, or not.
* The `TransformMatrix.setTransform` method has been updated so that it uses the old way of passing in matrix values for Canvas 2D. This fixes the error "Failed to execute 'setTransform' on 'CanvasRenderingContext2D': 6 arguments required, but only 1 present." in old legacy browsers such as Chromium Embedded Framework. Fix #6965 (thanks @rafa-fie)
* Handlers for both `mousedown` and `mouseup` have been added for unlocking Web Audio. Both events occur before a `click` event, allowing for earlier audio unlocking on devices that use a mouse (thanks @pavle-goloskokovic)
* In both the Canvas and WebGL Renderer the background color, as set in the game config, is applied directly to the canvas immediately upon creation, rather than at the first render step. This may avoid some 'flashes' of color in certain circumstances (thanks @pavle-goloskokovic)
* The Texture Manager will now fail gracefully when a texture isn't created as a result of calling the `addBase64` method. Rather than the error "TypeError: null is not an object (evaluating 'texture.source')" is will not return early (thanks @samme)
* Both `TweenBuilder` and `NumberTweenBuilder` have been updated to use `GetFastValue` for most properties instead of `GetValue`.
* The `Transform.getWorldTransformMatrix` method will now destroy the parent matrix at the end, if it was created within the method.
* The Arcade Physics `Body.setGameObject` and `StaticBody.setGameObject` methods have been updated to do the following: Return if no valid Game Object is passed. Disable and null the body of the existing Game Object if the Body has one. Set the `body` property, even if it doesn't exist (converts non-physics objects into physics objects). Calls `setSize` to update the body dimensions to make the new Game Object and finally sets `enable` based on the given parameter, which is now correctly referenced. The StaticBody version also has a new parameter, `enable` which matches that of the Dynamic Body and defaults to `true` (the original state). Fix #6969 (thanks @yongzheng7)

## Bug Fixes

* `TweenData.update` will now check if the Tween is a Number Tween and apply the final start/end value to the result on completion, instead of the eased value as calculated by the change made in v3.87.
* `BaseTweenData.duration` can now never be zero or less than zero, which would trigger NaN errors. It's now clamped to a minimum of 0.01ms. Fix #6955 (thanks @kainage)
* Fixed the properties in the `FontFileConfig` (thanks @samme)
* `Matter.World.update` could hang and crash the browser if a large delta value was given to it, such as returning to a long-dormant tab. The Matter Runner config values are now properly passed through, preventing this from happening. Fix #6977 (thanks @ubershmekel @samme)
* `Phaser.Textures.Frame.setCropUVs` updated crop calculation to include the `spriteSourceSize`. Fix #6996 (thanks @CrispMind)
* `Phaser.Tilemaps.Parsers.Tiled.ParseJSONTiled` updated hexagonal tilemaps to correctly calculate the `widthInPixels` and `heightInPixels` based on the hexagonal overlapping tiles. Fix #6992 (thanks @ptantiku)
* `Phaser.Display.Color.Interpolate.RGBWithRGB` now correctly returns a `Phaser.Types.Display.ColorObject` that includes `r`, `g`, `b`, `a` and `color` values. Fix #6979 (thanks @XWILKINX)
* Fixed incorrect Arcade Physics circle separation logic for circle to circle, and circle to rectangle collisions. The logic was incorrectly moving only one body, even if both could be moved. Fix #6963 (thanks @samme)

## Examples, Documentation, Beta Testing and TypeScript

Thanks to the following for helping with the Phaser Examples, Beta Testing, Docs, and TypeScript definitions, either by reporting errors, fixing them, or helping author the docs:

@samme
