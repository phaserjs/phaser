Phaser
======

Version: 1.0.0 - Released: In Progress

By Richard Davey, [Photon Storm](http://www.photonstorm.com)

Phaser is a 2D JavaScript/TypeScript HTML5 Game Framework based heavily on [Flixel](http://www.flixel.org).

Follow on [Twitter](https://twitter.com/photonstorm)<br />
Read the [Development Blog](http://www.photonstorm.com)<br />
Join the [Support Forum](http://www.html5gamedevs.com/forum/14-phaser/)

Try out the [Phaser Test Suite](http://gametest.mobi/phaser/)

![Blasteroids](http://www.photonstorm.com/wp-content/uploads/2013/04/phaser_blaster.png)

"Being negative is not how we make progress" - Larry Page, Google

Latest Update
-------------

TODO:

* Dispatch world resize event
* Investigate why tweens don't restart after the game pauses
* Fix bug in Tween yoyo + loop combo
* Apply Sprite scaling to Body.bounds
* Check that tween pausing works with the new performance.now
* Game.Time should monitor pause duration
* Investigate bug re: tilemap collision and animation frames
* Update tests that use arrow keys and include touch/mouse support (FlxControlHandler style)
* Texture Repeat doesn't scroll, because it's part of the camera not the world, need to think about this more
* Stage CSS3 transforms!!! Color tints, sepia, greyscale, all of those cool things :)
* Add JSON Texture Atlas object support.
* Pointer.getWorldX(camera) needs to take camera scale into consideration
* If stage.clear set to false and game pauses, when it unpauses you still see the pause arrow - resolve this
* Add clip support + shape options to Texture Component.
* Make sure I'm using Point and not Vec2 when it's not a directional vector I need
* Bug with setting scale or anything on a Sprite inside a Group, or maybe group.addNewSprite issue
* Drag Sprite with "snap to center" uses local coords not world, so fails on scrolling world (no center lock works fine)
* Need to be able to set the current tilemap layer, then the getTileXY default layer uses that one if no other given
* Pointer worldX/Y don't appear to be correct for some reason
* Create a Pixel game object type (useful for particles / fx)
* Sprite collision events
* See which functions in the input component can move elsewhere (utils)
* Move all of the renderDebugInfo methods to the DebugUtils class
* Check bounds/edge points when sprite is only 1x1 sized :)
* See what I can move out of Body and into a BodyUtils class.
* See about optimising Advanced Physics a lot more, so it doesn't create lots of Vec2s everywhere.
* QuadTree.physics.checkHullIntersection
* Fix the Motion methods for the new physics system
* Move findShapeByPoint etc from Space to Manager (or at least add a proxy to them)
* Add visible toggle if tween property is alpha <> 01
* Camera.isHidden uses an array and length check, faster to swap for a single counter, also try to remove indexOf check
* Tilemap.render - move layers length to var
* Camera control method (touch/keyboard)
* Tilemap.destroy needs doing
* Look at the input targetObject - it doesn't seem to get cleared down all the time, maybe just a priority/alpha issue (check vis/alpha?)
* Sprite.transform.bottomRight/Left doesn't seem to take origin into account
* When you toggle visible of a button that is over, it doesn't disable that 'over' state (should it? probably yes)
* Stage.opaqueBackground = 'rgb()' or null, alpha, blendMode, filters, mask, rotation+XYZ,scaleXYZ,visible

* Need a way for Input event to redirect to audio to unlock playback
* AudioSprite object?
* How to get web audio to playback from an offset
* Stage lost to mute



V1.0.0

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



V0.9.6

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

Requirements
------------

Games created with Phaser require a modern web browser that supports the canvas tag. This includes Internet Explorer 9+, Firefox, Chrome, Safari and Opera. It also works on mobile web browsers including stock Android 2.x browser and above and iOS5 Mobile Safari and above.

For developing with Phaser you can use either a plain-vanilla JavaScript approach or [TypeScript](https://typescript.codeplex.com/). We made no assumptions about how you like to code your games, and were careful not to impose any form of class/inheritance/structure upon you.

If you are compiling via TypeScript from the command-line please use `--target ES5`

If you need it the included Grunt file will generate a RequireJS/CommonJS version of Phaser on build.

Phaser is just 45KB gzipped and minified.

Features
--------

Phaser was born from a cross-pollination of the AS3 Flixel game library and our own internal HTML5 game framework. The objective was to allow you to make games _really_ quickly and remove some of the speed barriers HTML5 puts in your way.

Phaser fully or partially supports the following features. This list is growing constantly and we are aware there are still a number of essential features missing:

*	Asset Loading<br />

	Images, Sprite Sheets, Texture Packer Data, JSON, Text Files, Audio File.

*	Cameras<br />

	Multiple world cameras, camera scale, zoom, rotation, deadzones and Sprite following.

*	Sprites<br />

	All sprites have physics properties including velocity, acceleration, bounce and drag.
	ScrollFactor allows them to re-act to cameras at different rates.

*	Groups<br />

	Group sprites together for collision checks, visibility toggling and function iteration.

*	Animation<br />

	Sprites can be animated by a sprite sheet or Texture Atlas (JSON Array format supported).
	Animation playback controls, looping, fps based timer and custom frames.

*	Scroll Zones<br />

	Scroll any image seamlessly in any direction. Or create multiple scrolling regions within an image.

*	Collision<br />

	A QuadTree based Sprite to Sprite, Sprite to Group or Group to Group collision system.

*	Particles<br />

	An Emitter can emit Sprites in a burst or at a constant rate, setting physics properties.

*	Input<br />

	Keyboard, Mouse and Touch handling supported (MSPointer events coming soon)

*	Stage<br />

	Easily change properties about your game via the stage, such as background color, position, size and scale.

*	World<br />

	The game world can be any size and Sprites and collision happens within it.

*	Sound<br />

	Currently uses WebAudio for playback. A lot more work needs to be done in this area.

*	State Management<br />

	For larger games it's useful to break your game down into States, i.e. MainMenu, Level1, GameOver, etc.
	The state manager makes swapping states easy, but the use of a state is completely optional.

*	Cache<br />

	All loaded resources are stored in an easy to access cache, which can be cleared between State changes
	or persist through-out the whole game.

*	Tilemaps<br />

	Support for CSV and Tiled JSON format tile maps. Supports Layered Tiled maps and layer based collision.

*	Game Scaling<br />

	Game scaling under your control. Removes URL/status bar on mobile (iOS and Android) and allows proportional scaling, fixed size and orientation checks.

![Phaser Particles](http://www.photonstorm.com/wp-content/uploads/2013/04/phaser_particles.png)

Work in Progress
----------------

We've a number of features that we know Phaser is lacking, here is our current priority list:

*	Better sound controls
*	Text Rendering
*	Buttons
*	Google Play Game Services

Beyond this there are lots of other things we plan to add such as WebGL support, Spine animation format support, sloped collision tiles, path finding and support for custom plugins. But the list above are priority items, and by no means exhaustive either! However we do feel that the core structure of Phaser is now tightly locked down, so safe to use for small scale production games.

Test Suite
----------

Phaser comes with an ever growing Test Suite. Personally we learn better by looking at small refined code examples, so we create lots of them to test each new feature we add. Inside the Tests folder you'll find the current set. If you write a particularly good test then please send it to us.

The tests need running through a local web server (to avoid file access permission errors from your browser).

Make sure you can browse to the Tests folder via your web server. If you've got php installed then launch:

    Tests/index.php

Right now the Test Suite requires PHP, but we will remove this requirement soon.

You can also browse the [Phaser Test Suite](http://gametest.mobi/phaser/) online.

Contributing
------------

Phaser is in early stages and although we've still got a lot to add to it, we wanted to just get it out there and share it with the world.

If you find a bug (highly likely!) then please report it on github.

If you have a feature request, or have written a small game or demo that shows Phaser in use, then please get in touch. We'd love to hear from you.

You can do this on the Phaser board that is part of the [HTML5 Game Devs forum](http://www.html5gamedevs.com/forum/14-phaser/) or email: rich@photonstorm.com

Bugs?
-----

Please add them to the [Issue Tracker][1] with as much info as possible.

![Phaser Tilemap](http://www.photonstorm.com/wp-content/uploads/2013/04/phaser_tilemap.png)

Change Log
----------

V0.9.5

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

V0.9.4

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

V0.9.2

* Fixed issue with create not being called if there was an empty init method.
* Added ability to flip a sprite (Sprite.flipped = true) + a test case for it.
* Added ability to restart a sprite animation.
* Sprite animations don't restart if you call play on them when they are already running.
* Added Stage.disablePauseScreen. Set to true to stop your game pausing when the tab loses focus.

V0.9.1

* Added the new align property to GameObjects that controls placement when rendering.
* Added an align example to the Sprites test group (click the mouse to change alignment position)
* Added a new MicroPoint class. Same as Point but much smaller / less functions, updated GameObject to use it.
* Completely rebuilt the Rectangle class to use MicroPoints and store the values of the 9 points around the edges, to be used
for new collision system.
* Game.Input now has 2 signals you can subscribe to for down/up events, see the Sprite align example for use.
* Updated the States examples to bring in-line with 0.9 release.

V0.9

* Large refactoring. Everything now lives inside the Phaser module, so all code and all tests have been updated to reflect this. Makes coding a tiny bit more verbose but stops the framework from globbing up the global namespace. Also should make code-insight work in WebStorm and similar editors.
* Added the new GeomSprite object. This is a sprite that uses a geometry class for display (Circle, Rectangle, Point, Line). It's extremely flexible!
* Added Geometry intersection results objects.
* Added new Collision class and moved some functions there. Contains all the Game Object and Geometry Intersection methods.
* Can now create a sprite animation based on frame names rather than indexes. Useful when you've an animation inside a texture atlas. Added test to show.
* Added addKeyCapture(), removeKeyCapture() and clearCaptures() to Input.Keyboard. Calls event.preventDefault() on any keycode set to capture, allowing you to avoid page scrolling when using the cursor keys in a game for example.
* Added new Motion class which contains lots of handy functions like 'moveTowardsObject', 'velocityFromAngle' and more.
* Tween Manager added. You can now create tweens via Game.createTween (or for more control game.tweens). All the usual suspects are here: Bounce, * Elastic, Quintic, etc and it's hooked into the core game clock, so if your game pauses and resumes your tweens adjust accordingly.

V0.8

* Added ability to set Sprite frame by name (sprite.frameName), useful when you've loaded a Texture Atlas with filename values set rather than using frame indexes.
* Updated texture atlas 4 demo to show this.
* Fixed a bug that would cause a run-time error if you tried to create a sprite using an invalid texture key.
* Added in DynamicTexture support and a test case for it.

V0.7

* Renamed FullScreen to StageScaleMode as it's much more fitting. Tested across Android and iOS with the various scale modes.
* Added in world x/y coordinates to the input class, and the ability to get world x/y input coordinates from any Camera.
* Added the RandomDataGenerator for seeded random number generation.
* Setting the game world size now resizes the default camera (optional bool flag)

V0.6

* Added in Touch support for mobile devices (and desktops that enable it) and populated x/y coords in Input with common values from touch and mouse.
* Added new Circle geometry class (used by Touch) and moved them into a Geom folder.
* Added in Device class for device inspection.
* Added FullScreen class to enable full-screen support on mobile devices (scrolls URL bar out of the way on iOS and Android)

V0.5

* Initial release

![Phaser Cameras](http://www.photonstorm.com/wp-content/uploads/2013/04/phaser_cams.png)

License
-------

Copyright 2013 Richard Davey, Photon Storm Ltd. All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are
permitted provided that the following conditions are met:

   1. Redistributions of source code must retain the above copyright notice, this list of
      conditions and the following disclaimer.

   2. Redistributions in binary form must reproduce the above copyright notice, this list
      of conditions and the following disclaimer in the documentation and/or other materials
      provided with the distribution.

THIS SOFTWARE IS PROVIDED BY RICHARD DAVEY ``AS IS'' AND ANY EXPRESS OR IMPLIED
WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL RICHARD DAVEY OR
CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF
ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

The views and conclusions contained in the software and documentation are those of the
authors and should not be interpreted as representing official policies, either expressed

[1]: https://github.com/photonstorm/phaser/issues
[phaser]: https://github.com/photonstorm/phaser
