# New Features

* `Text.setRTL` is a new method that allows you to set a Text Game Object as being rendered from right-to-left, instead of the default left to right (thanks @rexrainbow)
* `FX.Circle.backgroundAlpha` is a new property that allows you to set the amount of the alpha of the background color in the Circle FX (thanks @rexrainbow)

# Updates

* The `WebAudioSoundManager` will now bind the `body` to the `removeEventListener` method, if it exists, to prevent memory leaks (thanks @wjaykim)

# Bug Fixes

* `Particle.scaleY` would always be set to the `scaleX` value, even if given a different one within the config. It will now use its own value correctly.
* `Array.Matrix.RotateLeft` was missing the `total` parameter, which controls how many times to rotate the matrix.
* `Array.Matrix.RotateRight` was missing the `total` parameter, which controls how many times to rotate the matrix.
* `Array.Matrix.TranslateMatrix` didn't work with any translation values above 1 due to missing parameters in `RotateLeft` and `RotateRight`
* `FX.Blur` didn't set the `quality` parameter to its property, meaning it wasn't applied in the shader, causing it to always use a Low Blur quality (unless modified post-creation).
* The `BlurFXPipeline` didn't bind the quality of shader specified in the controller, meaning it always used the Low Blur shader, regardless of what the FX controller asked for.
* The `FXBlurLow` fragment shader didn't have the `offset` uniform. This is now passed in and applued to the resulting blur, preventing it from creating 45 degree artifacts (thanks Wayfinder)
* The `Tilemap.createFromObjects` method wouldn't always copy custom properties to the target objects or Data Manager. Fix #6391 (thanks @samme @paxperscientiam)

## Examples, Documentation, Beta Testing and TypeScript

My thanks to the following for helping with the Phaser 3 Examples, Beta Testing, Docs, and TypeScript definitions, either by reporting errors, fixing them, or helping author the docs:

@samme
