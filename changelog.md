Change Log
----------

Version 1.1.2 - November 1st 2013

* New: You'll now find a complete Basic project Template in the resources/Project Templates folder. Will add more complex ones soon.
* New: Phaser.Button now has the ability to set over/out/up/down sound effects so they play automatically based on those events.
* New: Added init method to plugins, to be called as they are added to the PluginManager (thanks beeglebug)
* New: Physics.Body now has a center property (issue 142, thanks MikeMnD)
* New: Lots of fixes across Full Screen Mode support. Input now works, scaling restores properly, world scale is correct and anti-alias support added.
* New: Added Group.cursor. This points to the first item added to a Group. You can move the cursor with Group.next() and Group.previous().
* New: Added Tween.isTweening(object) to check if an object is currently being tweened or not (thanks mikehamil10)
* New: Added getMagnitude, setMagnitude, normalize and isZero methods to Point (thanks beeglebug)
* New/Change: Group.callAll now supports nested functions and a context, making it really powerful!
* Updated: Fixed a few final bugs in the Sprite body and bounds calculations, in turn this resolved the Tilemap collision issues in the 1.1 release.
* Updated: Finished documentation for the Phaser.Button class.
* Updated: Fixed the Invaders game sample and enhanced it.
* Updated: Fixed the Star Struck game sample and enhanced it.
* Updated: If you pause an Animation, when you next play it it'll resume (un-pause itself).
* Updated: hexToRGB now accepts short hex codes (#EEE) (thanks beeglebug)
* Updated: State functions (preload, update, render, etc) are now passed the current game as a parameter (thanks beeglebug)
* Updated: If your game is running in Canvas (not WebGL) you can now set Stage.backgroundColor to rgba style CSS strings, allowing for semi-transparent game backgrounds.
* Updated: event.preventDefault() has been added to all Mouse event handlers.
* Updated: Sprite.deltaX/Y removed due to non-use. prevX/Y values moved to Sprite._cache.prevX/Y.
* Updated: Due to missing extends parameter the Sprite prototype was picking up functions from classes it never meant to (Button, TilemapLayer), now fully isolated.
* Fixed issue 135 - Added typeof checks into most ArcadePhysics functions to avoid errors with zero values.
* Fixed issue 136 - distanceTo using worldX/Y instead of x/y.
* Fixed lots of examples where the cursor keys / space bar were not locked from moving the browser page (if you find any more, please tell us!)
* Fixed issue 149 - Starling XML files now load properly again, also created an Example to show use of them (thanks haden)
* Fixed an issue where if the Starling XML file didn't contain a frameX/Y value it would crash on import.
* Fixed the Multiple Animations Example - it's now a lovely underwater scene :)
* Fixed issue 141 - If a Sprite is dragged and you release the Pointer while not over the Sprite, it will think it's still over it (thanks Paratron)
* Fixed issue 88 - Incorrect game.input.x/y values on click with scaled stage (thanks DrHackenstein)
* Fixed issue 143 - Entering full screen mode made the Input x/y coordinates go wrong.

Version 1.1.1 - October 26th 2013

* Quick patch to get Phaser.AUTO working again on Firefox / Android.
* Any key added via addKey now automatically adds it to the capture list.

Version 1.1 - October 25th 2013

What's New:

* JSDoc is go! We've added jsdoc3 blocks to every property and function, in every file and published the API docs to the docs folder.
* Brand new Example system (no more php!) and over 150 examples to learn from too.
* New TypeScript definitions file generated (in the build folder - thanks to TomTom1229 for manually enhancing this).
* New Grunt based build system added (thanks to Florent Cailhol)
* New: Phaser.Animation.generateFrameNames - really useful when creating animation data from texture atlases using file names, not indexes.
* Added Sprite.play as a handy short-cut to play an animation already loaded onto a Sprite.
* Added Canvas.setUserSelect() to disable touchCallouts and user selections within the canvas.
* Added Keyboard.addKey() which creates a new Phaser.Key object that can be polled for updates, pressed states, etc. See the 2 new examples showing use.
* Added Button.freezeFrames boolean. Stops the frames being set on mouse events if true.
* Extended the Loader 404 error to display the url of the file that didn't load as well as the key.
* New: Direction constants have been added to Sprites and adjust based on body motion.
* Brand new Sprite.update loop handler. Combined with the transform cache fix and further optimisations this is now much quicker to execute.
* Added Keyboard.createCursorKeys() which creates an object with 4 Key objects inside it mapped to up, down, left and right. See the new example in the input folder.
* Added Body.skipQuadTree boolean for more fine-grained control over when a body is added to the World QuadTree.
* Re-implemented Angular Velocity and Angular Acceleration on the Sprite.body and created 2 new examples to show use.
* Added Sprite.fixedToCamera boolean. A Sprite that is fixed to the camera doesn't move with the world, but has its x/y coordinates relative to the top-left of the camera.
* Added Group.createMultiple - useful when you need to create a Group of identical sprites for pooling, such as bullets.
* Added Group.total. Same as Group.length, but more in line with the rest of the Group naming.
* Added Sprite.outOfBoundsKill boolean flag. Will automatically kill a sprite that leaves the game World bounds (off by default).
* Lots of changes and fixes in ArcadePhysics, including:
* Functions with "mouse" in the title have been updated to "pointer" to more accurately reflect what they do.
* New velocity functions: moveToObject, moveToPointer, moveToXY
* New acceleration functions: accelerateToObject, accelerateToPointer, accelerateToXY
* New distance functions: distanceBetween, distanceToXY, distanceToPointer
* New angle functions: angleBetween, angleToXY, angleToPointer
* velocityFromAngle and velocityFromRotation added with examples created.
* Added killOnComplete parameter to Animation.play. Really useful in situations where you want a Sprite to animate once then kill itself on complete, like an explosion effect.
* Added Sprite.loadTexture(key, frame) which allows you to load a new texture set into an existing sprite rather than having to create a new sprite.
* Added Sprite.destroy back in again and made it a lot more robust at cleaning up child objects.
* Added 'return this' to all the core Loader functions so you can chain load calls if you so wish.
* Added Text.destroy() and BitmapText.destroy(), also updated Group.remove to make it more bullet-proof when an element doesn't have any events.
* Added Phaser.Utils.shuffle to shuffle an array.
* Added Graphics.destroy, x, y and updated angle functions.
* Added AnimationManager.refreshFrame - will reset the texture being used for a Sprite (useful after a crop rect clear)
* Added Physics.overlap(sprite1, sprite2) for quick body vs. body overlap tests with no separation performed.
* On a busy page it's possible for the game to boot with an incorrect stage offset x/y which can cause input events to be calculated wrong. A new property has been added to Stage to combat this issue: Stage.checkOffsetInterval. By default it will check the canvas offset every 2500ms and adjust it accordingly. You can set the value to 'false' to disable the check entirely, or set a higher or lower value. We recommend that you get the value quite low during your games preloader, but once the game has fully loaded hopefully the containing page will have settled down, so it's probably safe to disable the check entirely.
* Added Rectangle.floorAll to floor all values in a Rectangle (x, y, width and height).

What's changed:

* Renamed Phaser.Text.text to Phaser.Text.content to avoid conflict and overwrite from Pixi local var.
* Renamed Phaser.Text.style to Phaser.Text.font to avoid conflict and overwrite from Pixi local var.
* Phaser.Button now sets useHandCursor to true by default.
* Change: When you start a new State all active tweens are now purged.
* When the game boots it will now by default disable user-select and touch action events on the game canvas.
* Moved LinkedList.dump to Debug.dumpLinkedList(list)
* Phaser.Animation.Frame is now Phaser.Frame
* Phaser.Animation.FrameData is now Phaser.FrameData
* Phaser.Animation.Parser is now Phaser.AnimationParser (also the file has renamed from Parser.js to AnimationParser.js)
* Phaser.Loader.Parser is now Phaser.LoaderParser (also the file has renamed from Parser.js to LoaderParser.js)
* Change: We've removed the scrollFactor property from all Game Objects. Sorry, but the new Camera system doesn't work with it and it caused all kinds of issues anyway. We will sort out a replacement for it at a later date.
* Change: World now extends Phaser.Group. As a result we've updated GameObjectFactory and other classes that linked to it. If you have anywhere in your code that used to reference world.group you can just remove 'group' from that. So before, world.group.add() is now just world.add().
* Change: The Camera has been completely revamped. Rather than adjusting the position of all display objects (bad) it now just shifts the position of the single world container (good!), this is much quicker and also stops the game objects positions from self-adjusting all the time, allowing for them to be properly nested with other containers.
* Made Sprite.body optional and added in checks, so you can safely null the Sprite body object if using your own physics system and not impact rendering.
* Moved the Camera update checks to World.postUpdate, so all the sprites get the correct adjusted camera position.
* The default Game.antialias value is now 'true', so graphics will be smoothed automatically in canvas. Disable it via the Game constructor or Canvas utils.
* Phaser.Group now automatically calls updateTransform on any child added to it (avoids temp. frame glitches when new objects are rendered on their first frame).

What has been updated:

* Complete overhaul of Physics.Arcade.Body - now significantly more stable and faster too.
* Updated ArcadePhysics.separateX/Y to use new body system - much better results now.
* Added World.postUpdate - all sprite position changes, as a result of physics, happen here before the render.
* Added Animation.paused - can be set to true/false.
* Added support for Body.maxVelocity (thanks cocoademon)
* InputHandler now creates the _pointerData array on creation and populates with one empty set of values, so pointerOver etc all work before a start call.
* Removed the callbackContext parameter from Group.callAll because it's no longer needed.
* Updated Group.forEach, forEachAlive and forEachDead so you can now pass as many parameters as you want, which will all be given to the callback after the child.
* Updated build script so it can be run from the command-line and includes UMD wrappers (thanks iaincarsberg)
* World.randomX/Y now returns values anywhere in the world.bounds range (if set, otherwise 0), including negative values.
* Updated InputHandler to use Math.round rather than Math.floor when snapping an object during drag.
* If you didn't provide the useNumericIndex parameter then AnimationManager.add will set the value by looking at the datatype of the first element in the frames array.
* Group.create now sets the visible and alive properties of the Sprite to the same value as the 'exists' parameter.
* World.randomX/Y now works with negative World.bounds values.
* Tweens .to will now always return the parent (thanks powerfear)
* You can now pass a PIXI.Texture to Sprite (you also need to pass a Phaser.Frame as the frame parameter) but this is useful for Sprites sharing joint canvases.
* Group.alpha is now exposed publically and changes the Group container object (not the children directly, who can still have their own alpha values)
* Device.webGL uses new inspection code to accurately catch more webGL capable devices.
* Debug.renderSpriteBody updated to use a the new Sprite.Body.screenX/Y properties.
* Additional checks added to AnimationManager.frame/frameName on the given values.
* You can now null a Sprite.crop and it will clear down the crop rect area correctly.
* Phaser.Time physicsElapsed delta timer clamp added. Stops rogue iOS / slow mobile timer errors causing crazy high deltas.
* Animation.generateFrameNames can now work in reverse, so the start/stop values can create frames that increment or decrement respectively.
* Loader updated to use xhr.responseText when loading json, csv or text files. xhr.response is still used for Web Audio binary files (thanks bubba)
* Input.onDown and onUp events now dispatch the original event that triggered them (i.e. a MouseEvent or TouchEvent) as the 2nd parameter, after the Pointer (thanks rezoner)
* Updated Sprite.crop significantly. Values are now cached, stopping constant Texture frame updates and you can do sprite.crop.width++ for example (thanks haden)
* Change: Sprite.crop needs to be enabled with sprite.cropEnabled = true.
* Sprite.loadTexture now works correctly with static images, RenderTextures and Animations.
* Lots of fixes within Sprite.bounds. The bounds is now correct regardless of rotation, anchor or scale of the Sprite or any of its parent objects.

What has been fixed:

* QuadTree bug found in 1.0.5 now fixed. The QuadTree is updated properly now using localTransform values.
* Fixed the Bounce.In and Bounce.InOut tweens (thanks XekeDeath)
* Fixed an issue in Animation.update where if the game was paused it would get an insane delta timer throwing a uuid error.
* Added PixiPatch.js to patch in a few essential features until Pixi is updated.
* Fixed issue in Animation.play where the given frameRate and loop values wouldn't overwrite those set on construction.
* Fixed small bug stopping Tween.pause / resume from resuming correctly when called directly.
* Fixed an issue where Tweens.removeAll wasn't clearing tweens in the addition queue.
* Fixed Particle Emitters when using Emitter width/height (thanks XekeDeath)
* Made animation looping more robust when skipping frames (thanks XekeDeath)
* Fix for incorrect new particle positioning (issue #73) (thanks cottonflop)
* Fixed issue in Sound.play where if you gave a missing marker it would play the whole sound sprite instead.
* Button.setFrames will set the current frame based on the button state immediately.
* Loaded.setPreloadSprite now rounds the width/height values and starts from 1. This fixes canvas draw errors in IE9/10 and Firefox.
* Fixed issue causing Keyboard.justPressed to always fire (thanks stemkoski)
* Fixed bug in LinkedList#remove that could cause first to point to a dead node (thanks onedayitwillmake)
* Fixed Cache.addDefaultImage so the default image works in Canvas as well as WebGL. Updated to a new image (32x32 black square with green outline)
* Fixed a bug in the Sprite transform cache check that caused the skew/scale cache to get constantly invalidated - now only updates as needed, significant performance increase!
* Fixed typo in StageScaleMode so it's not pageAlignVeritcally any longer, but pageAlignVertically.
* Fixed issue in Group.countLiving / countDead where the value was off by one (thanks mjablonski)
* Fixed issue with a jittery Camera if you moved a Sprite via velocity instead of x/y placement.
* Fixed the RandomDataGenerator.sow method so if you give in the same seed you'll now get the same results (thanks Hsaka)
* Fixed Issue #101 (Mouse Button 0 is not recognised, thanks rezoner)
* Fixed an issue where creating an animation with just one frame with an index of zero would cause a UUID error (thanks SYNYST3R1)
* Fixed Rectangle.union (thanks andron77)
* Fixed Sound.resume so it now correctly resumes playback from the point it was paused (fixes issue 51, thanks Yora).
* Fixed issue 105 where a dragged object that was destroyed would cause an Input error (thanks onedayitwillmake)
* Fixed Issue 111 - calling Kill on a Phaser.Graphics instance causes error on undefined events.
* Game.destroy will now stop the raf from running as well as close down all input related event listeners (issue 92, thanks astrism)
* Pixel Perfect click detection now works even if the Sprite is part of a texture atlas.

Version 1.0.6 (September 24th 2013)

* Added check into Pointer.move to always consider a Sprite that has pixelPerfect enabled, regardless of render ID.
* BUG: The pixel perfect click check doesn't work if the sprite is part of a texture atlas yet.
* Fixed issue with anti-alias in the Game constructor not being set correctly (thanks luizbills)
* Added support for the Graphics game object back in and two examples (thanks earok for spotting)
* New: Tweens can now be chained via multiple to() calls + example created (thanks to powerfear for adding)
* Fixed Math.wrap (thanks TheJare)
* New: When loading a Sprite Sheet you can now pass negative values for the frame sizes which specifies the number of rows/columns to load instead (thanks TheJare)
* New: BitmapText now supports anchor and has fixed box dimensions (thanks TheJare)
* Fixed bug where if a State contains an empty Preloader the Update will not be called (thanks TheJare)
* Several new examples added (cameras, tweens, etc)
* Added in extra checks to halt collision if it involves an empty Group (thanks cang)
* Added time smoothing to Animation update to help frames hopefully not get too out of sync during long animations with high frame rates.
* Added frame skip to Animation.update. If it gets too far behind it will now skip frames to try and catch up.

Version 1.0.5 (September 20th 2013)

* Fixed issue in FrameData.getFrameIndexes where the input array was being ignored.
* Added Math.numberArray - Returns an Array containing the numbers from min to max (inclusive), useful for animation frame construction.
* Fixed a horrendously sneaky bug: If a new tween was created in the onComplete callback of a tween about to be deleted, it would get automatically spliced.
* Added a pendingDelete property to Tween to stop tweens that were removed during a callback from causing update errors during the TweenManager loop.
* Added Group.length property.
* Added explicit x/y attributes to Phaser.Text to make it work with the camera system (thanks cocoademon).
* Fixed issue stopping multiple animations from playing, only the most recent would play (frames array was being overwritten, thanks Legrandk)
* Updated Debug.renderSpriteBounds() so it doesn't use the deprecated Sprite.worldView any more (thanks MikeMnD)
* Added 2 new properties to the Text object: Text.text and Text.style, both are getter/setters and don't flag dirty unless changed, so safe for core loop use.
* Removed the exists check from Group.callAll, it now runs on all children (as the name implies)
* Added Group.callAllExists - you can now call a function on all children who have exists = the provided boolean.
* Finished off the Breakout example game - now fully playable, proper rebound, scoring, lives, etc.
* Removed Group.sort dummy entry until it's working.
* Removed ArcadePhysics.postUpdate.
* Updated Sprite.update to set renderable to false when the object goes out of Camera, not 'visible' false, otherwise it stops the transform being updated by Pixi.
* BUG: There is a known issue where the wrong rect coordinates are given to the QuadTree if the Sprite is a child of a Group or another Sprite which has an x/y offset.

Version 1.0.4 (September 18th 2013)

* Small fix to Phaser.Canvas to stop it from setting overflow hidden if the parent DOM element doesn't exist.
* Added Loader.setPreloadSprite(sprite, direction) - this will automatically apply a crop rect to the Sprite which is updated in line with the load progress.
* A lot of changes inside the StateManager. State functions are now passed through link() which automatically creates the key Game properties (load, input, etc)
* Fixed a bug in getFrameByName that wouldn't return the first frame in the array.
* Updated Phaser.Rectangle.intersects to use x and y instead of left and top so it can be used to check Physics bodies overlapping.
* Fixed issue in Cache where the Frame index wasn't being set correctly (thanks Cameron)
* Fixed issue in Sprite where boundsY wasn't set (thanks Cameron)
* For some reason there were 2 copies of the Canvas class in the build file - fixed, a few KB saved :)

Version 1.0.3 (September 17th 2013)

* FrameData.getFrameIndexes and getFrameIndexesByName refactored into a more versatile getFrames function.
* Various fixes to looping parameters in the Sound system.
* Documentation started across most classes. Keep track of progress in the Docs folder.
* Optimised AnimationManager.add so it will only get the required frames rather than all of them and is now faster at parsing the frame data.
* Fixed Phaser.Text and Phaser.BitmapText so they now render correctly and added several Text examples.

Version 1.0.2 (September 16th 2013)

* Added optional parameter to Animation.stop: resetFrame. If true the animation will be stopped and then the current frame reset to the first frame in the animation.
* Fixed an issue causing 'explode' particle bursts to ignore the quantity parameter.
* Added 'collideWorldBounds' to Emitter.makeParticles function.
* Added Emitter.angularDrag
* Changed Emitter.bounce from a number to a Point, so now set its x/y properties to control different amounts of bounce per axis.
* Fixed a bug in the AnimationManager where useNumericIndex was always set to true
* Added in lots of Particle examples
* Added in the start of a Breakout game
* Added in the start of a Platformer game

Version 1.0.1 (September 15th 2013)

* Added checks into every Group function to ensure that the Group has children before running them.
* Added optional flag to Group.create which allows you to set the default exists state of the Sprites.
* Sprite.animation.stop no longer needs an animation name parameter, will default to stopping the current animation.
* Fixed the license in package.json
* Fixed a logic bug in the separateTileX function that would sometimes cause tunneling of big sprites through small tiles.

Version 0.9.8

* Massive refactoring across the entire codebase.
* Removed Basic and GameObject and put Sprite on a diet. 127 properties and methods cut down to 32.
* Added a new headless renderer for non-display related performance testing.
* Added camera type to the CameraManager for future non-orthographic cameras.
* Added Camera.destroy - now clears down the FX and unregisters itself from the CameraManager.
* Added Camera.hide/show to hide Sprites or Groups from rendering (and removed corresponding hideFromCamera methods from Sprites/Groups)
* Heavily optimised Group so it no longer creates any temporary variables in any methods.
* Added Game.renderer which can be HEADLESS, CANVAS or WEBGL (coming soon)
* Added Sprite.render which is a reference to IRenderer.renderSprite, but can be overridden for custom handling.
* Refactored QuadTree so it no longer creates any temporary variables in any methods.
* The Sprite Renderer now uses a single setTransform for scale, rotation and translation that respects the Sprite.origin value in all cases.
* Sprite.modified is set to true if scale, rotation, skew or flip have been used.
* Added Tween.loop property so they can now re-run themselves indefinitely.
* Added Tween.yoyo property so they can reverse themselves after completing.
* Added Gravity to the Physics component.
* Removed Sprite.angle - use Sprite.rotation instead
* Optimised separateX/Y and overlap so they don't use any temporary vars any more.
* Added the new Physics.Body object to all Sprites. Used for all physics calculations in-game. Will be extended for Fixtures/Joints in future.
* Added SpriteUtils.setOriginToCenter to quickly set the origin of a sprite based on either frameBounds or body.bounds
* Added Sprite.Input component for tracking Input events over a Sprite
* Added Sprite.Input.useHandCursor (for desktop)
* Added Sprite.Input.justOver and justOut with a configurable ms delay
* Added Sprite.Events component for a global easy to access area to listen to events from
* Added Group.ID, each Group has a unique ID. Added Sprite.group (and Group.group) which is a reference to the Group it was added to.
* Added Group.addNewSprite(x,y,key) for quick addition of new Sprites to a Group
* Fixed Group.sort so the sortHandler is called correctly
* Added Group.swap(a,b) to swap the z-index of 2 objects with optional rendering update boolean
* Sprites dispatch new events for: killed, revived, added to Group and removed from Group.
* Added Input drag, bounds, sprite bounds and snapping support.
* Added the new ColorUtils class full of lots of handy color manipulation functions.
* Fixed issue in Camera.inCamera check where it wouldn't take into consideration the Sprites scrollFactor.
* Fixed issue with JSON Atlas loader incorrectly parsing the frames array.
* Fixed bug in FrameData.getFrameByName where the first frame of the array would always be skipped.
* Fixed bug where the Stage.backgroundColor property wasn't being saved correctly.
* Made Stage.bootScreen and Stage.pauseScreen public so you can override them with your own States now.
* Added the new OrientationScreen and Stage.enableOrientationCheck to allow for easy 'portrait/landscape only' game handling.
* Added fix to StageScaleMode for 180 degree portrait orientation on iPad.
* Added fix to orientation check so that it updates the input offsets correctly on rotation.
* Added support for minWidth and minHeight to game scale size, so it can never go below those values when scaling.
* Vastly improved orientation detection and response speed.
* Added custom callback support for all Touch and Mouse Events so you can easily hook events to custom APIs.
* Updated Game.loader and its methods. You now load images by: game.load.image() and also: game.load.atlas, game.load.audio, game.load.spritesheet, game.load.text. And you start it with game.load.start().
* Added optional frame parameter to Phaser.Sprite (and game.add.sprite) so you can set a frame ID or frame name on construction.
* Fixed bug where passing a texture atlas string would incorrectly skip the frames array.
* Added AnimationManager.autoUpdateBounds to control if a new frame should change the physics bounds of a sprite body or not.
* Added StageScaleMode.pageAlignHorizontally and pageAlignVertically booleans. When true Phaser will set the margin-left and top of the canvas element so that it is positioned in the middle of the page (based only on window.innerWidth).
* Added support for globalCompositeOperation, opaque and backgroundColor to the Sprite.Texture and Camera.Texture components.
* Added ability for a Camera to skew and rotate around an origin.
* Moved the Camera rendering into CanvasRenderer to keep things consistent.
* Added Stage.setImageRenderingCrisp to quickly set the canvas image-rendering to crisp-edges (note: poor browser support atm)
* Sprite.width / height now report the scaled width height, setting them adjusts the scale as it does so.
* Created a Transform component containing scale, skew, rotation, scrollFactor, origin and rotationOffset. Added to Sprite, Camera, Group.
* Created a Texture component containing image data, alpha, flippedX, flippedY, etc. Added to Sprite, Camera, Group.
* Added CameraManager.swap and CameraManager.sort methods and added a z-index property to Camera to control render order.
* Added World.postUpdate loop + Group and Camera postUpdate methods.
* Fixed issue stopping Pointer from working in world coordinates and fixed the world drag example.
* For consistency renamed input.scaledX/Y to input.scale.
* Added input.activePointer which contains a reference to the most recently active pointer.
* Sprite.Transform now has upperLeft, upperRight, bottomLeft and bottomRight Point properties and lots of useful coordinate related methods.
* Camera.inCamera check now uses the Sprite.worldView which finally accurately updates regardless of scale, rotation or rotation origin.
* Added Math.Mat3 for Matrix3 operations (which Sprite.Transform uses) and Math.Mat3Utils for lots of use Mat3 related methods.
* Added SpriteUtils.overlapsXY and overlapsPoint to check if a point is within a sprite, taking scale and rotation into account.
* Added Cache.getImageKeys (and similar) to return an array of all the keys for all currently cached objects.
* Added Group.bringToTop feature. Will sort the Group, move the given sprites z-index to the top and shift the rest down by one.
* Brand new Advanced Physics system added and working! Woohoo :)
* Fixed issue in Tilemap.parseTiledJSON where it would accidentally think image and object layers were map data.
* Fixed bug in Group.bringToTop if the child didn't have a group property yet.
* Fixed bug in FrameData.checkFrameName where the first index of the _frameNames array would be skipped.
* Added isRunning boolean property to Phaser.Tween
* Moved 'facing' property from Sprite.body to Sprite.texture (may move to Sprite core)
* Added Sprite.events.onDragStart and onDragStop
* A tilemap can now be loaded without a tile sheet, should you just want to get the tile data from it and not render.
* Added new Sprite.events: onAnimationStart, onAnimationComplete, onAnimationLoop
* Added in support for the Input component PriorityID value and refactored Input.Pointer to respect it. Rollovers are perfect now :)
* Added 2 new State functions: loadRender and loadUpdate, are called the same as render and update but only during the load process
* Fixed Input.stopDrag so it fires an onInputUp event as well from the sprite.
* Added support for a preRender state - very useful for certain types of special effects.
* Cameras are now limited so they can never be larger than the Game.Stage size.
* Added a new Button Game Object for easily creating in-game UI and menu systems.
* Fixed bug where Sprite.alpha wasn't properly reflecting Sprite.texture.alpha.
* Fixed bug where the hand cursor would be reset on input up, even if the mouse was still over the sprite.
* Fixed bug where pressing down then moving out of the sprite area wouldn't properly reset the input state next time you moved over the sprite.
* Added the Sprite.tween property, really useful to avoid creating new tween vars in your local scope if you don't need them.
* Added support for pagehide and pageshow events to Stage, hooked in to the pause/resume game methods.
* Extended Device audio checks to include opus and webm.
* Updated Loader and Cache so they now support loading of Audio() tags as well as Web Audio.
* Set Input.recordPointerHistory to false, you now need to enable the pointer tracking if you wish to use it.
* SoundManager will now automatically handle iOS touch unlocking.
* Added TilemapLayer.putTileWorldXY to place a tile based on pixel values, and putTile based on tile map coordinates.
* Dropped the StageScaleMode.setScreenSize iterations count from 40 down to 10 and document min body height to 2000px.
* Added Phaser.Net for browser and network specific functions, currently includes query string parsing and updating methods.
* Added a new CSS3 Filters component. Apply blur, grayscale, sepia, brightness, contrast, hue rotation, invert, opacity and saturate filters to the games stage.
* Fixed the CircleUtils.contains and containsPoint methods.
* Fixed issue with Input.speed values being too high on new touch events.
* Added Sprite.bringToTop()
* Added Stage.disableVisibilityChange to stop the auto pause/resume from ever firing.
* Added crop support to the Texture component, so you can do Sprite.crop to restrict rendering to a specified Rectangle without distortion.
* Added references to all the event listener functions so they can be cleanly destroyed.
* Fixed interesting Firefox issue when an audio track ended it fired another 'canplaythrough' event, confusing the Loader.
* Added the new PluginManager. Moved all the Camera FX over to plugins. Everything will be a plugin from now on.
* Added Sprite.transform.centerOn(x,y) to quickly center a sprite on a coordinate without messing with the sprite origin and regardless of rotation.
* Added Input.pollRate - this lets you limit how often Pointer events are handled (0 = every frame, 1 = every other frame, etc)
* Renamed the 'init' function to 'preload'. It now calls load.start automatically.
* Added CanvasUtils class, including ability to set image rendering, add a canvas to the dom and other handy things.


Version 0.9.6

* Virtually every class now has documentation - if you spot a typo or something missing please shout (thanks pixelpicosean).
* Grunt file updated to produce the new Special FX JS file (thanks HackManiac).
* Fixed issue stopping Phaser working on iOS 5 (iPad 1).
* Created new mobile test folder, updated index.php to use mobile CSS and made some mobile specific tests.
* Fixed a few speed issues on Android 2.x stock browser.
* Moved Camera context save/restore back inside parameter checks (sped-up Samsung S3 stock browser).
* Fixed bug with StageScaleMode.checkOrientation not respecting the NO_SCALE value.
* Added MSPointer support (thanks Diego Bezerra).
* Added Camera.clear to perform a clearRect instead of a fillRect if needed (default is false).
* Swapped Camera.opaque default from true to false re: performance.
* Updated Stage.visibilityChange to avoid pause screen locking in certain situations.
* Added StageScaleMode.enterLandscape and enterPortrait signals for easier device orientation change checks.
* Added StageScaleMode.isPortrait.
* Updated StageScaleMode to check both window.orientationchange and window.resize events.
* Updated RequestAnimationFrame to use performance.now for sub-millisecond precision and to drive the Game.time.update loop.
* Updated RequestAnimationFrame setTimeout to use fixed timestep and re-ordered callback sequence. Android 2/iOS5 performance much better now.
* Removed Stage.ORIENTATION_LANDSCAPE statics because the values should be taken from Stage.scale.isPortrait / isLandscape.
* Removed Stage.maxScaleX/Y and moved them into StageScaleMode.minWidth, minHeight, maxWidth and maxHeight.
* Fixed Stage.scale so that it resizes without needing an orientation change first.
* Added StageScaleMode.startFullscreen(), stopFullScreen() and isFullScreen for making use of the FullScreen API on desktop browsers.
* Swapped Stage.offset from Point to MicroPoint.
* Swapped Stage.bounds from Rectangle to Quad.
* Added State.destroy support. A states destroy function is called when you switch to a new state (thanks JesseFreeman).
* Added Sprite.fillColor, used in the Sprite render if no image is loaded (set via the property or Sprite.makeGraphic) (thanks JesseFreeman).
* Renamed Phaser.Finger to Phaser.Pointer.
* Updated all of the Input classes so they now use Input.pointers 1 through 10.
* Updated Touch and MSPointer to allow multi-touch support (when the hardware supports it) and created new tests to show this.
* Added Input.getPointer, Input.getPointerFromIdentifier, Input.totalActivePointers and Input.totalInactivePointers.
* Added Input.startPointer, Input.updatePointer and Input.stopPointer.
* Phaser Input now confirmed working on Windows Phone 8 (Nokia Lumia 920).
* Added Input.maxPointers to allow you to limit the number of fingers your game will listen for on multi-touch systems.
* Added Input.addPointer. By default Input will create 5 pointers (+1 for the mouse). Use addPointer() to add up to a maximum of 10.
* Added Input.position - a Vector2 object containing the most recent position of the most recently active Pointer.
* Added Input.getDistance. Find the distance between the two given Pointer objects.
* Added Input.getAngle. Find the angle between the two given Pointer objects.
* Pointer.totalTouches value keeps a running total of the number of times the Pointer has been pressed.
* Added Pointer.position and positionDown. positionDown is placed on touch and position is update on move, useful for tracking distance/direction/gestures.
* Added Game.state - now contains a reference to the current state object (if any was given).
* Moved the Input start events from the constructors to a single Input.start method.
* Added Input.disabled boolean to globally turn off all input event processing.
* Added Input.Mouse.disabled, Input.Touch.disabled, Input.MSPointer.disabled and Input.Keyboard.disabled.
* Added Device.mspointer boolean. true if MSPointer is available on the device.
* Added Input.onDown, onUp, onTap, onDoubleTap and onHold signals - all fired by the mouse or touch.
* Added Input.recordPointerHistory to record the x/y coordinates a Pointer tracks through. Also Input.recordRate and Input.recordLimit for fine control.
* Added Input.multiInputOverride which can be MOUSE_OVERRIDES_TOUCH, TOUCH_OVERRIDES_MOUSE or MOUSE_TOUCH_COMBINE.
* Added GameObject.setBoundsFromWorld to quickly set the bounds of a game object to match those of the current game world.
* Added GameObject.canvas and GameObject.context. By default they reference Stage.canvas but can be changed to anything, i.e. a DynamicTexture
* The new canvas and context references are applied to Sprite, GeomSprite and TilemapLayer
* Added DynamicTexture.assignCanvasToGameObjects() to allow you to redirect GameObject rendering en-mass to a DynamicTexture
* Added DynamicTexture.render(x,y) to render the texture to the Stage canvas
* Added Basic.ignoreGlobalUpdate - stops the object being updated as part of the main game loop, you'll need to call update on it yourself
* Added Basic.ignoreGlobalRender - stops the object being rendered as part of the main game loop, you'll need to call render on it yourself
* Added forceUpdate and forceRender parameters to Group.update and Group.render respectively. Combined with ignoreGlobal you can create custom rendering set-ups
* Fixed Loader.progress calculation so it now accurately passes a value between 0 and 100 to your loader callback
* Added a 'hard reset' parameter to Input.reset. A hard reset clears Input signals (such as on a state swap), a soft (such as on game pause) doesn't
* Added Device.isConsoleOpen() to check if the browser console is open. Tested on Firefox with Firebug and Chrome with DevTools
* Added delay parameter to Tween.to()
* Fixed bug where GeomSprite.renderOutline was being ignored for Circle objects
* Fixed bug with GeomSprite circles rendering at twice the size they should have been and offset from actual x/y values
* Added Sprite.cacheKey which stores the key of the item from the cache that was used for its texture (if any)
* Added GameMath.shuffleArray
* Updated Animation.frame to return the index of the currentFrame if set
* Added Quad.copyTo and Quad.copyFrom
* Removed the bakedRotations parameter from Emiter.makeParticles - update your code accordingly!
* Updated various classes to remove the Flixel left-over CamelCase parameters
* Updated QuadTree to use the new CollisionMask values and significantly optimised and reduced overall class size
* Updated Collision.seperate to use the new CollisionMask
* Added a callback context parameter to Game.collide, Collision.overlap and the QuadTree class
* Stage.canvas now calls preventDefault() when the context menu is activated (oncontextmenu)
* Added Point.rotate to allow you to rotate a point around another point, with optional distance clamping. Also created test cases.
* Added Group.alpha to apply a globalAlpha before the groups children are rendered. Useful to save on alpha calls.
* Added Group.globalCompositeOperation to apply a composite operation before all of the groups children are rendered.
* Added Camera black list support to Sprite and Group along with Camera.show, Camera.hide and Camera.isHidden methods to populate them. 
* Added GameMath.rotatePoint to allow for point rotation at any angle around a given anchor and distance
* Updated World.setSize() to optionally update the VerletManager dimensions as well
* Added GameObject.setPosition(x, y)
* Added Quad.intersectsRaw(left, right, top, bottom, tolerance)
* Updated Sprite.inCamera to correctly apply the scrollFactor to the camera bounds check
* Added Loader.crossOrigin property which is applied to loaded Images
* Added AnimationManager.destroy() to clear out all local references and objects
* Added the clearAnimations parameter to Sprite.loadGraphic(). Allows you to change animation textures but retain the frame data.
* Added the GameObjectFactory to Game. You now make Sprites like this: game.add.sprite(). Much better separation of game object creation methods now. But you'll have to update ALL code, sorry! (blame JesseFreeman for breaking your code and coming up with the idea :)
* Added GameObjectFactory methods to add existing objects to the game world, such as existingSprite(), existingTween(), etc.
* Added the GameObjectFactory to Phaser.State
* Added new format parameter to Loader.addTextureAtlas defining the format. Currently supported: JSON Array and Starling/Sparrow XML.

Version 0.9.5

* Moved the BootScreen and PauseScreen out of Stage into their own classes (system/screens/BootScreen and PauseScreen).
* Updated the PauseScreen to show a subtle animation effect, making it easier to create your own interesting pause screens.
* Modified Game so it splits into 3 loops - bootLoop, pauseLoop and loop (the core loop).
* Updated the BootScreen with the new logo and new color cycle effect.
* Added Game.isRunning - set to true once the Game.boot process is over IF you gave some functions to the constructor or a state.
* Fixed small bug in Signal.removeAll where it could try to shorten the _bindings even if undefined.
* Added the new FXManager which is used for handling all special effects on Cameras (and soon other game objects).
* Removed Flash, Fade and Shake from the Camera class and moved to the new SpecialFX project.
* SpecialFX compiles to phaser-fx.js in the build folder, which is copied over to Tests. If you don't need the FX, don't include the .js file.
* The project is now generating TypeScript declaration files and all Tests were updated to use them in their references.
* Fixed a bug in Flash, Fade and Shake where the duration would fail on anything above 3 seconds.
* Fixed a bug in Camera Shake that made it go a bit haywire, now shakes correctly.
* Added new Scanlines Camera FX.
* Fixed offset values being ignored in GeomSprite.renderPoint (thanks bapuna).
* Added new Mirror Camera FX. Can mirror the camera image horizontally, vertically or both with an optional fill color overlay.
* Added Camera.disableClipping for when you don't care about things being drawn outside the edge (useful for some FX).
* Updated TilemapLayer so that collision data is now stored in _tempTileBlock to avoid constant array creation during game loop.
* TilemapLayer.getTileOverlaps() now returns all tiles the object overlapped with rather than just a boolean.
* Tilemap.collide now optionally takes callback and context parameters which are used if collision occurs.
* Added Tilemap.collisionCallback and Tilemap.collisionCallbackContext so you can set them once and not re-set them on every call to collide.
* Collision.separateTile now has 2 extra parameters: separateX and separateY. If true the object will be separated on overlap, otherwise just the overlap boolean result is returned.
* Added Tile.separateX and Tile.separateY (both true by default). Set to false if you don't want a tile to stop an object from moving, you just want it to return collision data to your callback.
* Added Tilemap.getTileByIndex(value) to access a specific type of tile, rather than by its map index.
* Added TilemapLayer.putTile(x,y,index) - allows you to insert new tile data into the map layer (create your own tile editor!).
* TilemapLayer.getTileBlock now returns a unique Array of map data, not just a reference to the temporary block array
* Added TilemapLayer.swapTile - scans the given region of the map for all instances of tileA and swaps them for tileB, and vice versa.
* Added TilemapLayer.replaceTile - scans the given region of the map and replaces all instances of tileA with tileB. tileB is left unaffected.
* Added TilemapLayer.fillTiles - fills the given region of the map with the tile specified.
* Added TilemapLayer.randomiseTiles - fills the given region of the map with a random tile from the list specified.
* Added fun new "map draw" test - rebound those carrots! :)
* Changed SoundManager class to respect volume on first play (thanks initials and hackmaniac)

Version 0.9.4

* Added Tilemap.getTile, getTileFromWorldXY, getTileFromInputXY
* Added Tilemap.setCollisionByIndex and setCollisionByRange
* Added GameObject.renderRotation boolean to control if the sprite will visually rotate or not (useful when angle needs to change but graphics don't)
* Added additional check to Camera.width/height so you cannot set them larger than the Stage size
* Added Collision.separateTile and Tilemap.collide
* Fixed Tilemap bounds check if map was smaller than game dimensions
* Fixed: Made World._cameras public, World.cameras and turned Game.camera into a getter for it (thanks Hackmaniac)
* Fixed: Circle.isEmpty properly checks diameter (thanks bapuna)
* Updated Gruntfile to export new version of phaser.js wrapped in a UMD block for require.js/commonJS (thanks Hackmaniac)

V0.9.3

* Added the new ScrollZone game object. Endlessly useful but especially for scrolling backdrops. Created 6 example tests.
* Added GameObject.hideFromCamera(cameraID) to stop an object rendering to specific cameras (also showToCamera and clearCameraList)
* Added GameObject.setBounds() to confine a game object to a specific area within the world (useful for stopping them going off the edges)
* Added GameObject.outOfBoundsAction, can be either OUT OF BOUNDS STOP which stops the object moving, or OUT OF BOUNDS KILL which kills it.
* Added GameObject.rotationOffset. Useful if your graphics need to rotate but weren't drawn facing zero degrees (to the right).
* Added shiftSinTable and shiftCosTable to the GameMath class to allow for quick iteration through the data tables.
* Added more robust frame checking into AnimationManager
* Re-built Tilemap handling from scratch to allow for proper layered maps (as exported from Tiled / Mappy)
* Tilemap no longer requires a buffer per Camera (in prep for WebGL support)
* Fixed issues with Group not adding reference to Game to newly created objects (thanks JesseFreeman)
* Fixed a potential race condition issue in Game.boot (thanks Hackmaniac)
* Fixed issue with showing frame zero of a texture atlas before the animation started playing (thanks JesseFreeman)
* Fixed a bug where Camera.visible = false would still render
* Removed the need for DynamicTextures to require a key property and updated test cases.
* You can now pass an array or a single value to Input.Keyboard.addKeyCapture().

Version 0.9.2

* Fixed issue with create not being called if there was an empty init method.
* Added ability to flip a sprite (Sprite.flipped = true) + a test case for it.
* Added ability to restart a sprite animation.
* Sprite animations don't restart if you call play on them when they are already running.
* Added Stage.disablePauseScreen. Set to true to stop your game pausing when the tab loses focus.

Version 0.9.1

* Added the new align property to GameObjects that controls placement when rendering.
* Added an align example to the Sprites test group (click the mouse to change alignment position)
* Added a new MicroPoint class. Same as Point but much smaller / less functions, updated GameObject to use it.
* Completely rebuilt the Rectangle class to use MicroPoints and store the values of the 9 points around the edges, to be used
for new collision system.
* Game.Input now has 2 signals you can subscribe to for down/up events, see the Sprite align example for use.
* Updated the States examples to bring in-line with 0.9 release.

Version 0.9

* Large refactoring. Everything now lives inside the Phaser module, so all code and all tests have been updated to reflect this. Makes coding a tiny bit more verbose but stops the framework from globbing up the global namespace. Also should make code-insight work in WebStorm and similar editors.
* Added the new GeomSprite object. This is a sprite that uses a geometry class for display (Circle, Rectangle, Point, Line). It's extremely flexible!
* Added Geometry intersection results objects.
* Added new Collision class and moved some functions there. Contains all the Game Object and Geometry Intersection methods.
* Can now create a sprite animation based on frame names rather than indexes. Useful when you've an animation inside a texture atlas. Added test to show.
* Added addKeyCapture(), removeKeyCapture() and clearCaptures() to Input.Keyboard. Calls event.preventDefault() on any keycode set to capture, allowing you to avoid page scrolling when using the cursor keys in a game for example.
* Added new Motion class which contains lots of handy functions like 'moveTowardsObject', 'velocityFromAngle' and more.
* Tween Manager added. You can now create tweens via Game.createTween (or for more control game.tweens). All the usual suspects are here: Bounce, * Elastic, Quintic, etc and it's hooked into the core game clock, so if your game pauses and resumes your tweens adjust accordingly.

Version 0.8

* Added ability to set Sprite frame by name (sprite.frameName), useful when you've loaded a Texture Atlas with filename values set rather than using frame indexes.
* Updated texture atlas 4 demo to show this.
* Fixed a bug that would cause a run-time error if you tried to create a sprite using an invalid texture key.
* Added in DynamicTexture support and a test case for it.

Version 0.7

* Renamed FullScreen to StageScaleMode as it's much more fitting. Tested across Android and iOS with the various scale modes.
* Added in world x/y coordinates to the input class, and the ability to get world x/y input coordinates from any Camera.
* Added the RandomDataGenerator for seeded random number generation.
* Setting the game world size now resizes the default camera (optional bool flag)

Version 0.6

* Added in Touch support for mobile devices (and desktops that enable it) and populated x/y coords in Input with common values from touch and mouse.
* Added new Circle geometry class (used by Touch) and moved them into a Geom folder.
* Added in Device class for device inspection.
* Added FullScreen class to enable full-screen support on mobile devices (scrolls URL bar out of the way on iOS and Android)

Version 0.5

* Initial release
