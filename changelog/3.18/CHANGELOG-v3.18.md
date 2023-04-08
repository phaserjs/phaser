# Phaser 3 Change Log

## Version 3.18.0 - Raphtalia - 19th June 2019

### Input System Changes

#### Mouse Wheel Support

3.18 now includes native support for reading mouse wheel events.

* `POINTER_WHEEL` is a new event dispatched by the Input Plugin allowing you to listen for global wheel events.
* `GAMEOBJECT_WHEEL` is a new event dispatched by the Input Plugin allowing you to listen for global wheel events over all interactive Game Objects in a Scene.
* `GAMEOBJECT_POINTER_WHEEL` is a new event dispatched by a Game Object allowing you to listen for wheel events specifically on that Game Object.
* `Pointer.deltaX` is a new property that holds the horizontal scroll amount that occurred due to the user moving a mouse wheel or similar input device.
* `Pointer.deltaY` is a new property that holds the vertical scroll amount that occurred due to the user moving a mouse wheel or similar input device.
* `Pointer.deltaZ` is a new property that holds the z-axis scroll amount that occurred due to the user moving a mouse wheel or similar input device.
* `Pointer.wheel` is a new internal method that handles the wheel event.
* `InputManager.onMouseWheel` is a new internal method that handles processing the wheel event.
* `InputManager.processWheelEvent` is a new internal method that handles processing the wheel event sent by the Input Manager.

#### Button Released Support

* `Pointer.button` is a new property that indicates which button was pressed, or released, on the pointer during the most recent event. It is only set during `up` and `down` events and is always 0 for Touch inputs.
* `Pointer.leftButtonReleased` is a new method that returns `true` if it was the left mouse button that was just released. This can be checked in a `pointerup` event handler to find out which button was released.
* `Pointer.rightButtonReleased` is a new method that returns `true` if it was the right mouse button that was just released. This can be checked in a `pointerup` event handler to find out which button was released (thanks @BobtheUltimateProgrammer)
* `Pointer.middleButtonReleased` is a new method that returns `true` if it was the middle mouse button that was just released. This can be checked in a `pointerup` event handler to find out which button was released.
* `Pointer.backButtonReleased` is a new method that returns `true` if it was the back mouse button that was just released. This can be checked in a `pointerup` event handler to find out which button was released.
* `Pointer.forwardButtonReleased` is a new method that returns `true` if it was the forward mouse button that was just released. This can be checked in a `pointerup` event handler to find out which button was released.

#### Input System Bug Fixes

* Calling `setPollAlways()` would cause the `'pointerdown'` event to fire multiple times. Fix #4541 (thanks @Neyromantik)
* The pointer events were intermittently not registered, causing `pointerup` to often fail. Fix #4538 (thanks @paulsymphony)
* Due to a regression in 3.16 the drag events were not performing as fast as before, causing drags to feel lagged. Fix #4500 (thanks @aliblong)
* The Touch Manager will now listen for Touch Cancel events on the Window object (if `inputWindowEvents` is enabled in the game config, which it is by default). This allows it to prevent touch cancel actions, like opening the dock on iOS, from causing genuinely active pointers to enter an active locked state.
* Over and Out events now work for any number of pointers in multi-touch environments, not just the first touch pointer registered. They also now fire correctly on touch start and touch end / cancel events.
* If you enable a Game Object for drag and place it inside a rotated Container (of any depth), the `dragX` and `dragY` values sent to the `drag` callback didn't factor the rotation in, so you had to do it manually. This is now done automatically, so the values account for parent rotation before being sent to the event handler. Fix #4437 (thanks @aliblong)

#### Input System API Changes

The old 'input queue' legacy system, which was deprecated in 3.16, has been removed entirely in order to tidy-up the API and keep input events consistent. This means the following changes:

* Removed the `inputQueue` Game config property.
* Removed the `useQueue`, `queue` and `_updatedThisFrame` properties from the Input Manager.
* Removed the `legacyUpdate` and `update` methods from the Input Manager.
* Removed the `ignoreEvents` property as this should now be handled on a per-event basis.
* The Input Manager no longer listens for the `GameEvents.POST_STEP` event.
* The following Input Manager methods are no longer required so have been removed: `startPointer`, `updatePointer`, `stopPointer` and `cancelPointer`.

As a result, all of the following Input Manager methods have been renamed:

* `queueTouchStart` is now called `onTouchStart` and invoked by the Touch Manager.
* `queueTouchMove` is now called `onTouchMove` and invoked by the Touch Manager.
* `queueTouchEnd` is now called `onTouchEnd` and invoked by the Touch Manager.
* `queueTouchCancel` is now called `onTouchCancel` and invoked by the Touch Manager.
* `queueMouseDown` is now called `onMouseDown` and invoked by the Mouse Manager.
* `queueMouseMove` is now called `onMouseMove` and invoked by the Mouse Manager.
* `queueMouseUp` is now called `onMouseUp` and invoked by the Mouse Manager.

Each of these handlers used to check the `enabled` state of the Input Manager, but this now handled directly in the Touch and Mouse Managers instead, leading to less branching and cleaner tests. They also all used to run an IIFE that updated motion on the changed pointers array, but this is now handled directly in the event handler, allowing it to be removed from here.

Because the legacy queue mode is gone, there is no longer any need for the DOM Callbacks:

* Removed the `_hasUpCallback`, `_hasDownCallback` and `_hasMoveCallback` properties from the Input Manager
* Removed the `processDomCallbacks`, `addDownCallback`, `addUpCallback`, `addMoveCallback`, `domCallbacks`, `addDownCallback`, `addUpCallback` and `addMoveCallback` methods.

Also, CSS cursors can now be set directly:

* Cursors are now set and reset immediately on the canvas, leading to the removal of `_setCursor` and `_customCursor` properties.

The following changes took place in the Input Plugin class:

* The method `processDragEvents` has been removed as it's now split across smaller, more explicit methods.
* `processDragDownEvent` is a new method that handles a down event for drag enabled Game Objects.
* `processDragMoveEvent` is a new method that handles a move event for drag enabled Game Objects.
* `processDragUpEvent` is a new method that handles an up event for drag enabled Game Objects.
* `processDragStartList` is a new internal method that builds a drag list for a pointer.
* `processDragThresholdEvent` is a new internal method that tests when a pointer with drag thresholds can drag.
* `processOverEvents` is a new internal method that handles when a touch pointer starts and checks for over events.
* `processOutEvents` is a new internal method that handles when a touch pointer stops and checks for out events.

The following changes took place in the Pointer class:

* `Pointer.dirty` has been removed as it's no longer required.
* `Pointer.justDown` has been removed as it's not used internally and makes no sense under the DOM event system.
* `Pointer.justUp` has been removed as it's not used internally and makes no sense under the DOM event system.
* `Pointer.justMoved` has been removed as it's not used internally and makes no sense under the DOM event system.
* The `Pointer.reset` method has been removed as it's no longer required internally.
* `Pointer.touchstart` now has two arguments, the Touch List entry and the Touch Event. The full Touch Event is now stored in `Pointer.event` (instead of the Touch List entry).
* `Pointer.touchmove` now has two arguments, the Touch List entry and the Touch Event. The full Touch Event is now stored in `Pointer.event` (instead of the Touch List entry).
* `Pointer.touchend` now has two arguments, the Touch List entry and the Touch Event. The full Touch Event is now stored in `Pointer.event` (instead of the Touch List entry).
* `Pointer.touchcancel` now has two arguments, the Touch List entry and the Touch Event. The full Touch Event is now stored in `Pointer.event` (instead of the Touch List entry).

### New Features

* `Matter.Factory.velocity` is a new method that allows you to set the velocity on a Matter Body directly.
* `Matter.Factory.angularVelocity` is a new method that allows you to set the angular velocity on a Matter Body directly.
* `Matter.Factory.force` is a new method that allows you to apply a force from a world position on a Matter Body directly.
* `GetBounds.getTopCenter` is a new method that will return the top-center point from the bounds of a Game Object.
* `GetBounds.getBottomCenter` is a new method that will return the bottom-center point from the bounds of a Game Object.
* `GetBounds.getLeftCenter` is a new method that will return the left-center point from the bounds of a Game Object.
* `GetBounds.getRightCenter` is a new method that will return the right-center point from the bounds of a Game Object.
* You can now create a desynchronized 2D or WebGL canvas by setting the Game Config property `desynchronized` to `true` (the default is `false`). For more details about what this means see https://developers.google.com/web/updates/2019/05/desynchronized.
* The CanvasRenderer can now use the `transparent` Game Config property in order to tell the browser an opaque background is in use, leading to faster rendering in a 2D context.
* `GameObject.scale` is a new property, that exists as part of the Transform component, that allows you to set the horizontal and vertical scale of a Game Object via a setter, rather than using the `setScale` method. This is handy for uniformly scaling objects via tweens, for example.
* `Base64ToArrayBuffer` is a new utility function that will convert a base64 string into an ArrayBuffer. It works with plain base64 strings, or those with data uri headers attached to them. The resulting ArrayBuffer can be fed to any suitable function that may need it, such as audio decoding.
* `ArrayBufferToBase64` is a new utility function that converts an ArrayBuffer into a base64 string. You can also optionally included a media type, such as `image/jpeg` which will result in a data uri being returned instead of a plain base64 string.
*`WebAudioSoundManager.decodeAudio` is a new method that allows you to decode audio data into a format ready for playback and stored in the audio cache. The audio data can be provided as an ArrayBuffer, a base64 string or a data uri. Listen for the events to know when the data is ready for use.
* `Phaser.Sound.Events#DECODED` is a new event emitted by the Web Audio Sound Manager when it has finished decoding audio data.
* `Phaser.Sound.Events#DECODED_ALL` is a new event emitted by the Web Audio Sound Manager when it has finished decoding all of the audio data files passed to the `decodeAudio` method.
* `Phaser.Utils.Objects.Pick` is a new function that will take an object and an array of keys and return a new object containing just the keys provided in the array.
* `Text.align` and `Text.setAlign` can now accept `justify` as a type. It will apply basic justification to multi-line text, adding in extra spaces in order to justify the content. Fix #4291 (thanks @andrewbaranov @Donerkebap13 @dude78GH)
* `Arcade.Events.WORLD_STEP` is a new event you can listen to. It is emitted by the Arcade Physics World every time the world steps once. It is emitted _after_ the bodies and colliders have been updated. Fix #4289 (thanks @fant0m)

### Updates

* `Zones` will now use the new `customHitArea` property introduced in 3.17 to avoid their hit areas from being resized if you specified your own custom hit area (thanks @rexrainbow)
* The default `BaseShader` vertex shader has a new uniform `uResolution` which is set during the Shader init and load to be the size of the Game Object to which the shader is bound.
* The default `BaseShader` vertex shader will now set the `fragCoord` varying to be the Game Object height minus the y inPosition. This will give the correct y axis in the fragment shader, causing 'inverted' shaders to display normally when using the default vertex code.
* There was some test code left in the `DOMElementCSSRenderer` file that caused `getBoundingClientRect` to be called every render. This has been removed, which increases performance significantly for DOM heavy games.
* The `TimeStep` will no longer set its `frame` property to zero in the `resetDelta` method. Instead, this property is incremented every step, no matter what, giving an accurate indication of exactly which frame something happened on internally.
* The `TimeStep.step` method no longer uses the time value passed to the raf callback, as it's not actually the current point in time, but rather the time that the main thread began at. Which doesn't help if we're comparing it to event timestamps.
* `TimeStep.now` is a new property that holds the exact `performance.now` value, as set at the start of the current game step.
* `Matter.Factory.fromVertices` can now take a vertices path string as its `vertexSets` argument, as well as an array of vertices.
* `GetBounds.prepareBoundsOutput` is a new private method that handles processing the output point. All of the bounds methods now use this, allowing us to remove a lot of duplicated code.
* The PluginManager will now display a console warning if it skips installing a plugin (during boot) because the plugin value is missing or empty (thanks @samme)
* When creating a Matter Constraint via the Factory you can now optionally provide a `length`. If not given, it will determine the length automatically from the position of the two bodies.
* When creating a Matter Game Object you can now pass in a pre-created Matter body instead of a config object.
* When Debug Draw is enabled for Arcade Physics it will now use `Graphics.defaultStrokeWidth` to drawn the body with, this makes static bodies consistent with dynamic ones (thanks @samme)
* `Group.name` is a new property that allows you to set a name for a Group, just like you can with all other Game Objects. Phaser itself doesn't use this, it's there for you to take advantage of (thanks @samme)
* Calling `ScaleManager.setGameSize` will now adjust the size of the canvas element as well. Fix #4482 (thanks @sudhirquestai)
* `Scale.Events.RESIZE` now sends two new arguments to the handler: `previousWidth` and `previousHeight`. If, and only if, the Game Size has changed, these arguments contain the previous size, before the change took place.
* The Camera Manager has a new method `onSize` which is invoked by handling the Scale Manager `RESIZE` event. When it receives it, it will iterate the cameras it manages. If the camera _doesn't_ have a custom offset and _is_ the size of the game, then it will be automatically resized for you. This means you no longer need to call `this.cameras.resize(width, height)` from within your own resize handler, although you can still do so if you wish, as that will resize _every_ Camera being managed to the new size, instead of just 'full size' cameras.
* `Graphics.translate` has been renamed to `Graphics.translateCanvas` to make it clearer what it's actually translating (i.e. the drawing buffer, not the Graphics object itself)
* `Graphics.scale` has been renamed to `Graphics.scaleCanvas` to make it clearer what it's actually scaling (i.e. the drawing buffer, not the Graphics object itself)
* `Graphics.rotate` has been renamed to `Graphics.rotateCanvas` to make it clearer what it's actually rotating (i.e. the drawing buffer, not the Graphics object itself)
* The `width` and `height` of an Arc / Circle Shape Game Object is now set to be the diameter of the arc, not the radius (thanks @rexrainbow)
* `LineStyleCanvas` now takes an `altColor` argument which is used to override the context color.
* `LineStyleCanvas` now takes an `altAlpha` argument which is used to override the context alpha.
* `FillStyleCanvas` now takes an `altAlpha` argument which is used to override the context alpha.
* `StaticPhysicsGroup` can now take a `classType` property in its Group Config and will use the value of it, rather than override it. If none is provided it'll default to `ArcadeSprite`. Fix #4401 (thanks @Legomite)
* `Phaser.Tilemaps.Parsers.Tiled` used to run the static function `ParseJSONTiled`. `Parsers.Tiled` is now just a namespace, so access the function within it: `Phaser.Tilemaps.Parsers.Tiled.ParseJSONTiled`.
* `Phaser.Tilemaps.Parsers.Impact` used to run the static function `ParseWeltmeister`. `Parsers.Impact` is now just a namespace, so access the function within it: `Phaser.Tilemaps.Parsers.Impact.ParseWeltmeister`.
* `Phaser.Tilemaps.Parsers.Tiled.AssignTileProperties` is now a public static function, available to be called directly.
* `Phaser.Tilemaps.Parsers.Tiled.Base64Decode` is now a public static function, available to be called directly.
* `Phaser.Tilemaps.Parsers.Tiled.BuildTilesetIndex` is now a public static function, available to be called directly.
* `Phaser.Tilemaps.Parsers.Tiled.ParseGID` is now a public static function, available to be called directly.
* `Phaser.Tilemaps.Parsers.Tiled.ParseImageLayers` is now a public static function, available to be called directly.
* `Phaser.Tilemaps.Parsers.Tiled.ParseJSONTiled` is now a public static function, available to be called directly.
* `Phaser.Tilemaps.Parsers.Tiled.ParseObject` is now a public static function, available to be called directly.
* `Phaser.Tilemaps.Parsers.Tiled.ParseObjectLayers` is now a public static function, available to be called directly.
* `Phaser.Tilemaps.Parsers.Tiled.ParseTileLayers` is now a public static function, available to be called directly.
* `Phaser.Tilemaps.Parsers.Tiled.ParseTilesets` is now a public static function, available to be called directly.
* `Phaser.Tilemaps.Parsers.Tiled.ParseTilesets` is now a public static function, available to be called directly.
* `Phaser.Tilemaps.Parsers.Impact.ParseTileLayers` is now a public static function, available to be called directly.
* `Phaser.Tilemaps.Parsers.Impact.ParseTilesets` is now a public static function, available to be called directly.
* `Phaser.Tilemaps.Parsers.Impact.ParseWeltmeister` is now a public static function, available to be called directly.
* `Phaser.Tilemaps.Parsers.Tiled.Pick` has been removed. It is now available under `Phaser.Utils.Objects.Pick`, which is a more logical place for it.
* You can now call `this.scene.remove` at the end of a Scene's `create` method without it throwing an error. Why you'd ever want to do this is beyond me, but you now can (thanks @samme)
* The `Arcade.StaticBody.setSize` arguments have changed from `(width, height, offsetX, offsetY)` to `(width, height, center)`. They now match Dynamic Body setSize and the Size Component method (thanks @samme)
* When enabling Arcade Physics Body debug it will now draw only the faces marked for collision, allowing you to easily see if a face is disabled or not (thanks @BdR76)
* `Transform.getParentRotation` is a new method available to all GameObjects that will return the sum total rotation of all of the Game Objects parent Containers, if it has any.
* `Tween.restart` now sets the Tween properties `elapsed`, `progress`, `totalElapsed` and `totalProgress` to zero when called, rather than adding to existing values should the tween already be running.
* `ArcadePhysics.Body.resetFlags` is a new method that prepares the Body for a physics step by resetting the `wasTouching`, `touching` and `blocked` states.
* `ArcadePhysics.Body.preUpdate` has two new arguments `willStep` and `delta`. If `willStep` is true then the body will call resetFlags, sync with the parent Game Object and then run one iteration of `Body.update`, using the provided delta. If false, only the Game Object sync takes place.
* `ArcadePhysics.World.update` will now determine if a physics step is going to happen this frame or not. If not, it no longer calls `World.step` (fix #4529, thanks @ampled). If a step _is_ going to happen, then it now handles this with one iteration of the bodies array, instead of two. It has also inlined a single world step, avoiding branching out. If extra world steps are required this frame (such as in high Hz environments) then `World.step` is called accordingly.
* `ArcadePhysics.World.postUpdate` will no longer call `Body.postUpdate` on all of the bodies if no World step has taken place this frame.
* `ArcadePhysics.World.step` will now increment the `stepsLastFrame` counter, allowing `postUpdate` to determine if bodies should be processed should World.step have been invoked manually.

### Bug Fixes

* Tweens created in a paused state couldn't be started by a call to `play`. Fix #4525 (thanks @TonioParis)
* If both Arcade Physics circle body positions and the delta equaled zero, the `separateCircle` function would cause the position to be set `NaN` (thanks @hizzd)
* The `CameraManager` would incorrectly destroy the `default` Camera in its shutdown method, meaning that if you used a fixed mask camera and stopped then resumed a Scene, the masks would stop working. The default camera is now destroyed only in the `destroy` method. Fix #4520 (thanks @telinc1)
* Passing a Frame object to `Bob.setFrame` would fail, as it expected a string or integer. It now checks the type of object, and if a Frame it checks to make sure it's a Frame belonging to the parent Blitter's texture, and if so sets it. Fix #4516 (thanks @NokFrt)
* The ScaleManager full screen call had an arrow function in it. Despite being within a conditional block of code it still broke really old browsers like IE11, so has been removed. Fix #4530 (thanks @jorbascrumps @CNDW)
* `Game.getTime` would return `NaN` because it incorrectly accessed the time value from the TimeStep.
* Text with a `fixedWidth` or `fixedHeight` could cause the canvas to be cropped if less than the size of the Text itself (thanks @rexrainbow)
* Changing the `radius` of an Arc Game Object wouldn't update the size, causing origin issues. It now updates the size and origin correctly in WebGL. Fix #4542 (thanks @@PhaserEditor2D)
* Setting `padding` in a Text style configuration object would cause an error about calling split on undefined. Padding can now be applied both in the config and via `setPadding`.
* `Tilemap.createBlankDynamicLayer` would fail if you provided a string for the tileset as the base tile width and height were incorrectly read from the tileset argument. Fix #4495 (thanks @jppresents)
* `Tilemap.createDynamicLayer` would fail if you called it without setting the `x` and `y` arguments, even though they were flagged as being optional. Fix #4508 (thanks @jackfreak)
* `RenderTexture.draw` didn't work if no `x` and `y` arguments were provided, even though they are optional, due to a problem with the way the frame cut values were added. The class has been refactored to prevent this, fixing issues like `RenderTexture.erase` not working with Groups. Fix #4528 (thanks @jbgomez21 @telinc1)
* The `Grid` Game Object wouldn't render in Canvas mode at all. Fix #4585 (thanks @fyyyyy)
* If you had a `Graphics` object in the display list immediately after an object with a Bitmap Mask it would throw an error `Uncaught TypeError: Cannot set property 'TL' of undefined`. Fix #4581 (thanks @Petah @Loonride)
* Calling Arcade Physics `Body.reset` on a Game Object that doesn't have any bounds, like a Container, would throw an error about being unable to access `getTopLeft`. If this is the case, it will now set the position to the given x/y values (thanks Jazz)
* All of the `Tilemaps.Parsers.Tiled` static functions are now available to be called directly. Fix #4318 (thanks @jestarray)
* `Arcade.StaticBody.setSize` now centers the body correctly, as with the other similar methods. Fix #4213 (thanks @samme)
* Setting `random: false` in a Particle Emitter config option no longer causes it to think random is true (thanks @samme)
* `Zone.setSize` didn't update the displayOrigin, causing touch events to be inaccurate as the origin was out. Fix #4131 (thanks @rexrainbow)
* `Tween.restart` wouldn't restart the tween properly. Fix #4594 (thanks @NokFrt)
* Looped Tween Timelines would mess-up the tween values on every loop repeat, causing the loop to fail. They now loop correctly due to a fix in the Tween.play method. Fix #4558 (thanks @peteroravec)
* `Timeline.setTimeScale` would only impact the Timeline loop and completion delays, not the actively running Tweens. It now scales the time for all child tweens as well. Fix #4164 (thanks @garethwhittaker)

### Examples, Documentation and TypeScript

My thanks to the following for helping with the Phaser 3 Examples, Docs and TypeScript definitions, either by reporting errors, fixing them or helping author the docs:

@PhaserEditor2D @samme @Nallebeorn @Punkiebe @rootasjey @Sun0fABeach
