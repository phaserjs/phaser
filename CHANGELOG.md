# Change Log

## Version 3.2.1 - 12th March 2018

### Bug Fixes

* Fixed issue with Render Texture tinting. Fix #3336 (thanks @rexrainbow)
* Fixed Utils.String.Format (thanks @samme)
* The Matter Debug Layer wouldn't clear itself in canvas mode. Fix #3345 (thanks @samid737)
* TimerEvent.remove would dispatch the Timer event immediately based on the opposite of the method argument, making it behave the opposite of what was expected. It now only fires when requested (thanks @migiyubi)
* The TileSprite Canvas Renderer did not support rotation, scaling or flipping. Fix #3231 (thanks @TCatshoek)
* Fixed Group doesn't remove children from Scene when cleared with the `removeFromScene` argument set (thanks @iamchristopher)
* Fixed an error in the lights pipeline when no Light Manager has been defined (thanks @samme)
* The ForwardDiffuseLightPipeline now uses `sys.lights` instead of the Scene variable to avoid errors due to injection removal.
* Phaser.Display.Color.Interpolate would return NaN values because it was loading the wrong Linear function. Fix #3372 (thanks @samid737)
* RenderTexture.draw was only drawing the base frame of a Texture. Fix #3374 (thanks @samid737)
* TileSprite scaling differed between WebGL and Canvas. Fix #3338 (thanks @TCatshoek)
* Text.setFixedSize was incorrectly setting the `text` property instead of the `parent` property. Fix #3375 (thanks @rexrainbow)
* RenderTexture.clear on canvas was using the last transform state, instead of clearing the whole texture.

### Updates

* The SceneManager.render will now render a Scene as long as it's in a LOADING state or higher. Before it would only render RUNNING scenes, but this precluded those that were loading assets.
* A Scene can now be restarted by calling `scene.start()` and providing no arguments (thanks @migiyubi)
* The class GameObject has now been exposed, available via `Phaser.GameObjects.GameObject` (thanks @rexrainbow)
* A Camera following a Game Object will now take the zoom factor of the camera into consideration when scrolling. Fix #3353 (thanks @brandonvdongen)
* Calling `setText` on a BitmapText object will now recalculate its display origin values. Fix #3350 (thanks @migiyubi)
* You can now pass an object to Loader.atlas, like you you can with images. Fix #3268 (thanks @TCatshoek)
* The `onContextRestored` callback won't be defined any more unless the WebGL Renderer is in use in the following objects: BitmapMask, Static Tilemap, TileSprite and Text. This should allow those objects to now work in HEADLESS mode. Fix #3368 (thanks @16patsle)
* The SetFrame method now has two optional arguments: `updateSize` and `updateOrigin` (both true by default) which will update the size and origin of the Game Object respectively. Fix #3339 (thanks @Jerenaux)

## Version 3.2.0 - Kaori - 5th March 2018

### New Features

* The new Render Texture Game Object is now available. You can clear, fill and draw texture frames to it. The Render Texture itself can be displayed in-game with its own transform, or you can use it as a Bitmap Mask for another Game Object.
* Game.resize allows you to resize the game config, renderer and input system in one call.
* When Game.resize is called it causes all Scene.Systems to have their resize method called. This is turn emits a `resize` event which your Scene can respond to. It will be sent the new width and height of the canvas as the only two parameters.
* InputManager.resize allows you to update the bounds def and input scale in one call.
* Game.Config.roundPixels property added to prevent sub-pixel interpolation during rendering of Game Objects in WebGL and Canvas.
* Load.plugin now accepts a class as an argument as well as a URL string (thanks @nkholski)
* Tween.complete will allow you to flag a tween as being complete, no matter what stage it is at. If an onComplete callback has been defined it will be invoked. You can set an optional delay before this happens (thanks @Jerenaux for the idea)
* The Headless render mode has been implemented. You can now set HEADLESS as the `renderType` in the Game Config and it will run a special game step that skips rendering. It will still create a Canvas element, as lots of internal systems (like input) rely on it, but it will not draw anything to it. Fix #3256 (thanks @rgk)
* GameObject.setInteractive has a new boolean argument `dropZone` which will allow you to set the object as being a drop zone right from the method.
* Sprites can now be drop zones and have other Game Objects dragged onto them as targets.
* The SceneManager has a new method: `remove` which allows you to remove and destroy a Scene, freeing up the Scene key for use by future scenes and potentially clearing the Scene from active memory for gc.
* SceneManager.moveAbove will move a Scene to be directly above another Scene in the Scenes list. This is also exposed in the ScenePlugin.
* SceneManager.moveBelow will move a Scene to be directly below another Scene in the Scenes list. This is also exposed in the ScenePlugin.
* Quadratic Bezier Interpolation has been added to the Math.Interpolation functions (thanks @RiCoTeRoX)
* A new Quadratic Bezier Curve class has been added, expanding the available Curve types (thanks @RiCoTeRoX)
* Path.quadraticBezierTo allows you to add a Quadratic Bezier Curve into your Path.
* Loader.multiatlas now supports Texture Packers new JSON atlas format which exports one combined atlas for all image files. This is available if you use the new Phaser 3 Export from within Texture Packer (thanks @CodeAndWeb)
* Modified WebGLPipeline to make it easier to extend and easier to create custom rendering passes.

### Bug Fixes

* Arcade Physics Bodies didn't apply the results of `allowRotation` to the parent Game Object.
* InputManager.updateBounds wouldn't correctly get the bounds of the canvas if it had horizontal or vertical translation in the page, causing the scale factor to be off (and subsequently input values to mis-fire)
* TileSprite.setFrame now works and allows you to change the frame to any other in the texture. Fix #3232 (thanks @Jerenaux)
* Swapped the queue loop in the SceneManager to to use `_queue.length` rather than a cached length (thanks @srobertson421)
* When calling `ScenePlugin.launch` the `data` argument is now passed to the queued scenes (thanks @gaudeon)
* Rectangle.top wouldn't reset the `y` position if the value given never exceed the Rectangles bottom. Fix #3290 (thanks @chancezeus)
* The implementation of `topOnly` within the Input Manager had broken the way drop zones worked, as they were now filtered out of the display list before processing. Drop zones are now treated on their own in the Input Plugin meaning you can still have `topOnly` set and still drop an item into a drop zone. This indirectly fixed #3291 (thanks @rexrainbow)
* InputPlugin.clear now properly removes a Game Object from all internal arrays, not just the _list.
* InputPlugin.processOverOut no longer considers an item as being 'out' if it's in the internal `_drag` array.
* When a Game Object is scaled, its Arcade Physics body was still calculating its position based on its original size instead of scaled one (thanks @pixelpicosean)
* The RandomDataGenerator classes randomness has been improved thanks to the correct caching of a class property. Fix #3289 (thanks @migiyubi)
* The RandomDataGenerator `sign` property had a method collision. Fix #3323 (thanks @vinerz and @samme)
* In Arcade Physics World if you collided a group with itself it would call a missing method (`collideGroupVsSelf`), it now calls `collideGroupVsGroup` correctly (thanks @patrickgalbraith)
* The HTML5 Sound Manager would unlock the Sound API on a touch event but only if the audio files were loaded in the first Scene, if they were loaded in a subsequent Scene the audio system would never unlock. It now unlocks only if there are audio files in the cache. Fix #3311 (thanks @chancezeus)
* The Text.lineSpacing value was not taken into account when rendering the Text. Fix #3215 (thanks @sftsk)
* InputPlugin.update now takes the totals from the drag and pointerup events into consideration when deciding to fall through to the Scene below. Fix #3333 (thanks @chancezeus)

### Updates

* AnimationComponent.play now calls `setSizeToFrame()` and `updateDisplayOrigin()` on the parent Game Object in order to catch situations where you've started playing an animation on a Game Object that uses a different size to the previously set frame.
* Text.setText will check if the value given is falsey but not a zero and set to an empty string if so.
* BitmapText.setText will check if the value given is falsey but not a zero and set to an empty string if so.
* BitmapText.setText will now cast the given value to a string before setting.
* BitmapText.setText will not change the text via `setText` unless the new text is different to the old one.
* If you set `transparent` in the Game Config but didn't provide a `backgroundColor` then it would render as black. It will now be properly transparent. If you do provide a color value then it must include an alpha component.
* You can now pass normal Groups to Arcade Physics collide / overlap, as well as Physics Groups. Fix #3277 (thanks @nkholski)
* Texture.get has been optimized to fail first, then error, with a new falsey check. This allows you to skip out specifying animation frames in the animation config without generating a console warning.
* The `setFrame` method of the Texture component has been updated so that it will now automatically reset the `width` and `height` of a Game Object to match that of the new Frame. Related, it will also adjust the display origin values, because they are size based. If the Frame has a custom pivot it will set the origin to match the custom pivot instead.
* ScenePlugin.swapPosition now allows you to use it to swap the positions of any two Scenes. Before the change it only allowed you to swap the position of the calling Scene and another one, but a new optional `keyB` argument opens this up.
* The SceneManager no longer renders a Scene unless it is visible AND either running or paused. This now skips Scenes that are in an `init` state.
* The Keyboard Manager will now no longer emit `keydown` events if you keep holding a key down. Fix #3239 (thanks @squaresun)
* The SceneManager now employs a new queue for all pending Scenes, creating them and booting them in strict sequence. This should prevent errors where Scenes were unable to reference other Scenes further down the boot list in their create functions. Fix #3314 (thanks @max1701 @rblopes)
* Game.preBoot and Game.postBoot callbacks now pass an instance of the game to the callback (thanks @rblopes)
* Graphics.arc in WebGL mode now works more like arc does in Canvas (thanks @Twilrom)
* GameObjects now emit a 'destroy' event when they are destroyed, which you can use to perform any additional processing you require. Fix #3251 (thanks @rexrainbow)
* If an HTML5AudioSound sound fails to play it will now issue a console.warn (thanks @samme)
* Phaser is now running Travis CI build testing again (thanks @vpmedia)
* Documentation updates: thanks to @melissaelopez @samme @jblang94 

## Version 3.1.2 - 23rd February 2018

### Updates

* Hundreds of JSDoc fixes across the whole API.
* Tween.updateTweenData will now check to see if the Tween target still exists before trying to update its properties.
* If you try to use a local data URI in the Loader it now console warns instead of logs (thanks @samme)

### Bug Fixes

* The KeyCode `FORWAD_SLASH` had a typo and has been changed to `FORWARD_SLASH`. Fix #3271 (thanks @josedarioxyz)
* Fixed issue with vertex buffer creation on Static Tilemap Layer, causing tilemap layers to appear black. Fix #3266 (thanks @akleemans)
* Implemented Static Tilemap Layer scaling and Tile alpha support.
* Fixed issue with null texture on Particle Emitter batch generation. This would manifest if you had particles with blend modes on-top of other images not appearing.
* Added missing data parameter to ScenePlugin. Fixes #3810 (thanks @AleBles)

## Version 3.1.1 - 20th February 2018

### Updates

* The entire codebase now passes our eslint config (which helped highlight a few errors), if you're submitting a PR, please ensure your PR passes the config too.
* The Web Audio Context is now suspended instead of closed to allow for prevention of 'Failed to construct AudioContext: maximum number of hardware contexts reached' errors from Chrome in a hot reload environment. We still strongly recommend reusing the same context in a production environment. See [this example](http://labs.phaser.io/view.html?src=src%5Caudio%5CWeb%20Audio%5CReuse%20AudioContext.js) for details. Fixes #3238 (thanks @z0y1 @Ziao)
* The Webpack shell plugin now fires on `onBuildExit`, meaning it'll update the examples if you use `webpack watch` (thanks @rblopes)
* Added `root: true` flag to the eslint config to stop it scanning further-up the filesystem.

### Bug Fixes

* Math.Fuzzy.Floor had an incorrect method signature.
* Arcade Physics World didn't import GetOverlapX or GetOverlapY, causing `separateCircle` to break.
* TileSprite was missing a gl reference, causing it to fail during a context loss and restore.
* The Mesh Game Object Factory entry had incorrect arguments passed to Mesh constructor.
* Removed unused `_queue` property from `ScenePlugin` class (thanks @rblopes)
* The variable `static` is no longer used in Arcade Physics, fixing the 'static is a reserved word' in strict mode error (thanks @samme)
* Fixed `Set.union`, `Set.intersect` and `Set.difference` (thanks @yupaul)
* The corner tints were being applied in the wrong order. Fixes #3252 (thanks @Rybar)
* BitmapText objects would ignore calls to setOrigin. Fixes #3249 (thanks @amkazan)
* Fixed a 1px camera jitter and bleeding issue in the renderer. Fixes #3245 (thanks @bradharms)
* Fixed the error `WebGL: INVALID_ENUM: blendEquation: invalid mode.` that would arise on iOS. Fixes #3244 (thanks @Ziao)
* The `drawBlitter` function would crash if `roundPixels` was true. Fixes #3243 (thanks @Jerenaux and @vulcanoidlogic)

## Version 3.1.0 - Onishi - 16th February 2018

### Updates

* Vertex resource handling code updated, further optimizing the WebGL batching. You should now see less gl ops per frame across all batches.
* The `Blitter` game object has been updated to use the `List` structure instead of `DisplayList`.
* Arcade Physics World `disableBody` has been renamed `disableGameObjectBody` to more accurately reflect what it does.
* Lots of un-used properties were removed from the Arcade Physics Static Body object.
* Arcade Physics Static Body can now refresh itself from its parent via `refreshBody`.

### Bug Fixes

* A couple of accidental uses of `let` existed, which broke Image loading in Safari # (thanks Yat Hin Wong)
* Added the static property `Graphics.TargetCamera` was added back in which fixed `Graphics.generateTexture`.
* The SetHitArea Action now calls `setInteractive`, fixing `Group.createMultiple` when a hitArea has been set.
* Removed rogue Tween emit calls. Fix #3222 (thanks @ZaDarkSide)
* Fixed incorrect call to TweenManager.makeActive. Fix #3219 (thanks @ZaDarkSide)
* The Depth component was missing from the Zone Game Object. Fix #3213 (thanks @Twilrom)
* Fixed issue with `Blitter` overwriting previous objects vertex data.
* The `Tile` game object tinting was fixed, so tiles now honor alpha values correctly.
* The `BitmapMask` would sometimes incorrectly bind its resources.
* Fixed the wrong Extend target in MergeXHRSettings (thanks @samme)

### New Features

* Destroying a Game Object will now call destroy on its physics body, if it has one set.
* Arcade Physics Colliders have a new `name` property and corresponding `setName` method.
* Matter.js bodies now have an inlined destroy method that removes them from the World.
* Impact bodies now remove themselves from the World when destroyed.
* Added Vector2.ZERO static property.
