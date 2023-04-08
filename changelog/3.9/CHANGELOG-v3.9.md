# Phaser 3 Change Log

## Version 3.9.0 - Yui - 24th May 2018

### New Features

* The command `npm run help` will display a friendly list of all the scripts available (run `npm install` first)
* Game has a new property `hasFocus` which is a read-only boolean that lets you know if the window the game is embedded in (including in an iframe) currently has focus or not.
* Game.Config has a new property `autoFocus`, which is `true` by default, and will automatically call `window.focus()` when the game starts.
* Clicking on the canvas will automatically call `window.focus`. This means in games that use keyboard controls if you tab or click away from the game, then click back on it again, the keys will carry on working (where-as before they would remain unfocused)
* Arcade Physics Body has a new method `setAllowDrag` which toggles the `allowDrag` property (thanks @samme)
* Arcade Physics Body has a new method `setAllowGravity` which toggles the `allowGravity` property (thanks @samme)
* Arcade Physics Body has a new method `setAllowRotation` which toggles the `allowRotation` property (thanks @samme)
* Arcade Physics Group Config has 3 new properties you can use: `allowDrag`, `allowGravity` and `allowRotation` (thanks @samme)
* PluginManager.registerFileType has a new property `addToScene` which allows you to inject the new file type into the LoaderPlugin of the given Scene. You could use this to add the file type into the Scene in which it was loaded.
* PluginManager.install has a new property `mapping`. This allows you to give a Global Plugin a property key, so that it is automatically injected into any Scenes as a Scene level instance. This allows you to have a single global plugin running in the PluginManager, that is injected into every Scene automatically.
* Camera.lerp has been implemented and allows you to specify the linear interpolation value used when following a target, to provide for smoothed camera tracking.
* Camera.setLerp is a chainable method to set the Camera.lerp property.
* Camera.followOffset is a new property that allows you to specify an offset from the target position that the camera is following (thanks @hermbit)
* Camera.setFollowOffset is a chainable method to set the Camera.followOffset property.
* Camera.startFollow has 4 new arguments: `lerpX` and `lerpY` which allow you to set the interpolation value used when following the target. The default is 1 (no interpolation) and `offsetX` and `offsetY` which allow you to set the follow offset values.
* Camera.startFollow will now immediately set the camera `scrollX` and `scrollY` values to be that of the target position to avoid a large initial lerps during the first few preUpdates.
* Math.Interpolation.SmoothStep is a new method that will return the smooth step interpolated value based on the given percentage and left and right edges.
* Math.Interpolation.SmootherStep is a new method that will return the smoother step interpolated value based on the given percentage and left and right edges.

### Updates

* Container.setInteractive can now be called without any arguments as long as you have called Container.setSize first (thanks rex)
* Bob.reset will now reset the position, frame, flip, visible and alpha values of the Bob.
* VisibilityHandler now takes a game instance as its sole argument, instead of an event emitter.
* PluginManager.createEntry is a new private method to create a plugin entry and return it. This avoids code duplication in several other methods, which now use this instead.
* The Plugin File Type has a new optional argument `mapping`, which allows a global plugin to be injected into a Scene as a reference.
* TileSprite.destroy has been renamed to `preDestroy` to take advantage of the preDestroy callback system.
* RenderTexture.destroy has been renamed to `preDestroy` to take advantage of the preDestroy callback system.
* Group.destroy now respects the `ignoreDestroy` property.
* Graphics.preDestroy now clears the command buffer array.
* Container addHandler will now remove a child's Scene shutdown listener and only listens to `destroy` once.
* Container removeHandler will re-instate a child's Scene shutdown listener.
* Container preDestroy now handles the pre-destroy calls, such as clearing the container.
* Blitter preDestroy will now clear the children List and renderList.
* The AudioContextMonkeyPatch has been updated to use an iife. Fix #3437 (thanks @NebSehemvi)

### Bug Fixes

* PluginManager.destroy didn't reference the plugin correctly, throwing an Uncaught TypeError if you tried to destroy a game instance. Fix #3668 (thanks @Telokis)
* If a Container and its child were both input enabled they will now be sorted correctly in the InputPlugin (thanks rex)
* Fix TypeError when colliding a Group as the only argument in Arcade Physics. Fix #3665 (thanks @samme)
* The Particle tint value was incorrectly calculated, causing the color channels to be inversed. Fix #3643 (thanks @rgk)
* All Game Objects that were in Containers were being destroyed twice when a Scene was shutdown. Although not required it still worked in most cases, except with TileSprites. TileSprites specifically have been hardened against this now but all Game Objects inside Containers now have a different event flow, stopping them from being destroyed twice (thanks @laptou @PaNaVTEC)
* Camera.cull will now accurately return only the Game Objects in the camera view, instead of them all. Fix #3646 (thanks @KingCosmic @Yora)
* The `dragend` event would be broadcast even if the drag distance or drag time thresholds were not met. Fix #3686 (thanks @RollinSafary)
* Restarting a Tween immediately after creating it, without it having first started, would cause it to get stuck permanently in the Tween Managers add queue (thanks @Antriel @zacharysarette)
* Setting an existing Game Object as a static Arcade Physics body would sometimes incorrectly pick-up the dimensions of the object, such as with TileSprites. Fix #3690 (thanks @fariazz)
* Interactive Objects were not fully removed from the Input Plugin when cleared, causing the internal list array to grow. Fix #3645 (thanks @tjb295 for the fix and @rexrainbow for the issue)
* Camera.shake would not effect dynamic tilemap layers. Fix #3669 (thanks @kainage)

### Examples, Documentation and TypeScript

Thanks to the work of @hexus we have now documented nearly all of the Math namespace. This is hundreds of functions now covered by full docs and is work we'll continue in the coming weeks.

My thanks to the following for helping with the Phaser 3 Examples, Docs and TypeScript definitions, either by reporting errors, fixing them or helping author the docs:

@mikez @wtravO @thomastanck
