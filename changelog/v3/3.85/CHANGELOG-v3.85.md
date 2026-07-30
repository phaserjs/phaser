# Version 3.85.0 - Itsuki - 5th September 2024

# MatterJS

* MatterJS has been updated to version 0.20.0 - [Here are all the details about this update](MatterJS.md).
* A new `wrap` method has been natively integrated into the `Body` class to replace the existing `MatterWrap` plugin. [Here's how it works](MatterWrapBounds.md).
* The Matter `attractors` plugin has been natively integrated into the `Body` class and Matter engine. [More details here](MatterAttractor.md).
* Integrated `MatterCollisionEvents` plugin functionality directly into the `Matter.World` class to handle collisions more effectively. [More details here](MatterCollisionEvents.md).
* Updated `Matter.World` to improve the performance, accuracy, and reliability of the `update` method in handling physics simulations or animations. [More details here](MatterWorldUpdate.md).
* Fixed `Matter.World` bug where `group.length` returns `undefined`. Changed to `group.getLength()` to correctly return number of children in a group.
* Calling `Matter.World.pause` would stop the world updating, but the Runner `timeLastTick` wasn't reset when `resume` was called, causing all the bodies to advance. The time is now reset correctly. Fix #6892 (thanks @philipgriffin)

# Round Pixels

Includes a **Potentially Breaking Change**

The way `roundPixels` has been handled in this release has been changed significantly. In previous versions we passed a uniform to the shaders and handled the pixel rounding on the GPU. However, this caused issues with our batching flow - for example, a Sprite would need to be rounded, but a Text or Shape object would not. This lead to complications in some parts of the render code.

In this release we have removed the shader uniform and branching and also made `roundPixels` default to `false` in the Game Config. Previously, it was `true`, so you may need to switch this flag if you were relying on it. Here are the results of this change:

* The Game Config `roundPixels` property now defaults to `false`.
* The `uRoundPixels` uniform has been removed from the Single, Multi and Mobile vertex shaders.
* Setting the `uRoundPixels` uniform has been removed from the Single, Rope, PreFX, PostFX, Multi and Mobile WebGL Pipelines.
* The Multi Pipeline and Blitter WebGL Renderer will now pass the `camera.roundPixels` value to the Transform Matrix `setQuad` method.
* The Multi Pipeline `batchSprite` and `batchTexture` methods will now apply `Math.floor` to the sprite matrix calculations if camera round pixels is enabled.
* `BaseCamera.preRender` has been removed. This method was completely overridden by `Camera.preRender` which is the method that contained the correct rendering logic. As the Base Camera variant was not used internally outside of Dynamic Textures, we have removed it to save space.
* `Camera.preRender` has been updated to use both zoomX and zoomY for the matrix transform.
* `Camera.preRender` has been updated to apply Math.floor to the scroll factor when rounding is enabled on the Camera. This fixes an issue where following sprites with Camera lerp, or heavy zoom factors, would cause 'stuttering' at sub-pixel values.

# New Features - Loader

The Loader now has a new feature called `maxRetries`. This specifies the number of times a single File will retry loading itself should it error for whatever reason, such as poor network connectivity. The default value is 2. You can change this in the Game Config, on the LoaderPlugin instance, on the FileConfig or on the File level itself. Thanks to @pavle-goloskokovic for the suggestion.

* `loader.maxRetries` is a new Game Config option to set the number of retries a file will attempt to load. The default is 2.
* `LoaderPlugin.maxRetries` is a new property that holds the number of times to retry loading a single file before it fails. This property is set via the Game Config, but can also be adjusted manually. Changing it doesn't not impact files already in the load queue, only those added later.
* `FileConfig.maxRetries` is a new File Config option to set the number of retries a file will attempt to load. If not specified in the config, the value is read from the `LoaderPlugin.maxRetries` property.
* `Loader.File.retryAttempts` is the internal property holding the counter for the number of times to retry loading this file before it fails. This value is decreased after each attempt. When it reaches zero, the file is considered as failed.

# New Features

* `BaseSoundManager.isPlaying` is a new method that will return a boolean if the given sound key is playing. If you don't provide a key, it will return a boolean if any sound is playing (thanks @samme)
* `WebGLRenderer.dispatchContextLost` is a new internal method that is called when the WebGL context is lost. By default this is bound to the property `WebGLRenderer.contextLostHandler`. If you override the context loss handler, be sure to invoke this method in due course.
* `WebGLRenderer.dispatchContextRestore` is a new internal method that is called when the WebGL context is restored. By default this is bound to the property `WebGLRenderer.contextRestoreHandler`. If you override the context restore handler, be sure to invoke this method in due course.
* `WebGLRenderer.setContextHandlers` is a new internal method with 2 optional parameters: `contextLost` and `contextRestored`. These allow you to overwrite the default `contextLostHandler` and `contextRestoreHandler` handlers. (thanks @yaustar)
* `Phaser.Textures.Frame#setCutPosition` is a new internal method with 2 optional parameters: `x` and `y`. These sets the x and y position within the source image to cut from.
* `Phaser.Textures.Frame#setCutSize` is a new internal method with 2 parameters: `width` and `height`. These sets the width, and height of the area in the source image to cut. (thanks @FelipeIzolan)
* Introduced new constants in `ORIENTATION_CONST`. The constants `LANDSCAPE_SECONDARY` and `PORTRAIT_SECONDARY` have been added to the `Phaser.Scale.Orientation` object. These constants represent the secondary landscape and portrait orientations respectively. This addition provides more granular control over device orientation handling in Phaser. Fix #6837 (thanks @rexrainbow)
* Introduced `updateConfig` method in `ParticleEmitter` to allow dynamic updating of Particle Emitter configurations. This method enables existing properties to be overridden and new properties to be added to the emitter's configuration. It ensures that the emitter is reset with the updated configuration for more flexible particle effects management.
* Added functionality to the `Phaser.Textures.DynamicTexture#clear` method. Clear a specific area within a `Dynamic Texture` by specifying `x`, `y`, `width`, and `height` parameters to clear only a portion of the texture. Fix #6853 (thanks @SelfDevTV)
* Added functionality to the `Phaser.Renderer.WebGL.RenderTarget#clear` method. Clear a specific area within the `RenderTarget` by specifying `x`, `y`, `width`, and `height` parameters.
* Added Default Image Handling in `TextureManager`. In the game `config`, set `defaultImage` to `null` to ignore loading the `defaultImage`.
* Added Missing Image Handling in `TextureManager`. In the game `config`, set `missingImage` to `null` to ignore loading the `missingImage`.
* Added White Image Support in `TextureManager`. In the game `config`, set `whiteImage` to `null` to ignore loading the `whiteImage`.
* `Phaser.Core.TimeStep#pauseDuration` is a new property that holds the duration of the most recent game pause, if any, in ms (thanks @samme)
* The Game `Events#RESUME` event now contains a new parameter `pauseDuration` which is the duration, in ms, that the game was paused for (thanks @samme)
* Added `Phaser.Loader.LoaderPlugin#removePack` method to `LoaderPlugin` that removes resources listed in an Asset Pack.(thanks @samme)
* When using `Scene.switch` you can now optionally specify a `data` argument, just like with Scene start, which will be passed along to the Scene that was switched to (thanks @wooseok123)
* `PRE_RENDER_CLEAR` is a new event dispatched by the WebGL and Canvas Renderer. It's dispatched at the start of the render step, immediately before the canvas is cleared. This allows you to toggle the `clearBeforeRender` property as required, to have fine-grained control over when the canvas is cleared during render.
* `Video.getFirstFrame` is a new method that can be used to load the first frame of the Video into its texture without starting playback. This is useful if you want to display the first frame of a video behind a 'Play' button, without calling the 'play' method.
* `GameObject.getDisplayList` is a new method that will return the underlying list object that the Game Object belongs to, either the display list or its parent container.
* `GameObject.setToTop` is a new method that will move the Game Object to the top of the display list, or its parent container (thanks @rexrainbow)
* `GameObject.setToBack` is a new method that will move the Game Object to the bottom of the display list, or its parent container (thanks @rexrainbow)
* `GameObject.setAbove` is a new method that will move the Game Object to appear above a given Game Object (thanks @rexrainbow)
* `GameObject.setBelow` is a new method that will move the Game Object to appear below a given Game Object (thanks @rexrainbow)

# WebGL Rendering Updates

* `WebGLTextureWrapper.update` expanded:
  * `source` parameter is now type `?object`, so it can be used for anything that is valid in the constructor.
  * New `format` parameter can update the texture format.

# Updates - Input System

* The `GameObject.disableInteractive` method has a new optional parameter `resetCursor`. If set, this will reset the current custom input cursor - regardless if the Game Object was the one that set it, or not.
* The `GameObject.removeInteractive` method has a new optional parameter `resetCursor`. If set, this will reset the current custom input cursor - regardless if the Game Object was the one that set it, or not.
* The `InputManager.resetCursor` method has a new optional boolean `forceReset` which will reset the state of the CSS canvas cursor, regardless if there is a given Interactive Object, or not.
* The `InputPlugin.isActive` method will now check if the InputPlugin has the InputManager reference set, and if that is also enabled, as well as checking its own enabled state and that of the Scene.
* `InputPlugin.resetCursor` is a new method that will reset a custom CSS cursor from the main canvas, regardless of the interactive state of any Game Objects.
* The `InputPlugin.disable` method has a new optional boolean parameter `resetCursor` which will reset the CSS custom cursor if true.
* `InputPlugin.setCursor` is a new method that will immediately set the CSS cursor to the given Interactive Objects cursor. Previously, this was hidden behind a private method in the Input Manager.

All of the core Input Plugin process methods have been rewritten. The methods that have changed are:

* `InputPlugin.processMoveEvents`
* `InputPlugin.processWheelEvent`
* `InputPlugin.processOverEvents`
* `InputPlugin.processOutEvents`
* `InputPlugin.processOverOutEvents`
* `InputPlugin.processUpEvents`
* `InputPlugin.processDownEvents`

And they all now do the following flow:

1) They will now iterate over the array of objects to be inspected. If the object doesn't have an input handler, or their handler has been disabled, they are skipped for event consideration.
2) If they have an input handler, the Game Object specific event is dispatched (i.e. `sprite.on('pointerdown')`)
3) The result of this call is checked. If the Event has been cancelled, or if the Input Plugin now returns `isActive() false` then it will break from the handler loop. This will only happen if the user explicitly tells the event to stop propogation, or if they disable either the Input Plugin, or the entire Input Manager, during the event handler. Previously, only the state of cancelled event was checked. Also previously, if the Game Objects own input handler was removed or disabled as a result of their event handler, it would break from the process loop. This no longer happens. It will carry on inspecting the remaining interactive objects in the loop, as long as the Input system itself wasn't disabled.
4) After this, the Game Object is checked to see if it is still input enabled. If it is, the Scene level events, like `this.input.on('gameobjectdown')` are emitted.
5) The results of this call are also checked. Again, if the Event has been cancelled, or if the Input Plugin now returns `isActive() false` then it will break from the handler loop, otherwise it carries on.
6) After the loop is complete it does one final check to see if the Event was cancelled, or if the Input Plugin is no longer active. If both of those pass, it emits the final event from the Input Plugin itself (i.e. `this.input.on('pointerdown')` from a Scene)

The above flow is new in v3.85 and will catch a lot more strange edge-cases, where Game Objects, or the Event, or the whole Input system is disabled during an active event handler. The above fixes #6833 (thanks @ddanushkin), #6766 (thanks @pabloNeuronup) and #6754 (thanks @orcomarcio)

* `InputPlugin.forceDownState` is a new method that will force the given Game Object into the 'down' input state, regardless of what state it is currently in. This will emit the relevant events accordingly.
* `InputPlugin.forceUpState` is a new method that will force the given Game Object into the 'up' input state, regardless of what state it is currently in. This will emit the relevant events accordingly.
* `InputPlugin.forceOverState` is a new method that will force the given Game Object into the 'over' input state, regardless of what state it is currently in. This will emit the relevant events accordingly.
* `InputPlugin.forceOutState` is a new method that will force the given Game Object into the 'out' input state, regardless of what state it is currently in. This will emit the relevant events accordingly.
* `InputPlugin.forceState` is a new internal method that forces a Game Object into the given state.

# Updates

* Added `Phaser.Scale.ScaleManager.leaveFullScreenSuccessHandler` method to separate `Events.LEAVE_FULLSCREEN` from `Phaser.Scale.ScaleManager.stopFullscreen` to ensure `Events.LEAVE_FULLSCREEN` is only emitted once when exiting fullscreen mode. (Fix #6885, thanks @Antriel)
* Calling `Timeline.pause` will now pause any currently active Tweens that the Timeline had started (thanks @monteiz)
* Calling `Timeline.resume` will now resume any currently paused Tweens that the Timeline had started (thanks @monteiz)
* Calling `Timeline.clear` and `Timeline.destroy` will now destroy any currently active Tweens that the Timeline had created. Previously, active tweens would continue to play to completion (thanks @monteiz)
* `TimelineEvent` has a new property called `tweenInstance`. If the Timeline event has a tween that has been activated, this will hold a reference to it.
* If you create a BitmapText with an invalid key it will now throw a runtime error. Previously it just issued a console warning and then crashed (thanks @samme)
* The console warnings when Audio files are missing/incorrect have been improved (thanks @samme)
* The `requestVideoFrame` polyfill has been updated to the latest release, which should resolve some SSR framework issues. Fix #6776 (thanks @lantictac)
* `ScaleManager` listeners includes checks for the `screen.orientation` object and adds/removes a `change` eventListener  method to handle screen orientation changes on mobile devices. The `orientationchange` event is still maintained for backwards compatibility. Fix #6837 (thanks @rexrainbow)
* When creating a new `TileSprite`, setting either `width` or `height` to `0` results in both values being set to the `displayFrame.width` and `displayFrame.height`. The updated logic now checks for `width` and `height` separately. If `width` is `0`, it is set to `displayFrame.width`. If `height` is `0`, it is set to `displayFrame.height`. Fix #6857 (thanks @GaryStanton)
* Updated `GetBitmapTextSize` with improved `maxWidth` calculations for wrapped text.
* `Vector3.subVectors` is a new method that will take 2 Vector3s, subtract them from each other and store the result in the Vector3 it was called on.
* The `TextStyle.setStyle` method will no longer mutate the given `style` object if it includes a numeric `fontSize` value. Fix #6863 (thanks @stormpanda)
* Calling the `Shape.Ellipse.setSize` method will internally call `updateDisplayOrigin` to retain position after a size change.
* The `BitmapText BatchChar` function now inlines all of the matrix math, avoiding 16 function calls per character rendered.

# Bug Fixes

* The `activePointers` game config option is now the correct amount of touch input pointers set. Fix #6783 (thanks @samme)
* The method `TextureManager.checkKey` will now return `false` if the key is not a string, which fixes issues where a texture could be created if a key was given that was already in use (thanks Will Macfarlane).
* Added all of the missing Loader Config values (such as `imageLoadType`) to LoaderConfig, so they now appear in the TypeScript defs.
* The `EXPAND` scale mode had a bug that prevented it from using the world bounds cameras, cutting rendering short. Fix #6767 (thanks @Calcue-dev @rexrainbow)
* Calling `getPipelineName()` on a Game Object would cause a runtime error if running under Canvas. It now simply returns `null`. Fix #6799 (thanks @samme)
* Calling the Arcade Body `setPushable(false)` method for `circle` bodies prevents the bodies from being pushed. Fix #5617 (thanks @kainage)
* Calling `addDeathZone()` on a particle emitter Game Object had a bug where the `DeathZone` used world position coordinates. `DeathZone` now uses local position coordinates following the particle emitter position. Fix #6371 (thanks @vforsh)
* Updated the `GetLineToLine` method in `GetLineToLine` to handle the case where `dx1` or `dy1` values is zero. This ensures the function correctly returns `null` in this case to prevent errors in calculations involving line segments. Fix #6579 (thanks @finscn)
* Resolved all kerning issues in WebGL bitmap text rendering. This includes adjustments to glyph positioning and spacing, ensuring accurate and visually pleasing text display across all WebGL contexts. Fix #6631 (thanks @monteiz)
* Fixed Group vs Group collisions failing when performing a bitwise `&` operation between `body1.collisionMask` and `body2.collisionCategory`. The default `collisionMask` value is changed to `2147483647` to correctly match any `collisionCategory`. Fix #6764 (thanks @codeimpossible)
* Resolved an issue in `BitmapText` where adding a space character `' '` at the end of a line did not correctly align the vertical position of the new line. The updated calculation now correctly accounts for both line height and line spacing. Fix #6717 (thanks @wooseok123)
* Resolved an issue in `BitmapText` where an extra empty line was added when `setMaxWidth` was called, and the width of the line was less than a word. Previously, `yAdvance` was incorrectly incremented by `lineHeight + lineSpacing` for each word, leading to an unintended increase in vertical space. The correction now calculates `yAdvance` based on the `currentLine` index, ensuring that vertical spacing accurately reflects the number of lines. Fix #6807 (thanks @AlvaroNeuronup)
* Resolved an issue in `BitmapText` where adding a space character `' '` at the end of a line caused the following line of to ignore line wrapping when using `setMaxWidth`. Fix #6860 (thanks @bagyoni)
* The `Matrix4.lookAtRH` method would fail because it called two missing Vector3 methods.
* The `RenderTarget` will now automatically listen for the Renderer resize event if `autoResize` is true. This fixes an issue with Bitmap Masks where they wouldn't resize if the renderer resized. Fix #6769 #6794 (thanks @pavels @seansps)
* The `Texture.getFrameBounds` method will now include the BASE texture in its calculations. This prevents it from returning a size of Infinity. This fixes an issue where a Tileset with margin/spacing loaded via `load.spritesheet` instead of `load.image` would have its margin and spacing ignored. Fix #6823 (thanks @damian-pastorini)
* If you used letter spacing on a `Text` Game Object, combined with stroke, the stroke would be mis-aligned. The stroke is now applied to the letter-spaced text as well (thanks @RomanFrom710)
* The `PreFXPipeline.batchQuad` method will now apply `Math.round` to the target bounds center point. This prevents sub-pixel values during the `copyTextSubImage2D` call, preventing sprites with pre-fx from appearing mis-aligned during camera pans. Fix #6879 (thanks @Antriel)
* If you had a sprite on the display list using the LightPipeline, followed by a Mesh using the LightPipeline, and you invalidated the mesh (i.e. by rotating it), it would cause a runtime error in the current batch. Fix #6822 (thanks @urueda)
* The Arcade Physics `processCallback` will now correctly handle non-Game Object physics bodies and pass them to the callback (thanks @ospira)
* If you set a `WebAudioSound` to loop and set `SoundManager.pauseOnBlur = false`, then if you start the sound and tab away from Phaser, the sound wouldn't then loop on return to the game, if the loop _expired_ while the tab was out of focus. This was due to checking the audio source node target against the wrong internal property. Fix #6702 (thanks @michalfialadev)
* The `Mesh` WebGLRenderer will now recalculate the `vertexOffset` correctly if the batch flushes, fixing an issue where it would display missing triangles in a mesh after a batch flush. Fix #6814 (thanks @pavels)
* The `NineSlice` Game Object will now guard against an invalid texture by checking for the `frame` and `textureFrame` vars before trying to read values from them. Fix #6804 (thanks @IvanDem)
* DOM Game Elements are now kept in the correct position when a Scene camera zooms out. Previously, they only worked if you kept their origin at 0x0, or didn't zoom the camera out. Fix #6817 #6607 (thanks @moufmouf)

## Input Bug Fixes

* The method `pointer.leftButtonReleased` will now return `true` when multiple mouse buttons are being pressed.
* The method `pointer.rightButtonReleased` will now return `true` when multiple mouse buttons are being pressed.
* The method `pointer.middleButtonReleased` will now return `true` when multiple mouse buttons are being pressed.
* The method `pointer.backButtonReleased` will now return `true` when multiple mouse buttons are being pressed.
* The method `pointer.forwardButtonReleased` will now return `true` when multiple mouse buttons are being pressed. Fix #6027 (thanks @michalfialadev)

## Examples, Documentation, Beta Testing and TypeScript

Thanks to the following for helping with the Phaser Examples, Beta Testing, Docs, and TypeScript definitions, either by reporting errors, fixing them, or helping author the docs:

@AlbertMontagutCasero
@Andrek25
@Antriel
@leha-games
@lgtome
@monteiz
@rexrainbow
@saintflow47
@samme
@ssotangkur
@vankop

# Deprecation Warning for the next release

The _next release_ of Phaser will make the following API-breaking changes:

* We are removing `Phaser.Struct.Map` and replacing it with a regular JS `Map` instance. This means methods like `contains` and `setAll` will be gone.
* We are removing `Phaser.Struct.Set` and replacing it with a regular JS `Set` instance. This means methods like `iterateLocal` will be gone.
* The `Create.GenerateTexture`, all of the Create Palettes and the `create` folder will be removed.
* The `phaser-ie9.js` entry-point will be removed along with all associated polyfills.
* The Spine 3 and Spine 4 plugins will no longer be updated. You should now use the official Phaser Spine plugin created by Esoteric Software.
* The `Geom.Point` class and all related functions will be removed. All functionality for this can be found in the existing Vector2 math classes. All Geometry classes that currently create and return Point objects will be updated to return Vector2 objects instead.
* We will be moving away from Webpack and using ESBuild to build the next version of Phaser.
