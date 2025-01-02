# Version 3.88 - Minami - in dev

## New Features

## Updates

* `Tween.isNumberTween` is a new boolean property that tells if the Tween is a NumberTween, or not.
* The `TransformMatrix.setTransform` method has been updated so that it uses the old way of passing in matrix values for Canvas 2D. This fixes the error "Failed to execute 'setTransform' on 'CanvasRenderingContext2D': 6 arguments required, but only 1 present." in old legacy browsers such as Chromium Embedded Framework. Fix #6965 (thanks @rafa-fie)
* Handlers for both `mousedown` and `mouseup` have been added for unlocking Web Audio. Both events occur before a `click` event, allowing for earlier audio unlocking on devices that use a mouse (thanks @pavle-goloskokovic)
* In both the Canvas and WebGL Renderer the background color, as set in the game config, is applied directly to the canvas immediately upon creation, rather than at the first render step. This may avoid some 'flashes' of color in certain circumstances (thanks @pavle-goloskokovic)
* The Texture Manager will now fail gracefully when a texture isn't created as a result of calling the `addBase64` method. Rather than the error "TypeError: null is not an object (evaluating 'texture.source')" is will not return early (thanks @samme)
* Both `TweenBuilder` and `NumberTweenBuilder` have been updated to use `GetFastValue` for most properties instead of `GetValue`.

## Bug Fixes

* `TweenData.update` will now check if the Tween is a Number Tween and apply the final start/end value to the result on completion, instead of the eased value as calculated by the change made in v3.87.
* `BaseTweenData.duration` can now never be zero or less than zero, which would trigger NaN errors. It's now clamped to a minimum of 0.01ms. Fix #6955 (thanks @kainage)
* Fixed the properties in the `FontFileConfig` (thanks @samme)

## Examples, Documentation, Beta Testing and TypeScript

Thanks to the following for helping with the Phaser Examples, Beta Testing, Docs, and TypeScript definitions, either by reporting errors, fixing them, or helping author the docs:

@samme
