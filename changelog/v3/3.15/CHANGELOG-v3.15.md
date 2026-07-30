# Phaser 3 Change Log

## Version 3.15.0 - Batou - 16th October 2018

Note: We are releasing this version ahead of schedule in order to make some very important iOS performance and input related fixes available. It does not contain the new Scale Manager or Spine support, both of which have been moved to 3.16 as they require a few more weeks of development.

### New Features

* You can now set the `maxLights` value in the Game Config, which controls the total number of lights the Light2D shader can render in a single pass. The default is 10. Be careful about pushing this too far. More lights = less performance. Close #4081 (thanks @FrancescoNegri)
* `Rectangle.SameDimensions` determines if the two objects (either Rectangles or Rectangle-like) have the same width and height values under strict equality.
* An ArcadePhysics Group can now pass `{ enable: false }` in its config to disable all the member bodies (thanks @samme)
* `Body.setEnable` is a new chainable method that allows you to toggle the enable state of an Arcade Physics Body (thanks @samme)
* `KeyboardPlugin.resetKeys` is a new method that will reset the state of any Key object created by a Scene's Keyboard Plugin.
* `Pointer.wasCanceled` is a new boolean property that allows you to tell if a Pointer was cleared due to a `touchcancel` event. This flag is reset during the next `touchstart` event for the Pointer.
* `Pointer.touchcancel` is a new internal method specifically for handling touch cancel events. It has the same result as `touchend` without setting any of the up properties, to avoid triggering up event handlers. It will also set the `wasCanceled` property to `true`.

### Updates

* `WebGLRenderer.deleteTexture` will check to see if the texture it is being asked to delete is the currently bound texture or not. If it is, it'll set the blank texture to be bound after deletion. This should stop `RENDER WARNING: there is no texture bound to the unit 0` errors if you destroy a Game Object, such as Text or TileSprite, from an async or timed process (thanks jamespierce)
* The `RequestAnimationFrame.step` and `stepTimeout` functions have been updated so that the new Frame is requested from raf before the main game step is called. This allows you to now stop the raf callback from within the game update or render loop. Fix #3952 (thanks @tolimeh)
* If you pass zero as the width or height when creating a TileSprite it will now use the dimensions of the texture frame as the size of the TileSprite. Fix #4073 (thanks @jcyuan)
* `TileSprite.setFrame` has had both the `updateSize` and `updateOrigin` arguments removed as they didn't do anything for TileSprites and were misleading.
* `CameraManager.remove` has a new argument `runDestroy` which, if set, will automatically call `Camera.destroy` on the Cameras removed from the Camera Manager. You should nearly always allow this to happen (thanks jamespierce)
* Device.OS has been restructured to allow fake UAs from Chrome dev tools to register iOS devices.
* Texture batching during the batch flush has been implemented in the TextureTintPipeline which resolves the issues of very low frame rates, especially on iOS devices, when using non-batched textures such as those used by Text or TileSprites. Fix #4110 #4086 (thanks @ivanpopelyshev @sachinhosmani   @maximtsai @alexeymolchan)
* The WebGLRenderer method `canvasToTexture` has a new optional argument `noRepeat` which will stop it from using `gl.REPEAT` entirely. This is now used by the Text object to avoid it potentially switching between a REPEAT and CLAMP texture, causing texture black-outs (thanks @ivanpopelyshev)
* `KeyboardPlugin.resetKeys` is now called automatically as part of the Keyboard Plugin `shutdown` method. This means, when the plugin shuts down, such as when stopping a Scene, it will reset the state of any key held in the plugin. It will also clear the queue of any pending events.
* The `Touch Manager` has been rewritten to use declared functions for all touch event handlers, rather than bound functions. This means they will now clear properly when the TouchManager is shut down.
* There is a new Input constant `TOUCH_CANCEL` which represents canceled touch events.

### Bug Fixes

* Fixed a bug in the canvas rendering of both the Static and Dynamic Tilemap Layers where the camera matrix was being multiplied twice with the layer, causing the scale and placement to be off (thanks galerijanamar)
* If you set `pixelArt` to true in your game config (or `antialias` to false) then TileSprites will now respect this when using the Canvas Renderer and disable smoothing on the internal fill canvas.
* TileSprites that were set to be interactive before they had rendered once wouldn't receive a valid input hit area, causing input to fail. They now define their size immediately, allowing them to be made interactive without having rendered. Fix #4085 (thanks @DotTheGreat)
* The Particle Emitter Manager has been given a NOOP method called `setBlendMode` to stop warnings from being thrown if you added an emitter to a Container in the Canvas renderer. Fix #4083 (thanks @maximtsai)
* The `game.context` property would be incorrectly set to `null` after the WebGLRenderer instance was created (thanks @samme)
* The Touch Manager, Input Manager and Pointer classes all now handle the `touchcancel` event, such as triggered on iOS when activating an out of browser UI gesture, or in Facebook Instant Games when displaying an overlay ad. This should prevent issues with touch input becoming locked on iOS specifically. Fix #3756 (thanks @sftsk @sachinhosmani @kooappsdevs)
