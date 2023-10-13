# New Features - Arcade Physics

* Arcade Physics Bodies have a new property called `slideFactor`. This is a Vector2 that controls how much velocity is retained by a Body after it has been pushed by another Body. The default value is 1, which means it retains all of its velocity. If set to zero, it will retain none of it. This allows you to create a Body that can be pushed around without imparting any velocity to it.
* `Body.setSlideFactor` is a new method that sets the Body's `slideFactor` property.
* The Arcade Physics World has a new method `nextCategory` which will create a new collision category and return it. You can define up to 32 unique collision categories per world.
* Arcade Physics Bodies have two new properties: `collisionCategory` and `collisionMask`. These allow you to set a specific collision category and list of categories the body will collide with. This allows for fine-grained control over which bodies collide with which others. The default is that all bodies collide with all others, just like before.
* `setCollisionCategory` is a new method available on Arcade Physics Bodies that allows you to set the collision category of the body. It's also available on Arcade Sprites, Images, Tilemap Layers, Groups and Static Groups directly.
* `setCollidesWith` is a new method available on Arcade Physics Bodies that allows you to set which collision categories the body should collide with. It's also available on Arcade Sprites, Images, Tilemap Layers, Groups and Static Groups directly.
* `resetCollision` is a new method available on Arcade Physics Bodies that allows you to reset the collision category and mask to their defaults. It's also available on Arcade Sprites, Images, Tilemap Layers, Groups and Static Groups directly.

The default is as before: all bodies collide with each other. However, by using the categories you now have much more fine-grained control over which objects collide together, or not. They are filtered out at the top-level, meaning you can have a Sprite set to not collide with a Physics Group and it will skip checking every single child in the Group, potentially saving a lot of processing time.

The new collision categories are used automatically by either directly calling the `collide` or `overlap` methods, or by creating a Collider object. This allows you to use far less colliders than you may have needed previously and skip needing to filter the pairs in the collision handlers.

# New Features

* `Text.setRTL` is a new method that allows you to set a Text Game Object as being rendered from right-to-left, instead of the default left to right (thanks @rexrainbow)
* `FX.Circle.backgroundAlpha` is a new property that allows you to set the amount of the alpha of the background color in the Circle FX (thanks @rexrainbow)
* `Physics.Arcade.World.singleStep` is a new method that will advance the Arcade Physics World simulation by exactly 1 step (thanks @monteiz)
* `Tilemaps.ObjectLayer.id` is a new property that returns the ID of the Object Layer, if specified within Tiled, or zero otherwise. You can now access the unique layer ID of Tiled layers if the event a map doesn't have unique layer names (thanks @rui-han-crh)
* `Tilemaps.LayerData.id` is a new property that returns the ID of the Data Layer, if specified within Tiled, or zero otherwise (thanks @rui-han-crh)
* `Text.setLetterSpacing` is a new method and `Text.lineSpacing` is the related property that allows you to set the spacing between each character of a Text Game Object. The value can be either negative or positive, causing the characters to get closer or further apart. Please understand that enabling this feature will cause Phaser to render each character in this Text object one by one, rather than use a draw for the whole string. This makes it extremely expensive when used with either long strings, or lots of strings in total. You will be better off creating bitmap font text if you need to display large quantities of characters with fine control over the letter spacing (thanks @Ariorh1337)
* `ParticleEmitter.clearDeathZones` is a new method that will clear all previously created Death Zones from a Particle Emitter (thanks @rexrainbow)
* `ParticleEmitter.clearEmitZones` is a new method that will clear all previously created Emission Zones from a Particle Emitter (thanks @rexrainbow)
* The `GameObject.setTexture` method has 2 new optional parameters: `updateSize` and `updateOrigin`, which are both passed to the `setFrame` method and allows you to control if the size and origin of the Game Object should be updated when the texture is set (thanks @Trissolo)
* Both the Animation Config and the Play Animation Config allow you to set a new boolean property `randomFrame`. This is `false` by default, but if set, it will pick a random frame from the animation when it _starts_ playback. This allows for much more variety in groups of sprites created at the same time, using the same animation. This is also reflected in the new `Animation.randomFrame` and `AnimationState.randomFrame` properties.
* You can now use a `Phaser.Types.Animations.PlayAnimationConfig` object in the `anims` property of the `ParticleEmitter` configuration object. This gives you far more control over what happens to the animation when used by particles, including setting random start frames, repeat delays, yoyo, etc. Close #6478 (thanks @michalfialadev)
* `TilemapLayer.setTintFill` is a new method that will apply a fill-based tint to the tiles in the given area, rather than an additive-based tint, which is what the `setTint` method uses.
* `Tile.tintFill` is a new boolean property that controls if the tile tint is additive or fill based. This is used in the TilemapLayerWebGLRenderer function.

# Updates

* The `WebAudioSoundManager` will now bind the `body` to the `removeEventListener` method, if it exists, to prevent memory leaks (thanks @wjaykim)
* The `AnimationManager.globalTimeScale` property is now applied to all Game Objects using the Animation component, allowing you to globally speed-up or slow down all animating objects (thanks @TJ09)
* The `Rope` Game Object now calls `initPostPipeline` allowing you to use Post FX directly on it, such as glow, blur, etc. Fix #6550 (thanks @rexrainbow)
* The `Tween.stop` method will now check to see if `Tween.parent` is set. If not, it won't try to set a pending removal state or dispatch an event, which should help guard against errors where `Tween.stop` is called by mistake on already destroyed tweens (thanks @orcomarcio)
* The `Tween.remove` method will now check to see if `Tween.parent` exists before trying to remove it from the parent. This should help guard against errors where `Tween.remove` is called by mistake on already removed or destroyed tweens. Fix #6539 (thanks @orcomarcio)
* `Particle.alpha` is now clamped to the range 0 to 1 within the `update` method, preventing it from going out of range. Fix #6551 (thanks @orcomarcio)
* `Math.Wrap` has been reverted to the previous version. Fix #6479 (thanks @EmilSV)
* The `Graphics` Game Object will now set a default line and fill style to fully transparent and black. This prevents issues where a Graphics object would render with a color set in other Shape Game Objects if it had been drawn to and no style was previous set (thanks Whitesmith)
* The WebGLRenderer will now validate that the `mipmapFilter` property in the Game Config is a valid mipmap before assigning it.
* A small amount of unused code has been removed from the `Polygon.setTo` method (thanks @Trissolo)
* The `WebGLRenderer.deleteFramebuffer` method has been updated so it now tests for the existence of a COLOR and DEPTH_STENCIL attachments, and if found, removes the bindings and deletes the stencil buffer. The code that previously deleted the `RENDERERBUFFER_BINDING` has also been removed to avoid side-effects.
* If you make a `Mesh` Game Object interactive, it will now bind to the scope of the Mesh and uses the current `faces` in the hit area callback, rather than the faces as defined when the Mesh was made interactive. This will help keep the input in sync with a potentially changing Mesh structure (thanks @rexrainbow)
* iOS and any browser identifying as `AppleWebKit` will now set the `Device.es2019` flag to `true`. This causes Phaser to use the native array Stable Sort. This fixes an issue where overlapping particles could flicker on iOS. Fix #6483 (thanks @mattkelliher @spayton)
* The `Text.dirty` Game Object property has been removed. It wasn't used internally at all, so was just adding confusion and using space.
* The Request Video Frame polyfill will now check first to see if the browser supports `HTMLVideoElement` before trying to inspect its prototype. This should help in non-browser environments.
* `Plane.originX` and `originY` are two new read-only properties that return the origin of the Plane, which is always 0.5 (thanks @rexrainbow)
* The `LoaderPlugin` will now call `removeAllListeners()` as part of its `shutdown` method, which will clear any event listeners bound to a Loader instance of the Scene, during the Scene shutdown. Fix #6633 (thanks @samme)
* `SetCollisionObject` is a new function that Arcade Physics bodies use internally to create and reset their `ArcadeBodyCollision` data objects.
* `DynamicTexture.setFromRenderTarget` is a new method that syncs the internal Frame and TextureSource GL textures with the Render Target GL textures.
* When a framebuffer is deleted, it now sets its `renderTexture` property to `undefined` to ensure the reference is cleared.

# Bug Fixes

* The `PostFXPipeline` will now set `autoResize` to `true` on all of its `RenderTarget` instances. This fixes an issue where the `PostFXPipeline` would not resize the render targets when the game size changed, causing them to become out of sync with the game canvas. Fix #6503 (thanks @Waclaw-I)
* `Particle.scaleY` would always be set to the `scaleX` value, even if given a different one within the config. It will now use its own value correctly.
* `Array.Matrix.RotateLeft` was missing the `total` parameter, which controls how many times to rotate the matrix.
* `Array.Matrix.RotateRight` was missing the `total` parameter, which controls how many times to rotate the matrix.
* `Array.Matrix.TranslateMatrix` didn't work with any translation values above 1 due to missing parameters in `RotateLeft` and `RotateRight`
* `FX.Blur` didn't set the `quality` parameter to its property, meaning it wasn't applied in the shader, causing it to always use a Low Blur quality (unless modified post-creation).
* The `BlurFXPipeline` didn't bind the quality of shader specified in the controller, meaning it always used the Low Blur shader, regardless of what the FX controller asked for.
* The `FXBlurLow` fragment shader didn't have the `offset` uniform. This is now passed in and applied to the resulting blur, preventing it from creating 45 degree artifacts (thanks Wayfinder)
* The `Tilemap.createFromObjects` method wouldn't always copy custom properties to the target objects or Data Manager. Fix #6391 (thanks @samme @paxperscientiam)
* The `scale.min` and `scale.max` `width` and `height` properties in Game Config were ignored by the Game constructor, which was expecting `minWidth` and `minHeight`. This now matches the documentation. Fix #6501 (thanks @NikitaShpanko @wpederzoli)
* Due to a copy-paste bug, the `Actions.GetLast` function had the same code as the `GetFirst` function. It now does what you'd expect it to do. Fix #6513 (thanks @dmokel)
* The `TilemapLayer.PutTileAt` method would use an incorrect local GID if the Tilemap Layer wasn't using all available tilesets. Fix #5931 (thanks @christianvoigt @wjaykim)
* The `TextureManager.addSpriteSheet` method would fail if a `Texture` instance was given as the second parameter, throwing a `Cannot read property 'key' of null` (thanks @charlieschwabacher)
* The `HexagonalCullBounds` function incorrectly referenced `this` within it, instead of `layer` (thanks @DaliborTrampota)
* The `HexagonalGetTileCorners` function incorrectly referenced `this` within it, instead of `layer` (thanks @DaliborTrampota)
* The `HexagonalTileToWorldXY` function incorrectly referenced `this` within it, instead of `layer` (thanks @DaliborTrampota)
* The `BitmapText` Game Object will now reset the WebGL Texture unit on flush, which fixes an issue of a flush happening part-way during the rendering a BitmapText (thanks @EmilSV)
* When using interpolation for a Particle Emitter operation, such as: `x: { values: [ 50, 500, 200, 800 ] }` it would fail to set the final value unless you specified the `interpolation` property as well. It now defaults to `linear` if not given. Fix #6551 (thanks @orcomarcio)
* The Matter Physics `ignoreGravity` boolean is now checked during the Matter Engine internal functions, allowing this property to now work again. Fix #6473 (thanks @peer2p)
* `Group.createFromConfig` will now check to see if the config contains either `internalCreateCallback` or `internalRemoveCallback` and set them accordingly. This fixes an issue where the callbacks would never be set if specified in an array of single configuration objects. Fix #6519 (thanks @samme)
* `PhysicsGroup` will now set the `classType` and null the `config` when an array of single configuration objects is given in the constructor. Fix #6519 (thanks @samme)
* The `PathFollower.pathUpdate` method will now check if the `tween` property has a valid `data` component before running the update. This prevents a call to `PathFollower.stopFollow` from throwing a `Cannot read properties of null (reading '0')` error as it tried to do a single update post stop. Fix #6508 (thanks @francois-dibulo)
* Added missing parameter to some function calls in `Structs.ProcessQueue#add` (thanks @Trissolo)
* `Tile` was incorrectly using the `Alpha` Game Object component, instead of the `AlphaSingle` component, which meant although the methods implied you could set a different alpha per tile corner, it was never reflected in the rendering. It has now been updated to use just the single alpha value. Fix #6594 (thanks @jcoppage)
* The `TextureManager.addAtlasJSONArray` method would fail if a `Texture` instance was given as the second parameter, throwing a `Cannot read property 'key' of null` (thanks @1DAfT)
* The `TextureManager.addAtlasJSONHash` method would fail if a `Texture` instance was given as the second parameter, throwing a `Cannot read property 'key' of null` (thanks @1DAfT)
* The `TextureManager.addAtlasXML` method would fail if a `Texture` instance was given as the second parameter, throwing a `Cannot read property 'key' of null` (thanks @1DAfT)
* The `TextureManager.addUnityAtlas` method would fail if a `Texture` instance was given as the second parameter, throwing a `Cannot read property 'key' of null` (thanks @1DAfT)
* `DynamicTexture.preDestroy` was never called, leading to an accumulation of framebuffers in memory. This method has now been renamed to `destroy` and cleans all references correctly.
* If you gave the `width` or `height` in the Game Config object as a string it would multiply the value given by the parent size, often leading to a huge game canvas, or causing WebGL errors as it tried to create a texture larger than the GPU could handle. This has now been strengthened. If you give a string with a % at the end, it works as before, i.e. `"100%"` or `"50%"` to set the scale based on the parent. If you don't include the %, or use another unit, such as `"800px"` it will now be treated as a fixed value, not a percentage.
* The `ParticleEmitterWebGLRenderer` has been refactored so that the `particle.frame` is used as the source of the `glTexture` used in the batch and also if a new texture unit is required. This fixes issues where a Particle Emitter would fail to use the correct frame from a multi-atlas texture. Fix #6515 (thanks @Demeno)
* `StaticBody.setSize` will now check to see if the body has a Game Object or not, and only call `getCenter` and the frame sizes if it has. This fixes a bug where calling `physics.add.staticBody` would throw an error if you provided a width and height. Fix #6630 (thanks @Legend-Master)
* The `DynamicTexture.fill` method will now correctly draw the fill rectangle if the `width` and `height` are provided in WebGL, where-as before it would assume the y axis started from the bottom-left instead of top-left. Fix #6615 (thanks @rexrainbow)
* Calling the `Line.setLineWidth` method on the Line Shape Game Object would result in a line with double the thickness it should have had in WebGL. In Canvas it was the correct width. Both renderers now match. Fix #6604 (thanks @AlvaroNeuronup)
* The `DynamicTexture` was leaking memory by leaving a WebGLTexture in memory when its `setSize` method was called. This happens automatically on instantiation, meaning that if you created DynamicTextures and then destroyed them frequently, memory would continue to increase (thanks David)
* `DynamicTexture.width` and `height` were missing from the class definition, even though they were set and used internally. They're now exposed as read-only properties.
* The `BitmapMask` wouldn't correctly set the gl viewport when binding, which caused the mask to distort in games where the canvas resizes from its default. Fix #6527 (thanks @rexrainbow)

## Examples, Documentation, Beta Testing and TypeScript

My thanks to the following for helping with the Phaser 3 Examples, Beta Testing, Docs, and TypeScript definitions, either by reporting errors, fixing them, or helping author the docs:

@samme
@AlvaroEstradaDev
@julescubtree
@emadkhezri
