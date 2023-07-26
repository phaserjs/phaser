# New Features

* `Text.setRTL` is a new method that allows you to set a Text Game Object as being rendered from right-to-left, instead of the default left to right (thanks @rexrainbow)
* `FX.Circle.backgroundAlpha` is a new property that allows you to set the amount of the alpha of the background color in the Circle FX (thanks @rexrainbow)
* `Physics.Arcade.World.singleStep` is a new method that will advance the Arcade Physics World simulation by exactly 1 step (thanks @monteiz)
* `Tilemaps.ObjectLayer.id` is a new property that returns the ID of the Object Layer, if specified within Tiled, or zero otherwise. You can now access the unique layer ID of Tiled layers if the event a map doesn't have unique layer names (thanks @rui-han-crh)
* `Tilemaps.LayerData.id` is a new property that returns the ID of the Data Layer, if specified within Tiled, or zero otherwise (thanks @rui-han-crh)
* `Text.setLetterSpacing` is a new method and `Text.lineSpacing` is the related property that allows you to set the spacing between each character of a Text Game Object. The value can be either negative or positive, causing the characters to get closer or further apart. Please understand that enabling this feature will cause Phaser to render each character in this Text object one by one, rather than use a draw for the whole string. This makes it extremely expensive when used with either long strings, or lots of strings in total. You will be better off creating bitmap font text if you need to display large quantities of characters with fine control over the letter spacing (thanks @Ariorh1337)
* `ParticleEmitter.clearDeathZones` is a new method that will clear all previously created Death Zones from a Particle Emitter (thanks @rexrainbow)
* `ParticleEmitter.clearEmitZones` is a new method that will clear all previously created Emission Zones from a Particle Emitter (thanks @rexrainbow)

# Updates

* The `WebAudioSoundManager` will now bind the `body` to the `removeEventListener` method, if it exists, to prevent memory leaks (thanks @wjaykim)
* The `AnimationManager.globalTimeScale` property is now applied to all Game Objects using the Animation component, allowing you to globally speed-up or slow down all animating objects (thanks @TJ09)
* The `Rope` Game Object now calls `initPostPipeline` allowing you to use Post FX directly on it, such as glow, blur, etc. Fix #6550 (thanks @rexrainbow)
* The `Tween.stop` method will now check to see if `Tween.parent` is set. If not, it won't try to set a pending removal state or dispatch an event, which should help guard against errors where `Tween.stop` is called by mistake on already destroyed tweens (thanks @orcomarcio)
* The `Tween.remove` method will now check to see if `Tween.parent` exists before trying to remove it from the parent. This should help guard against errors where `Tween.remove` is called by mistake on already removed or destroyed tweens. Fix #6539 (thanks @orcomarcio)
* `Particle.alpha` is now clamped to the range 0 to 1 within the `update` method, preventing it from going out of range. Fix #6551 (thanks @orcomarcio)
* `Math.Wrap` has been reverted to the previous version. Fix #6479 (thanks @EmilSV)
* The `Graphics` Game Object will now set a default line and fill style to fully transparent and black. This prevents issues where a Graphics object would render with a color set in other Shape Game Objects if it had been drawn to and no style was previous set (thanks Whitesmith)

# Bug Fixes

* `Particle.scaleY` would always be set to the `scaleX` value, even if given a different one within the config. It will now use its own value correctly.
* `Array.Matrix.RotateLeft` was missing the `total` parameter, which controls how many times to rotate the matrix.
* `Array.Matrix.RotateRight` was missing the `total` parameter, which controls how many times to rotate the matrix.
* `Array.Matrix.TranslateMatrix` didn't work with any translation values above 1 due to missing parameters in `RotateLeft` and `RotateRight`
* `FX.Blur` didn't set the `quality` parameter to its property, meaning it wasn't applied in the shader, causing it to always use a Low Blur quality (unless modified post-creation).
* The `BlurFXPipeline` didn't bind the quality of shader specified in the controller, meaning it always used the Low Blur shader, regardless of what the FX controller asked for.
* The `FXBlurLow` fragment shader didn't have the `offset` uniform. This is now passed in and applued to the resulting blur, preventing it from creating 45 degree artifacts (thanks Wayfinder)
* The `Tilemap.createFromObjects` method wouldn't always copy custom properties to the target objects or Data Manager. Fix #6391 (thanks @samme @paxperscientiam)
* The `scale.min` and `scale.max` `width` and `height` properties in Game Config were ignored by the Game constructor, which was expecting `minWidth` and `minHeight`. This now matches the documnentation. Fix #6501 (thanks @NikitaShpanko @wpederzoli)
* Due to a copy-paste bug, the `Actions.GetLast` function had the same code as the `GetFirst` function. It now does what you'd expect it to do. Fix #6513 (thanks @dmokel)
* The `TilemapLayer.PutTileAt` method would use an incorrect local GID if the Tilemap Layer wasn't using all available tilesets. Fix #5931 (thanks @christianvoigt @wjaykim)
* The `TextureManager.addSpriteSheet` method would fail if a `Texture` instance was given as the second parameter, throwing a `Cannot read property 'key' of null` (thanks @charlieschwabacher)
* The `HexagonalCullBounds` function incorrectly referenced `this` within it, instead of `layer` (thanks @DaliborTrampota)
* The `HexagonalGetTileCorners` function incorrectly referenced `this` within it, instead of `layer` (thanks @DaliborTrampota)
* The `HexagonalTileToWorldXY` function incorrectly referenced `this` within it, instead of `layer` (thanks @DaliborTrampota)
* The `BitmapText` Game Object will now reset the WebGL Texture unit on flush, which fixes an issue of a flush happened part-way during the rendering a BitmapText (thanks @EmilSV)
* When using interpolation for a Particle Emitter operation, such as: `x: { values: [ 50, 500, 200, 800 ] }` it would fail to set the final value unless you specified the `interpolation` property as well. It now defaults to `linear` if not given. Fix #6551 (thanks @orcomarcio)
* The Matter Physics `ignoreGravity` boolean is now checked during the Matter Engine internal functions, allowing this property to now work again. Fix #6473 (thanks @peer2p)
* `Group.createFromConfig` will now check to see if the config contains either `internalCreateCallback` or `internalRemoveCallback` and set them accordingly. This fixes an issue where the callbacks would never be set if specified in an array of single configuration objects. Fix #6519 (thanks @samme)
* `PhysicsGroup` will now set the `classType` and null the `config` when an array of single configuration objects is given in the constructor. Fix #6519 (thanks @samme)
* The `PathFollower.pathUpdate` method will now check if the `tween` property has a valid `data` component before running the update. This prevents a call to `PathFollower.stopFollow` from throwing a `Cannot read properties of null (reading '0')` error as it tried to do a single update post stop. Fix #6508 (thanks @francois-dibulo)

## Examples, Documentation, Beta Testing and TypeScript

My thanks to the following for helping with the Phaser 3 Examples, Beta Testing, Docs, and TypeScript definitions, either by reporting errors, fixing them, or helping author the docs:

@samme
@AlvaroEstradaDev
@julescubtree
