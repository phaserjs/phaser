# Version 3.88 - Minami - 11th February 2025

## New Features

* `Transform.getWorldPoint` is a new method that will return the World point as a Vector2 of a Game Object, factoring in parents if applicable (thanks @samme)
* `Utils.Array.GetFirst` can now search from the end of the array when setting `startIndex` to -1.
* `DynamicTexture` and by extension `RenderTexture` now have a new boolean property `forceEven` in their constructor, `setSize` and `resize` methods. This will force the given width and height values to be rounded up to the nearest even value. This significantly improves the rendering quality of the render texture in most circumstances, so the flag is `true` by default. This is a potentially breaking change, so if you know you need an odd sized texture, please set the value to `false`. Fix #6988 (thanks @rexrainbow)

## Updates

* `Tween.isNumberTween` is a new boolean property that tells if the Tween is a NumberTween, or not.
* The `TransformMatrix.setTransform` method has been updated so that it uses the old way of passing in matrix values for Canvas 2D. This fixes the error "Failed to execute 'setTransform' on 'CanvasRenderingContext2D': 6 arguments required, but only 1 present." in old legacy browsers such as Chromium Embedded Framework. Fix #6965 (thanks @rafa-fie)
* Handlers for both `mousedown` and `mouseup` have been added for unlocking Web Audio. Both events occur before a `click` event, allowing for earlier audio unlocking on devices that use a mouse (thanks @pavle-goloskokovic)
* In both the Canvas and WebGL Renderer the background color, as set in the game config, is applied directly to the canvas immediately upon creation, rather than at the first render step. This may avoid some 'flashes' of color in certain circumstances (thanks @pavle-goloskokovic)
* The Texture Manager will now fail gracefully when a texture isn't created as a result of calling the `addBase64` method. Rather than the error "TypeError: null is not an object (evaluating 'texture.source')" is will not return early (thanks @samme)
* Both `TweenBuilder` and `NumberTweenBuilder` have been updated to use `GetFastValue` for most properties instead of `GetValue`.
* The `Transform.getWorldTransformMatrix` method will now destroy the parent matrix at the end, if it was created within the method.
* The Arcade Physics `Body.setGameObject` and `StaticBody.setGameObject` methods have been updated to do the following: Return if no valid Game Object is passed. Disable and null the body of the existing Game Object if the Body has one. Set the `body` property, even if it doesn't exist (converts non-physics objects into physics objects). Calls `setSize` to update the body dimensions to make the new Game Object and finally sets `enable` based on the given parameter, which is now correctly referenced. The StaticBody version also has a new parameter, `enable` which matches that of the Dynamic Body and defaults to `true` (the original state). Fix #6969 (thanks @yongzheng7)
* The Arcade Physics `ArcadeColliderType` has been updated to include `Physics.Arcade.StaticBody`. Fix #6967 (thanks @yongzheng7)
* `Phaser.Types.GameObjects.Text.TextStyle` now includes `letterSpacing`: a positive or negative amount to add to the spacing between characters. Fix #7002 (thanks @Stever1388)
* `Tilemaps.Parsers.Tiled.ParseTilesets`, `Tilemaps.Parsers.Tiled.BuildTilesetIndex` and `Tilemaps.ImageCollection.addImage` have been updated to include `width` and `height` of each individual image. Fix #6990 (thanks @stickleprojects)
* `Tilemaps.Components.RenderDebug` and `Tilemaps.Parsers.Tiled.BuildTilesetIndex` have been updated to include `width` and `height` offsets in Image Collections.
* Added a warning to `Tilemaps.Components.GetTilesWithinShape` when attempting to use this method with non orthogonal tilemaps.
* Changed the `Cameras.Scene2D.Camera.preRender` method from protected to public. Fix #7020 (thanks @zoubingwu)

## Bug Fixes

* `TweenData.update` will now check if the Tween is a Number Tween and apply the final start/end value to the result on completion, instead of the eased value as calculated by the change made in v3.87.
* `BaseTweenData.duration` can now never be zero or less than zero, which would trigger NaN errors. It's now clamped to a minimum of 0.01ms. Fix #6955 (thanks @kainage)
* Fixed the properties in the `FontFileConfig` (thanks @samme)
* `Matter.World.update` could hang and crash the browser if a large delta value was given to it, such as returning to a long-dormant tab. The Matter Runner config values are now properly passed through, preventing this from happening. Fix #6977 (thanks @ubershmekel @samme)
* `Phaser.Physics.Matter.Components.Transform#scale` correctly scales the physics body with the GameObject. Fix #7001 (thanks @Stever1388)
* `Phaser.Textures.Frame.setCropUVs` updated crop calculation to include the `spriteSourceSize`. Fix #6996 (thanks @CrispMind)
* `Phaser.Tilemaps.Parsers.Tiled.ParseJSONTiled` updated hexagonal tilemaps to correctly calculate the `widthInPixels` and `heightInPixels` based on the hexagonal overlapping tiles. Fix #6992 (thanks @ptantiku)
* `Phaser.Display.Color.Interpolate.RGBWithRGB` now correctly returns a `Phaser.Types.Display.ColorObject` that includes `r`, `g`, `b`, `a` and `color` values. Fix #6979 (thanks @XWILKINX)
* Fixed incorrect Arcade Physics circle separation logic for circle to circle, and circle to rectangle collisions. The logic was incorrectly moving only one body, even if both could be moved. Fix #6963 (thanks @samme)
* `Phaser.Plugins.PluginManager` automatically boots plugins when the game config render type is set to `Phaser.HEADLESS`. Fix #6893 (thanks @hubertgrzeskowiak)
* Tweens created with `persist` set to `true` and given a `completeDelay` value are no longer destroyed and can be replayed. Fix #7008 (thanks @Stever1388)
* The `Tweens.TweenChain` `onStart` event is now dispatched properly. Fix #7007 (thanks @Stever1388)
* `GameObjects.Particles.Zones.DeathZone` now uses world position coordinates instead of local position coordinates following the particle emitter position. Fix #7006 (thanks @Stever1388)
* Merged pull request #7009 from @samme that prevents hanging timer events with repeats and negative delays. Fix #7004 (thanks @Stever1388)
* When adding a new Tween, passing an event listener callback outside the `Phaser.Types.Tweens.TweenBuilderConfig` object is now correctly executed without errors. Fix #7003 (thanks @Stever1388)
* A `GameObjects.Text` created with `wordwrap` and with `letterSpacing` applied now takes into account the provided `letterSpacing` value to correctly wrap lines. Fix #7002 (thanks @Stever1388)
* Creating new `GameObjects.DOMElement` sets the GameObject's `displayWidth` and `displayHeight` using its `scaleX` and `scaleY` values instead of the DOM elements `getBoundingClientRect()` values. Fix #6871 (thanks @HawkenKing)
* Setting scale `mode` to `Phaser.Scale.FIT` and `autoCenter` to `Phaser.Scale.CENTER_BOTH` correctly centres canvas on iOS devices. Fix #6862 (thanks @HawkenKing)
* On hex maps, creating a blank layer with the `Tilemaps.Tilemap.createBlankLayer` method now correctly sets the `hexSideLength` as loaded from the hex tilemap. Fix #6074 (thanks @wwoods)
* `Animations.AnimationState.play` method now prioritises the `frameRate` property when it is set in the `PlayAnimationConfig` object over animation data loaded from an external file.
* Fixed an issue where sounds / music would stop playing in iOS 17.5.1+ or iOS18+ after losing/gaining focus in Safari. The Web Audio Sound Manager will now listen for the 'visible' event and suspend and resume the context as a result. Fix #6829 (thanks @JanAmbrozic @condeagustin)
* The `Layer` Game Object method `setToTop` would throw an exception: `getDisplayList is not a function`. This method has now been added to the Game Object. Fix #7014 (thanks @leha-games @rexrainbow)
* Fixed an issue where the Particle `EmitterOp` `defaultEmit()` always returned `undefined`, causing particle problems if you gave only an `onUpdate` callback. Also if you configured an EmitterOp with `onEmit` or `onUpdate`, the op's current value would be incorrect (an object) until the first emit. Fix #7016 (thanks @urueda @samme)

## Examples, Documentation, Beta Testing and TypeScript

Thanks to the following for helping with the Phaser Examples, Beta Testing, Docs, and TypeScript definitions, either by reporting errors, fixing them, or helping author the docs:

@samme
@justin-calleja
