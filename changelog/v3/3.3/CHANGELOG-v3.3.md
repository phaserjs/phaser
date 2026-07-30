# Phaser 3 Change Log

## Version 3.3.0 - Tetsuo - 22nd March 2018

A special mention must go to @orblazer for their outstanding assistance in helping to complete the JSDoc data-types, callbacks and type defs across the API.

### New Features

* TextStyle has two new properties: `baselineX` and `baselineY` which allow you to customize the 'magic' value used in calculating the text metrics.
* Game.Config.preserveDrawingBuffer is now passed to the WebGL Renderer (default `false`).
* Game.Config.failIfMajorPerformanceCaveat is now passed to the WebGL Renderer (default `false`).
* Game.Config.powerPreference is now passed to the WebGL Renderer (default `default`).
* Game.Config.antialias is now passed to the WebGL Renderer as the antialias context property (default `true`).
* Game.Config.pixelArt is now only used by the WebGL Renderer when creating new textures.
* Game.Config.premultipliedAlpha is now passed to the WebGL Renderer as the premultipliedAlpha context property (default `true`).
* You can now specify all of the renderer config options within a `render` object in the config. If no `render` object is found, it will scan the config object directly for the properties.
* Group.create has a new optional argument: `active` which will set the active state of the child being created (thanks @samme)
* Group.create has a new optional argument: `active` which will set the active state of the child being created (thanks @samme)
* Group.createMultiple now allows you to include the `active` property in the config object (thanks @samme)
* TileSprite has a new method: `setTilePosition` which allows you to set the tile position in a chained called (thanks @samme)
* Added the new Action - WrapInRectangle. This will wrap each items coordinates within a rectangles area (thanks @samme)
* Arcade Physics has the new methods `wrap`, `wrapArray` and `wrapObject` which allow you to wrap physics bodies around the world bounds (thanks @samme)
* The Tweens Timeline has a new method: `makeActive` which delegates control to the Tween Manager (thanks @allanbreyes)
* Actions.GetLast will return the last element in the items array matching the conditions.
* Actions.PropertyValueInc is a new action that will increment any property of an array of objects by the given amount, using an optional step value, index and iteration direction. Most Actions have been updated to use this internally.
* Actions.PropertyValueSet is a new action that will set any property of an array of objects to the given value, using an optional step value, index and iteration direction. Most Actions have been updated to use this internally.
* Camera.shake now has an optional `callback` argument that is invoked when the effect completes (thanks @pixelscripter)
* Camera.fade now has an optional `callback` argument that is invoked when the effect completes (thanks @pixelscripter)
* Camera.flash now has an optional `callback` argument that is invoked when the effect completes (thanks @pixelscripter)
* Camera.fadeIn is a new method that will fade the camera in from a given color (black by default) and then optionally invoke a callback. This is the same as using Camera.flash but with an easier to grok method name. Fix #3412 (thanks @Jerenaux)
* Camera.fadeOut is a new method that will fade the camera out to a given color (black by default) and then optionally invoke a callback. This is the same as using Camera.fade but with an easier to grok method name. Fix #3412 (thanks @Jerenaux)
* Groups will now listen for a `destroy` event from any Game Object added to them, and if received will automatically remove that GameObject from the Group. Fix #3418 (thanks @hadikcz)
* MatterGameObject is a new function, available via the Matter Factory in `this.matter.add.gameObject`, that will inject a Matter JS Body into any Game Object, such as a Text or TileSprite object.
* Matter.SetBody and SetExistingBody will now set the origin of the Game Object to be the Matter JS sprite.xOffset and yOffset values, which will auto-center the Game Object to the origin of the body, regardless of shape.
* SoundManager.setRate is a chainable method to allow you to set the global playback rate of all sounds in the SoundManager.
* SoundManager.setDetune is a chainable method to allow you to set the global detuning of all sounds in the SoundManager.
* SoundManager.setMute is a chainable method to allow you to set the global mute state of the SoundManager.
* SoundManager.setVolume is a chainable method to allow you to set the global volume of the SoundManager.
* BaseSound.setRate is a chainable method to allow you to set the playback rate of the BaseSound.
* BaseSound.setDetune is a chainable method to allow you to set the detuning value of the BaseSound.

### Bug Fixes

* Fixed the Debug draw of a scaled circle body in Arcade Physics (thanks @pixelpicosean)
* Fixed bug in `DataManager.merge` where it would copy the object reference instead of its value (thanks @rexrainbow)
* The SceneManager no longer copies over the `shutdown` and `destroy` callbacks in createSceneFromObject, as these are not called automatically and should be invoked via the Scene events (thanks @samme)
* The default Gamepad Button threshold has been changed from 0 to 1. Previously the value of 0 was making all gamepad buttons appear as if they were always pressed down (thanks @jmcriat)
* InputManager.hitTest will now factor the game resolution into account, stopping the tests from being offset if resolution didn't equal 1 (thanks @sftsk)
* CameraManager.getCamera now returns the Camera based on its name (thanks @bigbozo)
* Fixed Tile Culling for zoomed Cameras. When a Camera was zoomed the tiles would be aggressively culled as the dimensions didn't factor in the zoom level (thanks @bigbozo)
* When calling ScenePlugin.start any additional data passed to the method would be lost if the scene wasn't in an active running state (thanks @stuff)
* When calling Timeline.resetTweens, while the tweens are pending removal or completed, it would throw a TypeError about the undefined `makeActive` (thanks @allanbreyes)
* The WebGL Context would set `antialias` to `undefined` as it wasn't set in the Game Config. Fix #3386 (thanks @samme)
* The TweenManager will now check the state of a tween before playing it. If not in a pending state it will be skipped. This allows you to stop a tween immediately after creating it and not have it play through once anyway. Fix #3405 (thanks @Twilrom)
* The InputPlugin.processOverOutEvents method wasn't correctly working out the total of the number of objects interacted with, which caused input events to be disabled in Scenes further down the scene list if something was being dragged in an upper scene. Fix #3399 (thanks @Jerenaux)
* The InputPlugin.processDragEvents wasn't always returning an integer.
* LoaderPlugin.progress and the corresponding event now factor in both the list size and the inflight size when calculating the percentage complete. Fix #3384 (thanks @vinerz @rblopes @samme)
* Phaser.Utils.Array.Matrix.RotateLeft actually rotated to the right (thanks @Tomas2h)
* Phaser.Utils.Array.Matrix.RotateRight actually rotated to the left (thanks @Tomas2h)
* When deleting a Scene from the SceneManager it would set the key in the scenes has to `undefined`, preventing you from registering a new Scene with the same key. It's now properly removed from the hash(thanks @macbury)
* Graphics.alpha was being ignored in the WebGL renderer and is now applied properly to strokes and fills. Fix #3426 (thanks @Ziao)
* The font is now synced to the context in Text before running a word wrap, this ensures the wrapping result between updating the text and getting the wrapped text is the same. Fix #3389 (thanks @rexrainbow)
* Added the ComputedSize component to the Text Game Object, which allows Text.getBounds, and related methods, to work again instead of returning NaN.
* Group.remove now calls the `removeCallback` and passes it the child that was removed (thanks @orblazer)

### Updates

* The Text testString has changed from `|MÉqgy` to `|MÃ‰qgy`.
* The WebGLRenderer width and height values are now floored when multiplied by the resolution.
* The WebGL Context now sets `premultipliedAlpha` to `true` by default, this prevents the WebGL context from rendering as plain white under certain versions of macOS Safari.
* The Phaser.Display.Align constants are now exposed on the namespace. Fix #3387 (thanks @samme)
* The Phaser.Loader constants are now exposed on the namespace. Fix #3387 (thanks @samme)
* The Phaser.Physics.Arcade constants are now exposed on the namespace. Fix #3387 (thanks @samme)
* The Phaser.Scene constants are now exposed on the namespace. Fix #3387 (thanks @samme)
* The Phaser.Tweens constants are now exposed on the namespace. Fix #3387 (thanks @samme)
* The Array Matrix utils are now exposed and available via `Phaser.Utils.Array.Matrix`.
* Actions.Angle has 3 new arguments: `step`, `index` and `direction`.
* Actions.IncAlpha has 3 new arguments: `step`, `index` and `direction`.
* Actions.IncX has 3 new arguments: `step`, `index` and `direction`.
* Actions.IncY has 3 new arguments: `step`, `index` and `direction`.
* Actions.IncXY has 4 new arguments: `stepX`, `stepY`, `index` and `direction`.
* Actions.Rotate has 3 new arguments: `step`, `index` and `direction`.
* Actions.ScaleX has 3 new arguments: `step`, `index` and `direction`.
* Actions.ScaleXY has 4 new arguments: `stepX`, `stepY`, `index` and `direction`.
* Actions.ScaleY has 3 new arguments: `step`, `index` and `direction`.
* Actions.SetAlpha has 2 new arguments: `index` and `direction`.
* Actions.SetBlendMode has 2 new arguments: `index` and `direction`.
* Actions.SetDepth has 2 new arguments: `index` and `direction`.
* Actions.SetOrigin has 4 new arguments: `stepX`, `stepY`, `index` and `direction`.
* Actions.SetRotation has 2 new arguments: `index` and `direction`.
* Actions.SetScale has 2 new arguments: `index` and `direction`.
* Actions.SetScaleX has 2 new arguments: `index` and `direction`.
* Actions.SetScaleY has 2 new arguments: `index` and `direction`.
* Actions.SetVisible has 2 new arguments: `index` and `direction`.
* Actions.SetX has 2 new arguments: `index` and `direction`.
* Actions.SetXY has 2 new arguments: `index` and `direction`.
* Actions.SetY has 2 new arguments: `index` and `direction`.
* Line.getPointA now returns a Vector2 instead of an untyped object. It also now has an optional argument that allows you to pass a vec2 in to be populated, rather than creating a new one.
* Line.getPointB now returns a Vector2 instead of an untyped object. It also now has an optional argument that allows you to pass a vec2 in to be populated, rather than creating a new one.
* Rectangle.getLineA now returns a Line instead of an untyped object. It also now has an optional argument that allows you to pass a Line in to be populated, rather than creating a new one.
* Rectangle.getLineB now returns a Line instead of an untyped object. It also now has an optional argument that allows you to pass a Line in to be populated, rather than creating a new one.
* Rectangle.getLineC now returns a Line instead of an untyped object. It also now has an optional argument that allows you to pass a Line in to be populated, rather than creating a new one.
* Rectangle.getLineD now returns a Line instead of an untyped object. It also now has an optional argument that allows you to pass a Line in to be populated, rather than creating a new one.
* Triangle.getLineA now returns a Line instead of an untyped object. It also now has an optional argument that allows you to pass a Line in to be populated, rather than creating a new one.
* Triangle.getLineB now returns a Line instead of an untyped object. It also now has an optional argument that allows you to pass a Line in to be populated, rather than creating a new one.
* Triangle.getLineC now returns a Line instead of an untyped object. It also now has an optional argument that allows you to pass a Line in to be populated, rather than creating a new one.
* The GameObject `destroy` event is now emitted at the start of the destroy process, before things like the body or input managers have been removed, so you're able to use the event handler to extract any information you require from the GameObject before it's actually disposed of. Previously, the event was dispatched at the very end of the process.
* Phaser 3 is now built with Webpack v4.1.1 and all related packages have been updated (thanks @orblazer)
* On WebGL the currentScissor is now updated when the renderer `resize` method is called (thanks @jmcriat)
* PathFollower.start has been renamed to `startFollow` to avoid conflicting with the Animation component.
* PathFollower.pause has been renamed to `pauseFollow` to avoid conflicting with the Animation component.
* PathFollower.resume has been renamed to `resumeFollow` to avoid conflicting with the Animation component.
* PathFollower.stop has been renamed to `stopFollow` to avoid conflicting with the Animation component.
* BaseSound.setRate has been renamed to `calculateRate` to avoid confusion over the setting of the sounds rate.
