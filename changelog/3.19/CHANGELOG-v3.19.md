# Phaser 3 Change Log

## Version 3.19.0 - Naofumi - 8th August 2019

### Tween Updates

* All Tween classes and functions have 100% complete JSDocs :)
* `StaggerBuilder` is a new function that allows you to define a staggered tween property. For example, as part of a tween config: `delay: this.tweens.stagger(500)` would stagger the delay by 500ms for every target of the tween. You can also provide a range: `delay: this.tweens.stagger([ 500, 1000 ])` which is spread across all targets. Finally, you can provide a Stagger Config object as the second argument. This allows you to define a stagger grid, direction, starting value and more. Please see the API Docs and new Examples for further details.
* `Tween` now extends the Event Emitter class, allowing it to emit its own events and be listened to.
* `Tween.ACTIVE_EVENT` is a new event that is dispatched when a tween becomes active. Listen to it with `tween.on('active')`.
* `Tween.COMPLETE_EVENT` is a new event that is dispatched when a tween completes or is stopped. Listen to it with `tween.on('complete')`.
* `Tween.LOOP_EVENT` is a new event that is dispatched when a tween loops, after any loop delay expires. Listen to it with `tween.on('loop')`.
* `Tween.REPEAT_EVENT` is a new event that is dispatched when a tween property repeats, after any repeat delay expires. Listen to it with `tween.on('repeat')`.
* `Tween.START_EVENT` is a new event that is dispatched when a tween starts. Listen to it with `tween.on('start')`.
* `Tween.UPDATE_EVENT` is a new event that is dispatched when a tween property updates. Listen to it with `tween.on('update')`.
* `Tween.YOYO_EVENT` is a new event that is dispatched when a tween property yoyos, after any hold delay expires. Listen to it with `tween.on('yoyo')`.
* `Tween.onActive` is a new callback that is invoked the moment the Tween Manager brings the tween to life, even though it may not have yet started actively tweening anything due to delay settings.
* `Tween.onStart` is now only invoked when the Tween actually starts tweening a value. Previously, it was invoked as soon as the Tween Manager activated the Tween. This has been recoded and this action is now handled by the `onActive` callback. Fix #3330 (thanks @wtravO)
* `Tween.seek` has been rewritten so you can now seek to any point in the Tween, regardless of repeats, loops, delays and hold settings. Seeking will not invoke any callbacks or events during the seek. Fix #4409 (thanks @cristib84)
* You can now set `from` and `to` values for a property, i.e. `alpha: { from: 0, to: 1 }` which would set the alpha of the target to 0 and then tween it to 1 _after_ any delays have expired. Fix #4493 (thanks @BigZaphod)
* You can now set `start` and `to` values for a property, i.e. `alpha: { start: 0, to: 1 }` which would set the alpha of the target to 0 immediately, as soon as the Tween becomes active, and then tween it to 1 over the duration of the tween.
* You can now set `start`, `from` and `to` values for a property, i.e. `alpha: { start: 0, from: 0.5, to: 1 }` which would set the alpha of the target to 0 immediately, as soon as the Tween becomes active, then after any delays it would set the alpha to 0.5 and then tween it to 1 over the duration of the Tween.
* `Tween.hasStarted` is a new property that holds a flag signifying if the Tween has started or not. A Tween that has started is one that is actively tweening a property and not just in a delayed state.
* `Tween.startDelay` is a new property that is set during the Tween init to hold the shortest possible time before the Tween will start tweening a value. It is decreased each update until it hits zero, after which the `onStart` callback is invoked.
* `Tween.init` and `Tween.play` have been rewritten so they are not run multiple times when a Tween is paused before playback, or is part of a Timeline. This didn't cause any problems previously, but it was a redundant duplication of calls.
* `Tween.onLoop` will now be invoked _after_ the `loopDelay` has expired, if any was set.
* `Tween.onRepeat` will now be invoked _after_ the `repeatDelay` has expired, if any was set.
* `easeParams` would be ignored for tweens that _didn't_ use a string for the ease function name. Fix #3826 (thanks @SBCGames)
* You can now specify `easeParams` for any custom easing function you wish to use. Fix #3826 (thanks @SBCGames)
* All changes to `Tween.state` are now set _before_ any events or callbacks, allowing you to modify the state of the Tween in those handlers (thanks @Cudabear)
* `Tween.dispatchTweenEvent` is a new internal method that handles dispatching the new Tween Events and callbacks. This consolidates a lot of duplicate code into a single method.
* `Tween.dispatchTweenDataEvent` is a new internal method that handles dispatching the new TweenData Events and callbacks. This consolidates a lot of duplicate code into a single method.
* `Tween.isSeeking` is a new internal boolean flag that is used to keep track of the seek progress of a Tween.
* `Timeline.onLoop` will now be invoked _after_ the `loopDelay` has expired, if any was set.
* `Timeline.onComplete` will now be invoked _after_ the `completeDelay` has expired, if any was set.
* All changes to `Timeline.state` are now set _before_ any events or callbacks, allowing you to modify the state of the Timeline in those handlers.
* The `TIMELINE_LOOP_EVENT` has had the `loopCounter` argument removed from it. It didn't actually send the number of times the Timeline had looped (it actually sent the total remaining).
* When a TweenData completes it will now set the `current` property to be exactly either `start` or `end` depending on playback direction.
* When a TweenData completes it will set the exact `start` or `end` value into the target property.
* `TweenData` has a new function signature, with the new `index` and `getActive`arguments added to it. `TweenBuilder` has been updated to set these, but if you create any TweenData objects directly, use the new signature.
* `TweenData.getActiveValue` is a new property that, if not null, returns a value to immediately sets the property value to on activation.
* `GetEaseFunction`, and by extension anything that uses it, such as setting the ease for a Tween, will now accept a variety of input strings as valid. You can now use lower-case, such as `back`, and omit the 'ease' part of the direction, such as `back.in` or `back.inout`.
* The signature of `getStart` and `getEnd` custom property functions has changed to `(target, key, value, targetIndex, totalTargets, tween)`, previously it was just `(target, key, value)`. Custom functions don't need to change as the new arguments are in addition to those sent previously.
* The signature of the LoadValue generator functions (such as `delay` and `repeat`) has changed to `(target, key, value, targetIndex, totalTargets, tween)` to match those of the custom property functions. If you used a custom generator function for your Tween configs you'll need to modify the signature to the new one.
* Tweens created via `TweenManager.create` wouldn't start when `Tween.play` was called without first making them active manually. They now start automatically. Fix #4632 (thanks @mikewesthad)

### Spine Updates

The Spine Plugin is now 100% complete. It has been updated to use the Spine 3.7 Runtimes. Improvements have been made across the entire plugin, including proper batched rendering support in WebGL, cleaner skin and slot functions and lots and lots of updates. It's fully documented and there are lots of examples to be found. The following legacy bugs have also been fixed:

* Adding Spine to physics causes position to become NaN. Fix #4501 (thanks @hizzd)
* Destroying a Phaser Game instance and then re-creating it would cause an error trying to re-create Spine Game Objects ("Cannot read property get of null"). Fix #4532 (thanks @Alex-Badea)
* Rendering a Spine object when a Camera has `renderToTexture` enabled on it would cause the object to be vertically flipped. It now renders correctly in both cases. Fix #4647 (thanks @probt)

### New Features

* `Shader.setRenderToTexture` is a new method that will redirect the Shader to render to its own framebuffer / WebGLTexture instead of to the display list. This allows you to use the output of the shader as an input for another shader, by mapping a sampler2D uniform to it. It also allows you to save the Shader to the Texture Manager, allowing you to use it as a texture for any other texture based Game Object such as a Sprite.
* `Shader.setSampler2DBuffer` is a new method that allows you to pass a WebGLTexture directly into a Shader as a sampler2D uniform, such as when linking shaders together as buffers for each other.
* `Shader.renderToTexture` is a new property flag that is set if you set the Shader to render to a texture.
* `Shader.framebuffer` is a new property that contains a WebGLFramebuffer reference which is set if you set the Shader to render to a texture.
* `Shader.glTexture` is a new property that contains a WebGLTexture reference which is set if you set the Shader to render to a texture.
* `Shader.texture` is a new property that contains a Phaser Texture reference which is set if you set the Shader to save to the Texture Manager.
* `TextureManager.addGLTexture` is a new method that allows you to add a WebGLTexture directly into the Texture Manager, saved under the given key.
* `TextureSource.isGLTexture` is a new boolean property that reflects if the data backing the underlying Texture Source is a WebGLTexture or not.
* `TextureTintPipeline.batchSprite` will now flip the UV if the TextureSource comes from a GLTexture.
* `Math.ToXY` is a new mini function that will take a given index and return a Vector2 containing the x and y coordinates of that index within a grid.
* `RenderTexture.glTexture` is a new property that holds a reference to the WebGL Texture being used by the Render Texture. Useful for passing to a shader as a sampler2D.
* `GroupCreateConfig.quantity` - when creating a Group using a config object you can now use the optional property `quantity` to set the number of objects to be created. Use this for quickly creating groups of single frame objects that don't need the advanced capabilities of `frameQuantity` and `repeat`.
* `Pointer.locked` is a new read-only property that indicates if the pointer has been Pointer Locked, or not, via the Pointer Lock API.
* `WebGLRenderer.snapshotFramebuffer`, and the corresponding utility function `WebGLSnapshot`, allows you to take a snapshot of a given WebGL framebuffer, such as the one used by a Render Texture or Shader, and either get a single pixel from it as a Color value, or get an area of it as an Image object, which can then optionally be saved to the Texture Manager for use by Game Object textures.
* `CanvasRenderer.snapshotCanvas` allows you to take a snapshot of a given Canvas object, such as the one used by a Render Texture, and either get a single pixel from it as a Color value, or get an area of it as an Image object, which can then optionally be saved to the Texture Manager for use by Game Object textures.
* `RenderTexture.snapshot` is a new method that will take a snapshot of the whole current state of the Render Texture and return it as an Image object, which could then be saved to the Texture Manager if needed.
* `RenderTexture.snapshotArea` is a new method that will take a snapshot of an area of a Render Texture and return it as an Image object, which could then be saved to the Texture Manager if needed.
* `RenderTexture.snapshotPixel` is a new method that will take extract a single pixel color value from a Render Texture and return it as a Color object.
* The `SnapshotState` object has three new properties: `isFramebuffer` boolean and `bufferWidth` and `bufferHeight` integers.
* `Game.CONTEXT_LOST_EVENT` is a new event that is dispatched by the Game instance when the WebGL Renderer webgl context is lost. Use this instead of the old 'lostContextCallbacks' for cleaner context handling.
* `Game.CONTEXT_RESTORED_EVENT` is a new event that is dispatched by the Game instance when the WebGL Renderer webgl context is restored. Use this instead of the old 'restoredContextCallbacks' for cleaner context handling.
* `WebGLRenderer.currentType` contains the type of the Game Object currently being rendered.
* `WebGLRenderer.newType` is a boolean that indicates if the current Game Object has a new type, i.e. different to the previous one in the display list.
* `WebGLRenderer.nextTypeMatch` is a boolean that indicates if the _next_ Game Object in the display list has the same type as the one being currently rendered. This allows you to build batching into separated Game Objects.
* `PluginManager.removeGameObject` is a new method that allows you to de-register custom Game Object types from the global Game Object Factory and/or Creator. Useful for when custom plugins are destroyed and need to clean-up after themselves.
* `GEOM_CONST` is a new constants object that contains the different types of Geometry Objects, such as `RECTANGLE` and `CIRCLE`.
* `Circle.type` is a new property containing the shapes geometry type, which can be used for quick type comparisons.
* `Ellipse.type` is a new property containing the shapes geometry type, which can be used for quick type comparisons.
* `Line.type` is a new property containing the shapes geometry type, which can be used for quick type comparisons.
* `Point.type` is a new property containing the shapes geometry type, which can be used for quick type comparisons.
* `Polygon.type` is a new property containing the shapes geometry type, which can be used for quick type comparisons.
* `Rectangle.type` is a new property containing the shapes geometry type, which can be used for quick type comparisons.
* `Triangle.type` is a new property containing the shapes geometry type, which can be used for quick type comparisons.
* `InputPlugin.enableDebug` is a new method that will create a debug shape for the given Game Objects hit area. This allows you to quickly check the size and placement of an input hit area. You can customzie the shape outline color. The debug shape will automatically track the Game Object to which it is bound.
* `InputPlugion.removeDebug` will remove a Debug Input Shape from the given Game Object and destroy it.
* `Pointer.updateWorldPoint` is a new method that takes a Camera and then updates the Pointers `worldX` and `worldY` values based on the cameras transform (thanks @Nick-lab)
* `ScaleManager._resetZoom` is a new internal flag that is set when the game zoom factor changes.
* `Texture.remove` is a new method that allows you to remove a Frame from a Texture based on its name. Fix #4460 (thanks @BigZaphod)

### Updates

* When calling `setHitArea` and not providing a shape (i.e. a texture based hit area), it will now set `customHitArea` to `false` by default (thanks @rexrainbow)
* The Shader will no longer set uniforms if the values are `null`, saving on GL ops.
* The Animation Manager will now emit a console warning if you try and play an animation on a Sprite that doesn't exist.
* The Animation component will no longer start an animation on a Sprite if the animation doesn't exist. Previously it would throw an error saying "Unable to read the property getFirstTick of null".
* `InputManager.onPointerLockChange` is a new method that handles pointer lock change events and dispatches the lock event.
* `CanvasTexture` has been added to the `Textures` namespace so it can be created without needing to import it. The correct way to create a `CanvasTexture` is via the Texture Manager, but you can now do it directly if required. Fix #4651 (thanks @Jugacu)
* The `SmoothedKeyControl` minimum zoom a Camera can go to is now 0.001. Previously it was 0.1. This is to make it match the minimum zoom a Base Camera can go to. Fix #4649 (thanks @giviz)
* `WebGLRenderer.lostContextCallbacks` and the `onContextLost` method have been removed. Please use the new `CONTEXT_LOST` event instead.
* `WebGLRenderer.restoredContextCallbacks` and the `onContextRestored` method have been removed. Please use the new `CONTEXT_RESTORED` event instead.
* `TextureManager.getBase64` will now emit a console warning if you try to get a base64 from a non-image based texture, such as a WebGL Texture.
* The `WebAudioSoundManager` will now remove the document touch handlers even if the Promise fails, preventing it from throwing a rejection handler error.
* `GameObjectFactory.remove` is a new static function that will remove a custom Game Object factory type.
* `GameObjectCreator.remove` is a new static function that will remove a custom Game Object creator type.
* `CanvasTexture.getPixels` now defaults to 0x0 by width x height as the default area, allowing you to call the method with no arguments to get all the pixels for the canvas.
* `CreateDOMContainer` will now use `div.style.cssText` to set the inline styles of the container, so it now works on IE11. Fix #4674 (thanks @DanLiamco)
* `TransformMatrix.rotation` now returns the properly normalized rotation value.
* `PhysicsEditorParser` has now been exposed under the `Phaser.Physics.Matter` namespace, so you can call methods on it directly.
* Calling `CanvasTexture.update` will now automatically call `refresh` if running under WebGL. This happens for both `draw` and `drawFrame`, meaning you no longer need to remember to call `refresh` after drawing to a Canvas Texture in WebGL, keeping it consistent with the Canvas renderer.
* `Frame.destroy` will now null the Frames reference to its parent texture, glTexture and clear the data and customData objects.
* The Container renderer functions will now read the childs `alpha` property, instead of `_alpha`, allowing it to work with more variety of custom children.

### Bug Fixes

* The Scale Manager would throw the error 'TypeError: this.removeFullscreenTarget is not a function' when entering full-screen mode. It would still enter fullscreen, but the error would appear in the console. Fix #4605 (thanks @darklightcode)
* `Tilemap.renderDebug` was calling out-dated Graphics API methods, which would cause the debug to fail (thanks @Fabadiculous)
* The `Matter.Factory.constraint`, `joint` and `worldConstraint` methods wouldn't allow a zero length constraint to be created due to a falsey check of the length argument. You can now set length to be any value, including zero, or leave it undefined to have it automatically calculated (thanks @olilanz)
* `Pointer.getDuration` would return a negative / static value on desktop, or NaN on mobile, because the base time wasn't being pulled in from the Input Manager properly. Fix #4612 (thanks @BobtheUltimateProgrammer)
* `Pointer.downTime`, `Pointer.upTime` and `Pointer.moveTime` would be set to NaN on mobile browsers where Touch.timeStamp didn't exist. Fix #4612 (thanks @BobtheUltimateProgrammer)
* `WebGLRenderer.setScissor` will default the `drawingBufferHeight` if no argument is provided, stopping NaN scissor heights.
* If you called `Scene.destroy` within a Game Object `pointerdown` or `pointerup` handler, it would cause the error "Cannot read property 'game' of null" if the event wasn't cancelled in your handler. It now checks if the manager is still there before accessing its property. Fix #4436 (thanks @jcyuan)
* The `Arc / Circle` Game Object wasn't rendering centered correctly in WebGL due to an issue in a previous size related commit, it would be half a radius off. Fix #4620 (thanks @CipSoft-Components @rexrainbow)
* Destroying a Scene in HEADLESS mode would throw an error as it tried to access the gl renderer in the Camera class. Fix #4467 (thanks @AndreaBoeAbrahamsen @samme)
* `Tilemap.createFromObjects` would ignore the `scene` argument passed in to the method. It's now used (thanks @samme)
* Fixed a bug in the WebGL and Canvas Renderers where a Sprite with a `flipX` or `flipY` value set would render the offset frames slightly out of place, causing the animation to appear jittery. Also, the sprite would be out of place by its origin. Fix #4636 #3813  (thanks @jronn @B3L7)
* Animations with custom pivots, like those created in Texture Packer with the pivot option enabled, would be mis-aligned if flipped. They now render in the correct position, regardless of scale or flip on either axis. Fix #4155 (thanks @Zax37)
* Removing a frame from a 2 frame animation would cause an error when a Sprite using that animation next tried to render. Fix #4621 (thanks @orlicgms)
* Calling `Animation.setRepeat()` wouldn't reset the `repeatCounter` properly, causing Sprite bound animation instances to fail to change their repeat rate. Fix #4553 (thanks @SavedByZero)
* The `UpdateList.remove` method wouldn't flag the Game Object for removal properly if it was active. It now checks that the Game Object is in the current update list and hasn't already been inserted into the 'pending removal' list before flagging it. Fix #4544 (thanks @jcyuan)
* `DynamicTilemapLayer.destroy` will now no longer run its destroy sequence again if it has already been run once. Fix #4634 (thanks @CipSoft-Components)
* `StaticTilemapLayer.destroy` will now no longer run its destroy sequence again if it has already been run once.
* `Shader.uniforms` now uses Extend instead of Clone to perform a deep object copy, instead of a shallow one, avoiding multiple instances of the same shader sharing uniforms. Fix #4641 (thanks @davidmball)
* Calling `input.mouse.requestPointerLock()` will no longer throw an error about being unable to push to the Input Manager events queue.
* The `POINTERLOCK_CHANGE` event is now dispatched by the Input Manager again.
* The `Pointer.movementX` and `Pointer.movementY` properties are now taken directly from the DOM pointer event values, if the pointer is locked, and no longer incremental. Fix #4611 (thanks @davidmball)
* The `Pointer.velocity` and `Pointer.midPoint` values are now updated every frame. Based on the `motionFactor` setting they are smoothed towards zero, for velocity, and the pointer position for the mid point. This now happens regardless if the Pointer moves or not, which is how it was originally intended to behave.
* The `DESTROY` event hook wasn't removed from Group children when destroying the Group and `destroyChildren` was set to false. Now, the hook is removed regardless (thanks @rexrainbow)
* The WebGL Lost and Restored Context callbacks were never removed, which could cause them to hold onto stale references. Fix #3610 (thanks @Twilrom)
* `Origin.updateDisplayOrigin` no longer applies a Math.floor to the display origins, allowing you to have a 0.x origin for a Game Object that only has a width or height of 1. This fixes issues with things like 1x1 rectangles displaying incorrectly during rendering. Fix #4126 (thanks @rexrainbow)
* `InputManager.resetCursor` will now check if the canvas element still exists before resetting the cursor on it. Fix #4662 (thanks @fromnowhereuser)
* It was not possible to set the zoom value of the Scale Manager back to 1 again, having changed it to a different value. Fix #4633 (thanks @lgibson02 @BinaryMoon)

### Examples, Documentation and TypeScript

My thanks to the following for helping with the Phaser 3 Examples, Docs and TypeScript definitions, either by reporting errors, fixing them or helping author the docs:

@vacarsu @KennethGomez @samme @ldd @Jazcash @jcyuan @LearningCode2023 @PhaserEditor2D
