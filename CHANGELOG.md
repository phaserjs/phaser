# Change Log

There is an extensive [Migration Guide](https://github.com/photonstorm/phaser/blob/master/resources/Migration%20Guide.md) available for those converting from Phaser 1.x to 2.x. In the guide we detail the API breaking changes and approach to our new physics system.

## Version 2.0.7 - "Amadicia" - 18th July 2014

### Updates

* Updated to Pixi.js 1.6.1 which fixes various issues such as IE9 Float32 defs and RenderTexture resizing and rendering.
* TypeScript definitions fixes and updates (thanks @clark-stevenson and @alvinsight)
* GameObjectFactory.spriteBatch now lets you specify `null` as a parameter for the parent and automatically adds the batch to `game.world` as a result. Also fixed jsdocs issues (@petarov #1000)
* Rebuilt the way items are polled for Pointer events (drag, click, move). Now faster and more efficient, especially when some items in the stack require pixel perfect checks.
* InputHandler.checkPointerOver now has a new `fastTest` parameter that forces a skips a pixel perfect check even if enabled.
* InputHandler.checkPointerDown now has a new `fastTest` parameter that forces a skips a pixel perfect check even if enabled.
* The key is now reported when failing to parse a Sprite Sheet (thanks @lucbloom #1026)
* An editorconfig has been added to the core repo. See http://editorconfig.org (thanks @codevinksy #1027)
* Keyboard.processKeyPress now checks if the Keyboard Input handler is disabled or not before processing the key callbacks.
* Physics.bounds now correctly matches World.bounds on system start (thanks @Dumtard #1028)
* Game._codePaused is now set if the Game is manually paused. See discussion: http://www.html5gamedevs.com/topic/6719-codepaused-property/ (thanks @devinb83 #1017)

### New Features

* ArrayList.setAll - sets the property to the given value on all members of the list.
* Sprite.loadTexture has a new optional `stopAnimation` boolean parameter which will halt the currently running animation (if any) after changing the texture (based on #1029).
* Animation.updateFrameData allows you to load a new FrameData object into an existing animation, even if currently running (based on #1029)
* AnimationManager.loadFrameData will now update all existing Animations to use the newly loaded FrameData (based on #1029)
* Sprite.loadTexture will store the `smoothed` property of the Sprite and re-apply it once the new texture is loaded.
* Group.checkAll allows you to check if the same property exists across all children of the Group and is set to the given value (thanks @codevinsky #1013)
* Group.checkProperty allows you to check if the property exists on the given child of the Group and is set to the value specified (thanks @codevinsky #1013)
* Phaser.Utils.setProperty will set an Objects property regardless of depth (thanks @codevinsky #1013)
* Phaser.Utils.setProperty will set an Objects property regardless of depth (thanks @codevinsky #1013)
* Phaser.Utils.getProperty will get an Objects property regardless of depth (thanks @codevinsky #1013)

### Bug Fixes

* Fixed pixel perfect dragging (thanks @jeroenverfallie #996)
* Debug.preUpdate was still being called in the Game Loop even if enableDebug was set to false (thanks @qdrj #995)
* Phaser.Physics.P2.Body.addPolygon didn't work with a flat array of numbers for the coordinates (thanks @petarov, fix #883)
* Added missing Loader.onPackComplete Signal (thanks @mjeffery #1007)
* QuadTree leveling - Rather than level++ which changes the current nodes level, the subnodes should get the current nodes level+1 (thanks @devinb83 #1018)
* Prevented objects with pixel perfect checks from over-riding other higher priority ID items (#983)
* Group.create was not creating with p2 debug flag (thanks @Dumtard #1014)
* World.wrap when using the bounds of the object wouldn't adjust the bounds correctly, meaning wrapping outside the camera failed (thanks @jackrugile #1020)
* Pixi updated worldTransform from an Array to an Object and Phaser Image, BitmapText, Text and Graphics were still using array access to populate the world property, giving it incorrect results (thanks @alvinsight)
* If you add a Tween to the TweenManager and then immediately stop it, it will still exist in the TweenManager (thanks @gilangcp #1032)
* AnimationManager does not update currentFrame on play until second frame (thanks @Dumtard #1041)
* Animation now guards against _frameData being null (thanks @lucbloom #1033)
* Tilemap.swap now accurately swaps from A to B and from B to A (thanks @noidexe #1034)
* BitmapData.resize fixed to update the crop property too, resolves issues with images getting cut off with BitmapData.load.
* OrientationSprite fix as it's not using PIXI.TextureCache anymore (thanks @DarkDev- #1036)

## Version 2.0.6 - "Jornhill" - 10th July 2014

### Significant Internal Changes

* The PIXI.TextureCache global array is no longer used internally for storing Pixi Texture files. It's not actually a requirement of Pixi to use this and we were running into various issues with texture conflicts in DragonBones tests and issues with shared texture frames between Sprites. It meant we couldn't crop a sprite without cropping all instances unless we created a new texture frame at run-time, which as you can imagine is a huge overhead if you then want to crop an animated Sprite.
 
After talking with Mat at GoodBoyDigital about the issue it was his idea to just not use the TextureCache at all, and let each Sprite have its own frame. So this is the direction we've taken. We didn't save this for the 2.1 release as it doesn't actually alter the Phaser API at all, but it does change how things are working internally. So if you've got game code hooked directly into the `TextureCache` you need to be aware of this change before updating to 2.0.6.

* The way in which Sprite.crop works has been changed. It will now adjust the dimensions of the sprite itself, remaining at the sprites previous x/y coordinates. Please be aware of this if you use cropped sprites in your game. The change was worth it though as it's significantly more powerful as a result.

### Updates

* Merged Pixi 1.6.0 with Phaser - all of the lovely new Pixi features are in, like complex Graphics objects and masking.
* TypeScript definitions fixes and updates (thanks @clark-stevenson and @Phaiax)
* Documentation fixes (thanks @kay-is #941)
* BitmapData.draw can now also take a Phaser.Sprite, Phaser.Image or BitmapData object as a source type. As a result BitmapData.drawSprite is now depcreated.
* BitmapData.alphaMask can now also take a Phaser.Sprite, Phaser.Image or BitmapData object as a source type.
* BitmapData.alphaMask has 2 new optional parameters: sourceRect and maskRect to give more fine-grained control over where the source and mask are drawn and their size
* BitmapData.alphaMask 'mask' parameter is now optional, if not given it will use itself as the mask.
* BitmapData.alphaMask now calls BitmapData.update after running.
* BitmapData.draw now has two optional parameters: width and height, to let you stretch the image being drawn if needed.
* Group.destroy now removes any set filters (thanks @Jmaharman fix #844)
* RetroFont charsPerRow paramters is now optional. If not given it will take the image width and divide it by the characterWidth value.
* RetroFont now uses Phaser.scaleModes.NEAREST by default for its RenderTexture to preserve scaling.
* Loader.tilemap has renamed the `mapURL` parameter to `url` and `mapData` to `data` to keep it consistent with the other Loader methods.
* Loader.physics has renamed the `dataURL` parameter to `url` and `jsonData` to `data` to keep it consistent with the other Loader methods.
* Stage no longer creates the Phaser.Canvas object, but Game itself does in the setupRenderer method.
* Canvas.create has deprecated the noCocoon parameter as it's no longer required. The parameter is still in the signature, but no longer used in the method.
* Time.add allows you to add an existing Phaser.Timer to the timer pool (request #864)
* Emitter.start has a new parameter: forceQuantity which will force the quantity of a flow of particles to be the given value (request #853)
* Sound.pause will no longer fire a Sound.onStop signal, and the pause values are set before the onPause signal is dispatched (thanks @AnderbergE, fix #868)
* Swapped to using escaped Unicode characters for the console output.
* Frame.setTrim no longer modifies the Frame width and height values.
* AnimationParser doesn't populate the Pixi.TextureCache for every frame any longer. Each display object has its own texture property instead.
* Removed the cacheKey parameters from the AnimationParser methods as they're no longer used.
* Loader.isLoading is set to false if the filelist size is zero.
* Sound.externalNode has had the `input` property dropped from it, bringing it back in line with the AudioNode spec (thanks @villetou, #840)
* The StateManager has a preRenderCallback option, which checks for a preRender function existing on the State, but it was never called. Have decided to add this in, so the core Game loop now calls state.preRender right before the renderer runs (thanks @AnderbergE #869)
* Game.onBlur and Game.onFocus events are now dispatched regardless if Stage.disableVisibilityChange is true or false, so you can respond to these events without your game automatically pausing or resuming (#911)
* Image has been heavily refactored to make use of common code in Phaser.Sprite, cutting the file size down significantly.
* When using the non-minified version of Phaser it will throw a console.warn if you give an invalid texture key to a Sprite, Image or TileSprite (thanks @lucbloom, #990)

### CocoonJS Specific Updates

* Wrapped all touch, keyboard, mouse and fullscreen events that CocoonJS doesn't support in conditional checks to avoid Warnings.
* The SoundManager no longer requires a touch to unlock it, defaults to unlocked.
* Resolved issue where Cocoon won't render a scene in Canvas mode if there is only one Sprite/Image on it.

### New Features

* BitmapData.extract has a new parameter that lets you control if the destination BitmapData is resized before the pixels are copied.
* BitmapData.extract has 4 new parameters: r2, g2, b2, a2 which let you re-color the extract pixels as they are drawn to the new BitmapData.
* BitmapData.load will take a game object or string and resize the BitmapData to match it and then draw the pixels in.
* Keyboard.addCallbacks now has a new parameter for keypress event capture.
* Keyboard.pressEvent stores the most recent DOM keypress event.
* Keyboard.processKeyDown now runs the callback after all the objects have been created and/or updated.
* Keyboard.processKeyUp now runs the callback after all the objects have been created and/or updated.
* Phaser.Keyboard.lastChar will return the string value of the last key pressed.
* Phaser.Keyboard.lastKey will return the most recently pressed Key object.
* RetroFont.updateOffset allows you to modify the offsetX/Y values used by the font during rendering.
* ArcadePhysics.Body has a new boolean property `enable`. If `false` the body won't be checked for any collision or overlaps, or have its pre or post update methods called. Use this for easy toggling of physics bodies without having to destroy or re-create the Body object itself.
* BitmapData.addToWorld will create a new Phaser.Image object, assign the BitmapData to be its texture, add it to the world then return it.
* BitmapData.copyPixels now accepts a Sprite, Image, BitmapData, HTMLImage or string as its source.
* Loader.pack will allow you to load in a new Phaser Asset Pack JSON file. An Asset Pack is a specially structured file that allows you to define all assets for your game in an external file. The file can be split into sections, allowing you to control loading a specific set of files from it. An example JSON file can be found in the `resources\Asset Pack JSON Format` folder and examples of use in the Phaser Examples repository.
* Loader.totalQueuedPacks returns the number of Asset Packs in the queue.
* Loader.totalLoadedPacks returns the number of Asset Packs already loaded.
* Emitter.explode is a new short-cut for exploding a fixed quantity of particles at once.
* Emitter.flow is a new short-cut for creating a flow of particles based on the given frequency.
* Sprite.crop (and Image.crop) has been completely overhauled. You can now crop animated sprites (sprite sheet and texture atlas), you can define the x/y crop offset and the crop rectangle is exposed in the Sprite.cropRect property.
* Sprite.updateCrop is available if you wish to update an externally referenced crop rectangle.
* Sprites and Images now have their own textures objects, they are no longer references to those stored in the global Pixi.TextureCache. This allows you to redefine the texture frame dynamically without messing up any other Sprites in your game, such as via cropping. They still share global Base Textures, so image references are kept to a minimum.
* Sprite.resetFrame will revert the Sprites texture frame back to its defaults dimensions. This is called when you call Sprite.crop with no rectangle, to reset the crop effect, but can be userful in other situations so we've left it as a public method.
* TilemapLayers can now be used with an unbounded camera (a camera that can move beyond the world boundaries). Currently, when an unbounded camera moves outside of the world, tilemaps start acting weird because they only render themselves strictly within the world limits. With this change, the tilemap will continue scrolling and show empty space beyond its edge (thanks @jotson #851)
* TilemapLayer.wrap property - if true the map is rendered as if it is on the surface of a toroid (donut) instead of a plane. This allows for games that seamlessly scroll from one edge to the opposite edge of the world without noticing the transition. Note that the World size must match the Map size (thanks @jotson #851)
* Added PlayStation 3 controller button mappings to Phaser.Gamepad (thanks @wayfu)
* GamepadButton.destroy method added. Called automatically by SinglePad when a controller is disconnected.
* Added Math.factorial (thanks @alvinsight, #940)
* Full Mouse Wheel support added, with new constants and callbacks for mouse wheel movement (thanks @woutercommandeur, #959)
* A Phaser version of the Pixi PixelateFilter was added by @paperkettle #939)
* TileMap.setPreventRecalculate allows you to turn on / off the recalculation of tile faces for tile collision, which is handy when modifying large portions of a map to avoid slow-down (thanks @sivael, #951)
* Group.add has a new optional boolean parameter: `silent`. If set to `true` the child will not dispatch its `onAddedToGroup` event.
* Group.addAt has a new optional boolean parameter: `silent`. If set to `true` the child will not dispatch its `onAddedToGroup` event.
* Group.remove has a new optional boolean parameter: `silent`. If set to `true` the child will not dispatch its `onRemovedFromGroup` event.
* Group.removeBetween has a new optional boolean parameter: `silent`. If set to `true` the children will not dispatch their `onRemovedFromGroup` events.
* Group.removeAll has a new optional boolean parameter: `silent`. If set to `true` the children will not dispatch their `onRemovedFromGroup` events.
* Internal child movements in Group (such as bringToTop) now uses the new `silent` parameter to avoid the child emitting incorrect Group addition and deletion events.
* Camera.updateTarget has had a make-over and now is a lot smoother under certain conditions (thanks @tjkopena, fix #966)
* Signal.removeAll now has a new `context` parameter. If specified only listeners matching the given context are removed (thanks @lucbloom for the idea, #880)
* Animation.next will advance to the next frame in the animation, even if it's not currently playing. You can optionally define the number of frames to advance, but the default is 1. This is also aliased from the AnimationManager, so you can do `Sprite.animations.next()`.
* Animation.previous will rewind to the previous frame in the animation, even if it's not currently playing. You can optionally define the number of frames to rewind, but the default is 1. This is also aliased from the AnimationManager, so you can do `Sprite.animations.previous()`.
* You can now debug render Ninja Physics AABB and Circle objects (thanks @psalaets, #972)
* Phaser.Utils.mixin will mix the source object into the destination object, returning the newly modified destination object.
* You can now use `game.add.plugin` from the GameObjectFactory (thanks @alvinsight, #978)
* Color.getWebRGB will now accept either an Object or numeric color value.
* Rectangle.randomX will return a random value located within the horizontal bounds of the Rectangle.
* Rectangle.randomY will return a random value located within the vertical bounds of the Rectangle.
* Using a Game configuration object you can now specify the value of the  `preserveDrawingBuffer` flag for the WebGL renderer. By default this is disabled for performance reasons. But if you need to be able to take screen shots of your WebGL games using toDataUrl on the game canvas then you'll need to set this to `true` (#987)
* Added options to disable horizontal and vertical world wrapping individually (thanks @jackrugile, #988)
* You can now prevent the Debug class from being created or booted by using the Game configuration setting: `enableDebug`. By default it is `true`, set to `false` to prevent the class from being created. Please note you are responsible for checking if this class exists before calling it, but you can do that via `if (game.debug) { ... }` (request #984)

### Bug Fixes

* Sprite.alive property now explicitly defined on the Sprite prototype (thanks @lewster32, #841)
* BitmapData.resize now properly updates the baseTexture and texture dimensions.
* Fixed Gamepad issue that incorrectly checked non-webkit prefix gamepads.
* Phaser.RenderTexture incorrectly passed the scaleMode to Pixi.RenderTexture, causing the renderer to error.
* Sprite animation data wasn't reset when going from a sprite sheet to a single frame in Sprite.loadTexture (thanks @lucbloom, fix #850)
* Timer.ms would report the game time ms value if the Timer hadn't yet been started, instead of 0.
* Timer.seconds would report the game time value if the Timer hadn't yet been started, instead of 0.
* A Canvas style set from a game config object used an incorrect property (thanks @TatumCreative, fix #861)
* Phaser.Line.intersectsPoints fixed for floating point inaccuracy (thanks @woutercommandeur, fix #865 and #937)
* Sound.destroy(true) would call remove on the SoundManager, which in turn would throw a TypeError as it tried to remove the sound events twice (thanks @AnderbergE, fix #874)
* When creating a Sprite or Image using a texture atlas it would set the frame twice, once in loadTexture and once when the initial frame is set. This has been reduced down to just a single setting now.
* BitmapData.getPixel fix for pixels with zero red value (thanks @lstor fix #894)
* If you call ArcadePhysics.collide on a Sprite vs. a Tilemap and provide a custom processCallback, the result was being ignored and the sprite was being separated regardless (thanks @aivins fix #891 #890)
* ArcadePhysics.Body.setSize if you set offset x/y values previously and then passed zero values they would be ignored (thanks @casensiom fix #889)
* InputHandler.checkPointerDown checks and docs updated (thanks @lewster32, fix method #936)
* Body.enable only exists in Arcade physics, so moved conditions concerning checking that into the Body (thanks @Phaiax, fix #961)
* Forces packPixel result into a uint32 (thanks @Phaiax, fix #960)
* The Bottom Wall in non 0,0 aligned P2 world was incorrectly set (thanks @Phaiax, fix #952)
* AnimationManager could sometimes return null (thanks @TatumCreative, #910)
* P2.Body.removeShape didn't call shapeChanged (thanks @TatumCreative, #910)
* Sound.onDecoded signal was never dispatched (thanks @j0hnskot, #906)
* stopFullScreen has been changed to run against document instead of the canvas since the cancelFullScreen method is created on the document (thanks @j0hnskot, #863)
* Calling reset on Sprite with a P2 body can result in body.data.world == null.
Calling addToWorld() would previously not check the _toRemove array, which could, if the timing were right, result in a Sprite being revived but then removed from the P2 World -- the result of this being the Sprites data would be in a mixed state causing it to appear visually but not function in the world (thanks @jonkelling, fix #917 #925)
* Input.SinglePad was fixed so that the rawpad button array supports Windows and Linux (thank @renatodarrigo, fix #958)
* Key.duration wasn't set to zero after a Key.reset (thanks @DrHackenstein, #932)
* Device.mobileSafari was no longer detecting Mobile Safari, now fixed (thanks @Zammy, #927)
* Rectangle.right when set would set the new width to be Rectangle.x + the value given. However the value given should be a new Right coordinate, so the width calculation has been adjusted to compensate (thanks @cryptonomicon, #849)
* Calling Tween.stop from inside a Tween update callback would still cause the tween onComplete event to fire (thanks @eguneys, #924)
* Group.bringToTop (and consequently Sprite.bringToTop) no longer removes the child from the InputManager if enabled (thanks @BinaryMoon, fix #928)
* Group.sendToBack (and consequently Sprite.sendToBack) no longer removes the child from the InputManager if enabled.
* When adding a new Animation to a Sprite it would incorrectly reset the current Sprite frame to the first frame of the animation sequence, it is now left un-touched until you call `play` on the animation.
* Tween.from now returns a reference to the tweened object in the same way that Tween.to does (thanks @b-ely, fix #976)
* Re-ordered the parameters of Phaser.Physics.Arcade.Body.render which is used by Debug.body so it matches correctly (thanks @psalaets, #971 #970)
* Removed hasOwnProperty check from Tween.from because it breaks on extended or inherited Game Objects.

## Pixi 1.6.0

The following changes were part of the Pixi 1.6.0 release:

### New features

* Big graphics update!
* Complex polys now supported in Pixi in webGL.
* Nested masking and complex poly masking supported in webGL.
* quadraticCurveTo added to PIXI.Graphics.
* bezierCurveTo added to PIXI.Graphics.
* arcTo added to PIXI.Graphics.
* arc added to PIXI.Graphics.
* drawPath added to PIXI.Graphics.
* roundedRectangle added to PIXI.Graphics.
* PIXI.Strip and PIXI.Rope added to library along with a new example.
* addChild / addChildAt functions now return the child.
* Add scaleMode params to PIXI.FilterTexture and PIXI.RenderTexture.
* fromFrames and fromImages static helper methods added to PIXI.MovieClip.
* updateSourceImage added to PIXI.BaseTexture.
* Added multitouch support.
* new valid property added to PIXI.Texture.
* Option to control premultiplied alpha on textures.
* Pixi logs current version in the console.
* webp image support.
* clear function added to PIXI.RenderTexture

### Bug Fixes

* Fix to roundPixels property in PIXI.CanvasRenderer.
* Fixed interactive bug when mousemove being called on removed objects.
* Fix bug touch move event handling.
* Various CocoonJS Fixs.
* Masks now work when used in PIXI.RenderTextures / cacheAsBitmap and PIXI.Filters.
* Fixed bug where stroked PIXI.Text sometimes got clipped.
* Removed the trailing whitespace when wordwrapping a PIXI.Text.
* Fixed texture loading on IE11.
* Fixed Data URI loading.
* Fixed issue so now loader only uses XDomainRequest in IE, if a crossorigin request is needed.
* Fixed issue where alpha not being respected if cacheAsBitmap is true
* Fixed PIXI.RendeTexture resize bug.
* Fixed PIXI.TilingSprite not render children on canvas.
* Fixes issue where if both mask and filter are applied to one object the object did not render.
* If the texture is destroyed, it should be removed from PIXI.TextureCache too.
* PIXI.Graphics blendMode property now works in webGL.
* Trimmed sprites now behave the same as non trimmed sprites.

### Misc

* Doc tweaks / typo corrections.
* Added Spine license to src.
* Removed this.local in InteractionData.
* Shader manager Simplified.
* Sprite._renderCanvas streamlined and optimized.
* WebGL drawCalls optimized.

## Version 2.0.5 - "Tanchico" - 20th May 2014

### Updates

* TypeScript definitions fixes and updates (thanks @luispedrofonseca @clark-stevenson @Anahkiasen @adamholdenyall @luispedrofonseca @WillHuxtable)
* Input.getPointerFromIdentifier docs update to reflect where the identifier comes from. Pointer properties now set to give it fixed defaults (thanks @JirkaDellOro, #793)
* Pointer.pointerId added which is set by the DOM event (if present in the browser). Note that browsers can and do recycle pointer IDs.
* Pointer.type and Pointer.exists properties added.
* QuadTree.retrieve can now accept either a Sprite with a physics body or a Phaser.Rectangle as its parameter.
* PluginManager.add now accepts additional parameters and if given a function it will pass them all to the Plugin constructor.
* Tilemap.getTile has a new nonNull parameter. If true it won't return `null` for empty tiles, but will return the actual Tile in that location.
* Math.interpolateAngles and Math.nearestAngleBetween have been removed for the time being. They threw run-time errors previously.
* PIXI.InteractionManager is no longer over-written if the object already exists (thanks @georgiee, #818)
* Key.justPressed and justReleased incorrectly set the delay value to 2500ms. Now defaults to 50ms (thanks @draklaw, fix #797)
* Stage.backgroundColor can now accept short-code hex values: `#222`, `#334`, etc.
* Pointer.withinGame is now accurate based on game scale and updated as the Pointer moves.
* Stage.bounds is now updated if the game canvas offset changes position. Note that it contains the un-scaled game dimensions.

### New Features

* New `force` parameter added to Group.set, setAll, setAllChildren, setProperty which controls if a property is created even if it doesn't exist.
* Group.hasProperty will check a child for the given property and return true if it exists, otherwise false.
* Phaser.Tween.from allows you to set tween properties that will end up where the current object is (thanks @codevinsky, #792)
* Input.getPointerFromId will return a pointer with a matching pointerId value, if any. pointerId is a value set by the browser in the DOM event.
* ArcadePhysics.getObjectsUnderPointer will return all children from a Group that overlap with the given Pointer.
* InputManager.minPriorityID lets you set the minimum priority level an object needs to be to be checked by a Pointer. Useful for UI layer stacking.
* New consts: Phaser.Tilemap.NORTH, SOUTH, EAST and WEST to use with plugins and generally just handy to have.
* BitmapData.processPixelRGB added undefined check (thanks @muclemente, fix #808)
* Phaser.Utils.transposeArray will transpose the given array and return it.
* Phaser.Utils.rotateArray will rotate the given array by 90 or 180 degrees in either direction and return it.
* BitmapData.rect provides a quick way to draw a Rectangle to a BitmapData.
* Button.onOverMouseOnly is a boolean that causes onOver events to fire only if the pointer was a mouse (i.e. stops onOver sounds triggering on touch)
* Tilemap.setCollision has a new boolean parameter 'recalculate' which lets you control recalculation of collision faces (thanks @max-m, #819)
* Tilemap.setCollisionBetween has a new boolean parameter 'recalculate' which lets you control recalculation of collision faces (thanks @max-m, #819)
* Tilemap.setCollisionByExclusion has a new boolean parameter 'recalculate' which lets you control recalculation of collision faces (thanks @max-m, #819)
* Tilemap.setCollisionByIndex has a new boolean parameter 'recalculate' which lets you control recalculation of collision faces (thanks @max-m, #819)
* Graphics.drawTriangles will draw an array of vertices to the Graphics object (thanks @codevinsky, #795)
* Polygon.area will calculate the area of the Polygon (thanks @codevinsky, #795)
* The Tiled JSON parser will now include Tiled polygons, ellipse and rectangle geometry objects in the resulting map data (thanks @tigermonkey, #791)
* Input.addMoveCallback allows you to bind as many callbacks as you like to the DOM move events (Input.setMoveCallback is now flagged as deprecated)
* Input.deleteMoveCallback will remove a previously set movement event callback.
* Mouse will now check if it's over the game canvas or not and set Pointer.withinGame accordingly.
* Mouse.mouseOutCallback callback added for when the mouse is no longer over the game canvas.
* Mouse.stopOnGameOut boolean controls if Pointer.stop will be called if the mouse leaves the game canvas (defaults to false)
* Tilemap.searchTileIndex allows you to search for the first tile matching the given index, with optional skip and reverse parameters.
* Tilemap.layer is a getter/setter to the current layer object (which can be changed with Tilemap.setLayer)
* Cache.checkKey added - allows you to pass in a Cache type and a key and return a boolean.
* Cache.checkCanvasKey(key) - Check if a Canvas key exists in the cache (thanks to @delta11 for the proposal)
* Cache.checkTextureKey(key) - Check if a Texture key exists in the cache (thanks to @delta11 for the proposal)
* Cache.checkSoundKey(key) - Check if a Sound key exists in the cache (thanks to @delta11 for the proposal)
* Cache.checkTextKey(key) - Check if a Text key exists in the cache (thanks to @delta11 for the proposal)
* Cache.checkPhysicsKey(key) - Check if a Physics key exists in the cache (thanks to @delta11 for the proposal)
* Cache.checkTilemapKey(key) - Check if a Tilemap key exists in the cache (thanks to @delta11 for the proposal)
* Cache.checkBinaryKey(key) - Check if a Binary key exists in the cache (thanks to @delta11 for the proposal)
* Cache.checkBitmapDataKey(key) - Check if a BitmapData key exists in the cache (thanks to @delta11 for the proposal)
* Cache.checkBitmapFontKey(key) - Check if a BitmapFont key exists in the cache (thanks to @delta11 for the proposal)
* Cache.checkJSONKey(key) - Check if a JSON key exists in the cache (thanks to @delta11 for the proposal)
* New movement data added for a Pointer Locked mouse (Pointer.movementX/Y) (thanks @woutercommandeur, #831)
* ScaleManager.bounds is a Rectangle object that holds the exact size of the game canvas, taking DOM offset and game scale into account.

### Plugins

The Plugins have now all moved to [their own repository](https://github.com/photonstorm/phaser-plugins)

### Bug Fixes

* Line.pointOnLine corrected algorithm (thanks @woutercommandeur, fix #784)
* Line segment collision fails under certain cicumstances (thanks @woutercommandeur, fix #760)
* The P2 DistanceConstraint method signature has changed. Updated Phaser so maxForce is now passed as object (fix #788)
* Moved the this._reversed flag outside of the property loop in Tween (as per tween.js issue 115)
* Emitter.makeParticles updated to use Array.isArray() check on the key/frame values, so non-string objects can be passed in (thanks @AnderbergE, fix #786)
* Tilemap.createFromObjects will now force the creation of the property again even if it doesn't exist (regression fix from 2.0.4)
* Phaser.Line.intersectsPoints fixed by properly checking the boundaries (thanks @woutercommandeur, fix #790)
* Group.set and setAll were changed in 2.0.4 to not create the property unless it existed. This broke backwards compatibility, so has been fixed.
* Sound.play now returns the Sound object (thanks @AnderbergE, fix #802)
* Device Silk UA test updated to avoid Safari conflict (thanks @jflowers45, fix #810)
* Sound.stop on Samsung S4 would randomly throw a DOM error. Wrapped the audio stop in a try/catch (thanks FSDaniel)
* RandomDataGenerator.integerInRange would return a non-integer value if you passed in a float.
* Timer class updated so that code-resumed pauses don't mess up the internal _pausedTotal value (thanks @joelrobichaud, fix #814)
* Timer class when paused by code after a game-level pause wouldn't set the codepaused flag (thanks @joelrobichaud, fix #814)
* Stage.backgroundColor now properly accepts hex #RRGGBB and color values 0xRRGGBB again (fix #785)
* Color.getRGB would return incorrect color components if a color value without alpha was given, now works with both 0xRRGGBB and 0xAARRGGBB.
* Color.getWebRGB now works regardless if you give an 0xRRGGBB or 0xAARRGGBB color value.
* If an object was drag enabled with bringToTop, the onDragStop event wouldn't fire until the mouse was next moved (thanks @alpera, fix #813)
* RetroFont.text would throw WebGL errors due to an issue with Pixi.RenderTexture. Fixed in Phaser and submitted code to Pixi.
* RenderTexture.resize would throw WebGL errors due to an issue with Pixi.RenderTexture. Fixed in Phaser and submitted code to Pixi.
* Group.hasProperty fixed to not use hasOwnProperty, but a series of `in` checks (thanks @mgiuffrida for the idea, #829)
* Tilemap.removeTile sets tiles to null but should set to index of -1 (thanks @draklaw, fix #835)

## Version 2.0.4 - "Mos Shirare" - 29th April 2014

### Updates

* Updated to [Pixi.js 1.5.3](https://github.com/GoodBoyDigital/pixi.js/releases/tag/1.5.3)
* Updated to latest [p2.js](https://github.com/schteppe/p2.js/commits/master) - all commits from 0.5.0 to Apr 27th 2014.
* TypeScript definitions fixes and updates (thanks @clark-stevenson @metrofun @killalau)
* Timer has removed all use of local temporary vars in the core update loop.
* The Input.reset `hard` reset parameter is now passed down to the Keyboard and Key reset methods.
* AnimationManager.destroy now iterates through child animations calling destroy on all of them, avoiding a memory leak (thanks stauzs)
* AnimationManager.play will now call Animation.stop on the current animation before switching to the new one (thanks @nihakue, #713)
* ArcadePhysics.Body.phase is checked in postUpdate to prevent it from being called multiple times in a single frame.
* Group.setProperty will now check if the property exists before setting it, this applies to Group.setAll and anything else using setProperty internally.
* QuadTree.retrieve now checks to see if the given Sprite has a body before carrying on.
* ArcadePhysics.collideSpriteVsGroup checks if Sprite has a body before carrying on, now safely skips sub-groups or other non-Sprite group children. 
* Group.remove now checks the child to see if it's a member of the root Group before removing it, otherwise Pixi throws an Error.
* The Emitter no longer checks if minParticleScale = maxParticleScale for the scale check, allowing for fixed scale particles again.
* The PIXI.AbstractFilter is now included in the Phaser Pixi build by default, allowing for easier use of external Pixi Filters.
* All Game Objects have a new property: destroyPhase (boolean) which is true if the object is in the process of being destroyed, otherwise false.
* If Tween.yoyo was true but repeat was 0 then it wouldn't yoyo. Now if yoyo is set, but not repeat, the repeat count gets set to 1 (thanks @hilts-vaughan, fix #744)
* RandomDataGenerator.integerInRange uses a new method of rounding the value to an integer to avoid distribution probability issues (thanks PhaserFan)
* Updated the Device little / big endianess check.
* Time has been updated so that physicsElapsed can never be zero (falls back to 1/60), also fixes p2 elapsed time bug (thanks @georgiee, fix #758)
* Input and Pointer now use the new ArrayList instead of a LinkedList, which resolve list item removable during callback issues.
* Input.reset no longer resets every interactive item it knows of, because they are removed during the destroy phase and can now persist between States if needed.
* Blank Tilemaps no longer create `null` tiles, but instead create Tile objects with an index of -1 which can be replaced and updated like any other tile.
* Tilemap.addTilesetImage will now raise a console.warn if you specify an invalid tileset key and not create the tileset rather than pick the default set.
* Math.smoothstep and Math.smootherstep have been updated to work regardless if a is > or < b (thanks @gre, fix #772)
* Text.updateText now sets the lineCap to `round` to avoid occassional font glitching issues in Chrome.
* Loader now uses XDomainRequest in IE9 to load JSON data to help with CORS issues.

### New Features

* New Phaser Project Template specifically for requireJS in the `resources/Project Templates` folder (many thanks @ashatch)
* Loader now has an onFileStart event you can listen for (thanks @codevinsky, #705)
* Group.classType allows you to change the type of object that Group.create or createMultiple makes from Phaser.Sprite to your own custom class.
* Timer.clearPendingEvents will purge any events marked for deletion, this is run automatically at the start of the update loop.
* Device.crosswalk detects if your game is running under Intels Crosswalk XDK.
* Keyboard.reset has a new `hard` parameter which controls the severity of the reset. A soft reset doesn't remove any callbacks or event listeners.
* Key.reset has a new `hard` parameter which controls the severity of the reset. A soft reset doesn't remove any callbacks or event listeners.
* InputManager.resetLocked - If the Input Manager has been reset locked then all calls made to InputManager.reset, such as from a State change, are ignored.
* Group.resetCursor will reset the Group cursor back to the start of the group, or to the given index value.
* World.wrap will take a game object and if its x/y coordinates fall outside of the world bounds it will be repositioned on the opposite side, for a wrap-around effect.
* Device.support32bit is a new boolean that sets if the context supports 32bit pixel manipulation using array buffer views or not.
* P2.World now has its own pause and resume methods, so you can pause the physics simulation independent of your game (thanks @georgiee)
* Phaser.ArrayList is a new iterative object, similar in principal to a set data structure, but operating on a single array without modifying the object structure.
* Add scaleMode params to FilterTexture and RenderTexture (pixi.js update by @giraluna)
* Your State can now have a pauseUpdate method, which is called constantly when the game is paused.
* Timer.timeCap is a new setting allowing your Timers to protect against unexpectedly large delta timers (such as raf de-vis or CPU grind).
* Camera.unfollow allows you to easily unfollow a tracked object (thanks @alvinsight, #755)
* Animation.setFrame allows you to set the animation to a specific frame (thanks @adamholdenyall, #706)
* Point.dot - get the dot product of two Point objects.
* Point.cross - get the cross product of two Point objects.
* Point.cross - get the cross product of two Point objects.
* Point.perp - make the Point perpendicular (90 degrees rotation)
* Point.rperp - make the Point perpendicular (-90 degrees rotation)
* Point.normalRightHand - Right-hand normalize (make unit length) a Point.
* Point.angle - Returns the angle between this Point object and another object with public x and y properties.
* Point.angleSq - Returns the angle squared between this Point object and another object with public x and y properties.
* Point.getMagnitudeSq - Calculates the length squared of the Point object.
* Point.project - Project two Points onto another Point.
* Point.projectUnit - Project two Points onto a Point of unit length.
* Point.multiplyAdd - Adds two 2D Points together and multiplies the result by the given scalar.
* Point.negative - Creates a negative Point.
* Point.interpolate - Interpolates the two given Points, based on the `f` value (between 0 and 1) and returns a new Point.
* Color.packPixel packs an rgb component into a single integer.
* Color.unpackPixel unpacks an integer into a color object.
* Color.fromRGBA converts an integer in 0xRRGGBBAA format to a color object.
* Color.toRGBA converts rgba components into a 32-bit integer.
* Color.RGBtoHSL converts an rgb color into hsl (hue, saturation, lightness)
* Color.HSLtoRGB converts hsl values into an rgb color object.
* Color.RGBtoHSV converts an rgb color into hsv (hue, saturation, value)
* Color.HSVtoRGB converts an hsv value into an rgb color object.
* Color.createColor - creates the new light-weight color object used by most Color conversion methods.
* Color.updateColor - updates an existing color object to update the rgba property.
* Color.RGBtoString converts an rgba color into a # or 0x color string.
* Color.HSVColorWheel will return an array with 360 color objects for each segment of an HSV color wheel, you can optionally set the saturation and value amounts.
* Color.HSLColorWheel will return an array with 360 color objects for each segment of an HSL color wheel, you can optionally set the saturation and lightness amounts.
* BitmapData.cls clears the current context.
* BitmapData.fill fills the context with the given color.
* BitmapData.processPixelRGB lets you perform a custom callback on every pixel in the BitmapData by passing the pixels color object to your callback.
* BitmapData.processPixel lets you perform a custom callback on every pixel in the BitmapData by passing the pixels color value to your callback.
* BitmapData.replaceRGB will scan the bitmap for a specific color and replace it with the new given one.
* BitmapData.setHSL sets the hue, saturation and lightness values on every pixel in the given region, or the whole BitmapData if no region was specified.
* BitmapData.shiftHSL shifts the hue, saturation and lightness values on every pixel in the given region, or the whole BitmapData if no region was specified.
* BitmapData.extract scans this BitmapData for all pixels matching the given r,g,b values and then draws them into the given destination BitmapData.
* BitmapData.circle draws a filled Circle to the BitmapData at the given x, y coordinates and radius in size.

### Bug Fixes

* The main Timer loop could incorrectly remove a TimerEvent if a new one was added specifically during an event callback (thanks @garyyeap, fix #710)
* Fixed the use of the destroy parameter in Group.removeAll and related functions (thanks @AnderbergE, fix #717)
* P2.World.convertTilemap now correctly checks the collides parameter of the tiles as it converts them.
* Animation.destroy didn't correctly clear the onStart, onLoop and onComplete signals.
* StateManager.restart incorrectly skipped the first additional parameter after clearCache (thanks @mariusbrn, fix #722)
* Line.angle and Math.angleBetween used Math.atan2 arguments in the wrong order (thanks @jotson, fix #724)
* Group.destroy checks parent before removing (thanks @clark-stevenson, fix #733)
* Fixed typo in P2.World.setMaterial (thanks @OpherV, fix #739)
* InputHandler._setHandCursor private var wasn't properly set, meaning the hand cursor could sometimes remain (during destroy sequence for example)
* Destroying an object with an input handler during its onDown event would throw Signals dispatch errors (thanks @jflowers45, fix #746)
* Circle.distance used an incorrect Math call if you wanted a rounded distance value (thanks @OpherV, fix #745)
* Point.distance used an incorrect Math call if you wanted a rounded distance value (thanks @OpherV, fix #745)
* P2.Body.loadPolygon has been updated to correct center of mass issues (thanks @georgiee, fix #749)
* Game checks if window.console exists before using it (should fix IE9 issues when dev tools are closed), however it is still used deeper in Pixi.
* Masks now work when used in RenderTextures / CacheAsBitmap and Filters (pixi.js update)
* Stroked text sometimes got clipped (pixi.js update)
* Polygon.contains now works for coordinates to the left of the polygon (thanks @vilcans, fix #766)
* Game pause/resume could incorrectly increment paused Timers (thanks @georgiee, fix #759)
* Animations resuming from a pause no longer skip frames (thanks @merixstudio, fix #730)
* Tilemap.fill would throw an error if called on a blank tilemap full of null values (thanks @DrHackenstein, fix #761)
* LoaderParser.bitmapFont updated so xml parsing works properly on IE9 (thanks @georgiee)
* Sounds that had been paused via game code would un-mute if the game paused and resumed.
* CSV Tilemap tiles would incorrectly set the Tile layer reference, causing collision to fail (thanks @Chapelin, fix #692)

### 2.0.4 - zero hour updates

The following issues were fixed in 2.0.4 approx. 1 hour after official release:

* ScaleManager seeds _check private var with null to avoid later comparison check (thanks @jflowers45, fix #782)
* P2.Body.applyForce should have used pxmi instead of pxm (thanks @Trufi, fix #776)
* P2 fixed creation of RevoluteConstraint by passing maxForce in the options (thanks @woutercommandeur, fix #783)
* Tilemap.getTile and getTileXY used to return `null` in 2.0.3 but returned a Tile object in 2.0.4 (with an index of -1), they now return `null` again.

## Version 2.0.3 - "Allorallen" - 11th April 2014

### Updates

* Updated to [Pixi.js 1.5.2](https://github.com/GoodBoyDigital/pixi.js/releases/tag/v1.5.2)
* Updated to [p2.js 0.5.0](https://github.com/schteppe/p2.js/releases/tag/v0.5.0)
* Return the result of P2.Body.setCircle for further chaining and manipulation (fix #659)
* Updated the PhysicsEditor plugin to maintain position, radius, mask bits, category bits and sensor flags (thanks @georgiee, #674)
* Further TypeScript defs tweaks (thanks @clark-stevenson)
* Lowered the default size of SpriteBatch from 10000 to 2000 as this yields faster results on mobile (pixi.js update)
* Fix for 'jagged' strokes on custom fonts (thanks @nickryall, #677)
* The State.update function (and thus the update of any sub-classed Sprites or other objects) is now called before Stage, Tweens, Sound, Input, etc (#662)
* The Phaser jshint process is now running on Travis (thanks @xtian, #656)
* The Phaser Gruntfile is now split up into option tasks (thanks @xtian, #638)
* Key.reset now clears any callbacks associated with the onDown and onUp events and nulls the onHoldCallback if set. Key.reset is called by Keyboard.reset when changing state.
* If you pass `null` to Tilemap.putTile as the tile parameter it will pass the call over to Tilemap.removeTile.
* TypeScript definitions updated for latest changes (thanks @clark-stevenson)
* Keyboard.stop nulls the function references after removing the event listeners (thanks @bmceldowney, #691)
* Tilemap.hasTile allows for multi-layer type parameter (thanks @Raeven0, #680)
* Grunt update to dev dependencies (thanks @xtian, #695)
* Emitter now emits Phaser.Particle objects instead of Phaser.Sprites, which can be extended as required.
* Emitter has had various local properties removed that were already declared in Phaser.Group which it extends.
* PluginManager parent parameter removed as it's redundant. Also most core functions tidied up and jsdocs fixed.
* p2.World.defaultRestitution has been deprecated and is now p2.World.restitution.
* p2.World.defaultFriction has been deprecated and is now p2.World.friction.
* p2.World now uses 4 bodies for the world boundaries, rather than 1 body with 4 shapes. This stops the bounds triggering narrowphase with every single body in the world.
* p2.World bounds are now included in the callback events such as beginContact and impact events.
* Thanks to @STuFF the Classes drop-down list in the API docs now indents the sub-classes.

### New Features

* Added ability to retrieve a single p2 fixture from the cache (thanks @georgiee, #674)
* Timers can now have a start delay value (thanks @georgiee, #660)
* CacheAsBitmap added to Display Object, so works for Sprite, Image, Button. Allows you to cache complex display hierarchies for speed.
* CacheAsBitmap added to Graphics Object. Allows you to cache complex graphics structures hierarchies for speed.
* Added generateTexture function to display objects. Create a texture from the current object display hierarchy for use as a texture elsewhere.
* Added optional FilterArea to display object (for optimisation)
* Graphics chaining functions.
* Added Pointer.positionUp which records the last point at which the pointer left the screen (thanks @Cryszon, #676)
* Phaser.Point.centroid static function added to calculate the centroid or midpoint of an array of points (thanks @lewster32, #675)
* SoundManager.remove(sound) now lets you remove a sound from the SoundManager, destroying it in the process.
* Sound.destroy will remove a sound and all local references it holds, optionally removing itself from the SoundManager as well.
* SoundManager.removeByKey(key) will remove all sounds from the SoundManager that have a key matching the given value.
* ArcadePhysics.Body.hitTest(x, y) will return a boolean based on if the given world coordinate are within the Body or not.
* StateManager.restart allows you to quickly restart the *current* state, optionally clearing the world and cache.
* Tilemap.removeTile(x, y, layer) lets you remove the tile at the given coordinates and updates the collision data.
* Tilemap.removeTileWorldXY lets you remove the tile at the given pixel value coordinates and updates the collision data.
* Key.enabled boolean allows you to toggle if a Key processes its update method or dispatches any events without deleting and re-creating it.
* Emitter now has minParticleAlpha and maxParticleAlpha values for setting a random alpha on emitted particles.
* Emitter.particleAnchor allows you to control the anchor of emitted Particles. Defaults to 0.5 (same as before) but now under your control.
* Emitter.setAlpha allows you to quickly set the min and max alpha values.
* Emitter.setScale allows you to quickly set the min and max scale values.
* Emitter.blendMode lets you set the blendMode of any emitted Particle (needs a browser that supports canvas blend modes)
* Group.customSort allows you to sort the Group children based on your own sort function.
* Emitter.setScale has a new 'rate' parameter which allows particles to change in scale over time, using any Easing value or timescale.
* Emitter.setScale now allows you to scale the x and y axis of the particles independently.
* Emitter.setAlpha has a new 'rate' parameter which allows particles to change alpha over time, using any Easing value or timescale.
* Emitter.bringToTop and Emitter.sendToBack are booleans that let you optionally set the display order of the Particle when emitted.
* Emitter now calls the Phaser.Particle.onEmit function, which is left empty for you to override and add in custom behaviours.
* p2.World has a new contactMaterial property, which can be configured like a normal P2 Contact Material and is applied when two bodies hit that don't have defined materials.
* Group.remove has a new 'destroy' parameter (false by default), which will optionally call destroy on the item removed from the Group.
* Group.removeAll has a new 'destroy' parameter (false by default), which will optionally call destroy on the items removed from the Group.
* Group.removeBetween has a new 'destroy' parameter (false by default), which will optionally call destroy on the items removed from the Group.
* @georgiee created a new P2.FixtureList class to allow easy access the fixtures of a created P2 Body:

This is especially useful in combination with PhysicsEditor and P2.Body#addPhaserPolygon.

You can configure your whole collision grouping in PhysicsEditor and then you can later change the mask bits easily with this class. You can also access parts (groups) and named fixtures by a group index or a fixture key - both properties can be set in PhysicsEditor with the custom phaser exporter.

Use cases:

* Configure collision bits in PhysicsEditor and you want to change them later.
* Place a sensor in your fixture and access this single fixture later (to disable temporarily)
* Create a small body with threes fixtures (circle, circle + polygon/convex). Now you want that the polygon part to behave like rubber and assign a bouncing (restitution > 1) material. Assign a fixture key in PhysicsEditor and access the fixture like this. (see the image for the fixture I described)

### Bug Fixes

* If you inputEnable = false a gameobject you couldn't re-enable it again using inputEnable = true, only directly via the handler (thanks @nickrall, fix #673)
* Fixed setTexture bug with TilingSprite (pixi.js 1.5.2 bug fix)
* Fixed anchor point bug in canvas with TilingSprite (pixi.js 1.5.2 bug fix)
* Fixed positionOffset not begin correct in TilingSprite (pixi.js 1.5.2 bug fix)
* Fixed issue where filters were not being applied to TilingSprite (pixi.js 1.5.2 bug fix)
* Fixed SpriteBatch canvas transform bug (pixi.js 1.5.2 bug fix)
* Fixed Cached textures issue when using base64 encoded images (@cacheflowe) (pixi.js 1.5.2 bug fix)
* Fixed issue where visibility was not being respected in sprite batch (pixi.js 1.5.2 bug fix)
* Fixed bug in gl.bindTexture which tried to use an undefined private var. (@photonstorm) (pixi.js 1.5.2 bug fix)
* Fixed the 'short cut' version of Math.floor in setTransform if roundPixels is true. (@photonstorm) (pixi.js 1.5.2 bug fix)
* SoundManager.boot will check to see if the AudioContext was created before carrying on (thanks @keyle, fix #669)
* Fixed bug where move up and move down method in groups did not work (thanks @jonthulu, fix #684)
* Fixed bug in Group.next when cursor is at the last child (thanks @jonthulu, fix #688)
* Emitter.minParticleScale and maxParticleScale wasn't resetting the Body size correctly.
* Group.removeBetween now properly iterates through the children.
* P2.World had a type in the restitution method title. Now fixed.
* Objects with an InputHandler now deactivate it when the object is removed from a Group but not destroyed (fix #672)
* Fixed the vectors used in the BlurX and BlurY filters (thanks @nickryall, fix #668)

### p2.js v0.5.0

* Added property .enableIslandSleeping to World.
* Added property .useFrictionGravityOnZeroGravity to World.
* Renamed .useWorldGravityForFrictionApproximation in World to .useWorldGravityAsFrictionGravity to keep things more uniform.
* Sleep improvements.
* Added property .frictionIterations to GSSolver, and removed .skipFrictionIterations.
* Upgraded to gl-matrix 2.1.0.
* Removed QuadTree.
* Removed mat2.
* Added Utils.extend.
* Added methods .setStiffness and .setRelaxation methods to Constraint.
* Removed properties .stiffness, .relaxation and .useGlobalEquationParameters from GSSolver.
* Added methods .setGlobalStiffness, .setGlobalRelaxation, .setGlobalEquationParameters to World.
* Renamed property .eps to .epsilon for Equation.
* Removed property .useBoundingBoxes from NaiveBroadphase in favor of the new property .boundingVolumeType in Broadphase.
* Added methods .getMaxForce and .setMaxForce to LockConstraint.
* Changed property names .bi, .bj, .ni, .ri, .rj to .bodyA, .bodyB, .normalA, .contactPointA, .contactPointB in Equation, ContactEquation and FrictionEquation classes.
* Removed IslandSolver in favor of the new property World.islandSplit.
* Changed constructors of the Constraints so they all take an options object as last parameter.
* Added property .collideConnected to Constraint.
* Added property .islandSplit to World.
* Added methods .disableBodyCollision and .enableBodyCollision to World.
* Added properties .useWorldGravityForFrictionApproximation and .frictionGravity to World.
* Added Heightfield class.
* Removed properties .defaultFriction and .defaultRestitution from World, in favor of .defaultContactMaterial.
* Added property .enabled to Equation.
* Added property .surfaceVelocity to ContactMaterial.
* Added property .sensor to Shape.
* World now emits events 'beginContact', 'endContact' and 'preSolve'.
* Added property .gravityScale to Body.
* Renamed class SAP1DBroadphase to SAPBroadphase.
* Added property .interpolatedPosition to Body`.
* Added method .internalStep to World.
* Added property .applyGravity to World.
* Renamed method .computeC to .computeInvC in Equation, and made it compute the inverse.
* Added static method Utils.splice.
* Added property .world to Body.
* Added property .fixedRotation to Body.
* Added class AABB.
* Added properties .aabb and .aabbNeedsUpdate to Body, as well as a method .updateAABB.
* Added property .useBoundingBoxes to NaiveBroadphase.
* Added static method Broadphase.aabbCheck.
* Added method .computeAABB to Shape.
* Added static method Broadphase.canCollide.
* Body now inherits from EventEmitter, and dispatches events 'sleep','sleepy' and 'wakeup'.
* Added properties .allowSleep, .sleepState, .sleepSpeedLimit, .sleepTimeLimit, .lastTimeSleepy as well as methods .sleep, .wakeUp and .sleepTick to Body.
* Added enums Body.AWAKE, Body.SLEEPY, Body.SLEEPING.
* Added property .enableBodySleeping to World.
* Added options .disableRotationalLock, .lowerLimit, .upperLimit to PrismaticConstraint constructor.
* Added methods .enableMotor, .disableMotor to PrismaticConstraint as well as properties .motorEnabled, .motorSpeed, .motorEquation.



## Version 2.0.2 - "Ghealdan" - 28th March 2014

### Bug Fixes

* Sprite would glitch if it had an ArcadePhysics Body that was re-positioned out of loop.
* Sprite would "fly off" if it had an ArcadePhysics Body that was re-positioned during an input handler.
* Tween.generateData would enter an eternal loop if the total resulted in a float. Now wrapped in Math.floor.
* ArcadePhysics.Body preUpdate has been modified to stop Sprites with non-1 scaling from gaining delta and moving off the screen (fix #644).
* ArcadePhysics.Body deltaMaxY wasn't being correctly applied.
* P2.World - Removing tilemap layer retrieval for object layers in convertCollisionObjects() (thanks bmceldowney, fix #653)
* Calling Keyboard.stop() wouldn't let you call Keyboard.start() later on in the same game

### Updated

* The "Build your First Phaser Game" Tutorial has been updated for Phaser 2
* Line.fromSprite now sets "fromCenter" to false by default as Sprite.center is deprecated in 2.x. Documentation and Examples updated to reflect this.
* All the documentation has been re-published for 2.0.2.
* Lots of ArcadePhysics.World methods have been marked as private where they shouldn't be called directly (separateX, etc)
* xtian jshint fixed nearly every single file in the repository!

### New Features

* Sprite.overlap lets you quickly check to see if the bounds of two display objects are intersecting or not, without having to use a physics system.
* Keyboard.destroy will now clear all event listeners and any custom set callbacks or Keys.



## Version 2.0.1 - "Lyrelle" - 24th March 2014

### Bug Fixes

* The Static, Kinematic and Dynamic consts that P2.Body uses were incorrect (fixes #563)
* Sprite.destroy would fail if it had an Arcade Physics body, now added.
* Group.getAt comparison updated (fixes #578)
* Fixed the IE11 version check (fixes #579)
* Ninja world collision to check right and bottom bounds (thanks dreadhorse, fix #571)
* Group enableBody parameter was incorrectly assigned to the debug var (thanks BurnedToast, fix #565)
* Fixed Tile callback check in Arcade Physics (fix #562)
* Removed the examples build script from the Gruntfile (fix #592)
* The P2 World wouldn't clear down fully on a State change, now properly clears out contacts, resets the bitmask, etc.
* Button.onInputUpHandler wouldn't set an upFrame for a frame ID of zero, made the check more strict.
* Fixed the Loader.preloadSprite crop effect on WebGL.
* Fixed Grunt script that stopped the P2 constraint classes from building properly.
* World.destroy incorrectly clashed with the Group.destroy method it over-rode, renamed to World.shutdown and updated StateManager accordingly.
* World.shutdown now removes all children iteratively, calling destroy on each one, ultimately performing a soft reset of the World.
* Objects with a scale.x or y of 0 are no longer considered valid for input (fix #602)
* InputHandler will set the browser pointer back to default if destroyed while over (fix #602)
* ArcadePhysics.separate doesn't pass over to seperateX/Y if overlapOnly is true (fix #604)
* ArcadePhysics.collideSpriteVsSprite checks if both objects have bodies before processing.
* Debug.spriteBounds will now take the position of the camera into consideration when rendering the bounds (fix #603)
* InputHandler.dragFromCenter will now work regardless of the anchor point of the Sprite (fix #600)
* Emitter.friction property removed and replaced with Emitter.particleDrag, which is now correctly applied.
* ArcadePhysics.Body.reset incorrectly set the Body.rotation to Sprite.rotation instead of angle.
* Emitter.emitParticle resets the rotation on the particle to zero before emitting it.
* If no seed was given in the Game config object, the RandomDataGenerator wouldn't be started (thank tylerjhutchison fix #619)
* p2 revolute pivots were wrongly signed (thanks georgiee, fix #621)
* P2.Body.loadPolygon no longer modifies the Cache array (fix #613)
* The volume given in Sound.play now over-rides that set in Sound.addMarker if specified (fix #623)
* BitmapDatas when used as Game Object textures in WebGL now update themselves properly.
* Timer.ms now correctly reports the ms time even if the Timer has been paused (thanks Nambew, fix #624)
* If you added a Tileset to an empty map it would eventually throw an out of memory error.
* Timer objects incorrectly set the first tick value on events if you added the events prior to starting them.

### Updated

* Updated Device.isConsoleOpen as it no longer works in Chrome. Revised code and documentation accordingly (fix #593)
* Removed State.destroy empty method and replaced with State.shutdown, as that is what the StateManager expects (fix #586)
* P2.removeBody will check if the body is part of the world before removing, this avoids a TypeError from the p2 layer.
* Tilemap.createFromObjects has a new parameter: adjustY, which is true by default. Because Tiled uses a bottom-left coordinate system Phaser used to set the Sprite anchor to 0,1 to compensate. If adjustY is true it now reduces the y value by the object height instead.
* Swapped the order of the _pollGamepads gamepads check, to stop the Chrome 'webkitGamepads is deprecated' error in the console.
* Lots of TypeScript definitions updates (thanks as always to clark for these)
* Removed Device.patchAndroidClearRectBug as it's no longer used internally.
* Math.wrapAngle now supports radians (thanks Cryszon, #597)
* Group.replace will now return the old child, the one that was replaced in the Group.
* Group.destroy has a new parameter: `soft`. A soft destruction won't remove the Group from its parent or null game references. Default is `false`.
* InputHandler.validForInput is a new method that checks if the handler and its owner should be considered for Pointer input handling or not.
* ArcadePhysics.Body now checks the ArcadePhysics.World bounds, not the game bounds.
* ArcadePhysics.Body has reverted to the 1.1.3 method of preUpdate, so you can now position sprites with x/y, drag them, etc, regardless of the Body.moves flag (issue #606)
* ArcadePhysics.World now has setBounds and setBoundsToWorld methods, which are called automatically on world resizing.
* ArcadePhysics.Body no longer sets the offset to match the anchor.
* The StateManager is now responsible for clearing down input, timers, tweens, physics, camera and the World display list.
* Removed the use of Int16Array from all Game Objects, swapped for standard Array. Phaser now runs on Android 2.x and IE9 again (fix #590)
* When creating a Sprite (via Group.create or directly) with exists = false and a P2 body, the body is not added to the world.
* Every Input class now checks to see if it has already been started. If so it doesn't add the listeners again unless they have been nulled.
* Lots of fixes to the TypeScript definitions file (thanks as always to clark-stevenson for his tireless work on these)
* Emitters now bring the particle they are about to emit to the top of the Group before doing so. Avoids particles hidden behind others.
* ArcadePhysics.Body.setSize corrected to take the parameters as positive, not negative values.
* ArcadePhysics.World.seperate will now check gravity totals to determine separation order. You can set World.forceX to true to always separate on X first and skip this check.
* TileSprites now emit outOfBounds and enterBounds events accordingly.
* You can now create multiple blank layers in a Tilemap.

### New Features

* Device.getUserMedia boolean added, useful if you need access to the webcam or microphone.
* Math.removeRandom allows you to remove (and return) a random object from an array.
* ArcadePhysics.World now has a checkCollision object which can be used to toggle collision against the 4 walls of its bounds.
* Sprite.events.onEnterBounds added. This is dispatched if the Sprite leaves the bounds but then returns. The opposite of onOutOfBounds.
* Timer.removeAll will remove and clear down all events, but keeps the Timer running.
* Group.setAllChildren recursively checks if its children are Groups, and if so recursively applies the value to their children as well (feature #589)
* Time.deltaCap lets you set a cap for the delta timer. It defaults to zero (which is disabled). If you use ArcadePhysics it gets set to 0.2, but you can modify as needed.
* ArcadePhysics.Body has a deltaMax object, which allows you to cap the delta applied to the position to +- this value.
* ArcadePhysics.Body now checks the Sprite scale automatically and adjusts the body size accordingly (fix #608)
* Emitter.particleClass can now be set to any object that extends Phaser.Sprite, which will be emitted instead of a regular Sprite.
* There is a brand new PhysicsEditor export script specifically for Phaser (in the resources folder), and new p2 polygon parsing functions thanks to georgiee.



## Version 2.0.0 - "Aes Sedai" - March 13th 2014

### New Features

* Phaser.Image is a brand new display object perfect for logos, backgrounds, etc. You can scale, rotate, tint, blend an get input events from an Image, but it has no animation or physics body.
* You can now use the hitArea property on Sprites and Image objects. hitArea can be a geometry object (Rectangle, Circle, Polygon, Ellipse) and is used in pointerOver checks.
* InputManager.getLocalPosition(displayObject, pointer, output) will return the local coordinates of the specified displayObject and pointer.
* InputManager.hitTest will test for pointer hits against a Sprite/Image, its hitArea (if set) or any of its children.
* Text has lots of new methods to help style it: Text.fill, Text.align, Text.stroke, etc.
* Text now works happily with font names with spaces in them.
* Text.setShadow applies a drop shadow to the Text being rendered. Control the x, y, color and blur.
* Text.lineSpacing allows you to set additional spacing between each line that is rendered.
* Text.inputEnabled allows you to enable all input events over Text objects: dragging, clicking, etc - anything that works on a Sprite works on Text now too.
* Phaser.Ellipse added. A fully compatible port of the PIXI.Ellipse class, can be used in Sprite/Image hitArea tests.
* Phaser.Polygon added. A fully compatible port of the PIXI.Polygon class, can be used in Sprite/Image hitArea tests.
* InputHandler.pixelPerfectOver - performs a pixel perfect check to see if any pointer is over the current object (warning: very expensive!)
* InputHandler.pixelPerfectClick - performs a pixel perfect check but only when the pointer touches/clicks on the current object.
* TileSprite can now use a frame from a texture atlas or a sprite sheet.
* TileSprites can now be animated. See new example :)
* TileSprites have a new method: autoScroll(x, y) which sets an automatic scroll running (until stopped with TileSprite.stopScroll).
* BitmapText now uses the new XML parser which should work under CocoonJS without clashes.
* BitmapText signature changed so you can support fonts with spaces in their names.
* Loader.bitmapFont now has 2 extra parameters: xSpacing and ySpacing. These allow you to add extra spacing to each letter or line of the font.
* Added the new RetroFont class. This is for rendering fixed-width bitmap fonts into an Image object. It's a texture you can apply to a Sprite/Image.
* Added Cache.updateFrameData which is really useful for swapping FrameData blocks in the cache.
* Loader.physics now lets you load Lime + Corona JSON Physics data, which can be used with Body.loadPolygon and Body.loadData.
* Cache.addPhysicsData and Cache.getPhysicsData allow you to store parsed JSON physics data in the cache, for sharing between Bodies.
* fixedToCamera now works across all display objects. When enabled it will fix at its current x/y coordinate, but can be changed via cameraOffset.
* fixedToCamrea now works for Groups as well :) You can fix a Group to the camera and it will influence its children.
* Tilemap.createCollisionObjects will parse Tiled data for objectgroups and convert polyline instances into physics objects you can collide with in the world.
* Loader can now load JSON files specifically (game.load.json) and they are parsed and stored in the Game.Cache. Retrieve with game.cache.getJSON(key).
* TileSprites can now receive full Input events, dragging, etc and be positioned in-world and fixed to cameras.
* The StateManager now looks for a function called 'resumed' which is called when a game un-pauses.
* Key.onHold added. This event is dispatched every time the browser sends a keydown event and the key is already being held down.
* Stage.smoothed allows you to set if sprites will be smoothed when rendered. Set to false if you're using pixel art in your game. Default is true. Works in Canvas and WebGL.
* Sprite.smoothed and Image.smoothed allows you to set per-Sprite smoothing, perfect if you just want to keep a few sprites smoothed (or not)
* StateManager.start can now have as many parameters as you like. The order is: start(key, clearWorld, clearCache, ...) - they are passed to State.init() (NOT create!)
* Loader.script now has callback (and callbackContext) parameters, so you can specify a function to run once the JS has been injected into the body.
* Phaser.Timer.stop has a new parameter: clearEvents (default true), if true all the events in Timer will be cleared, otherwise they will remain (fixes #383)
* All GameObjects now have a 'destroyChildren' boolean as a parameter to their destroy method. It's default is true and the value propogates down its children.
* Pixi GrayFilter ported over (thanks nickryall #404)
* Animation.speed added. You can now change the animation speed on the fly, without re-starting the animation (feature request #458)
* Brand new Grunt task - creates each core library as its own file and a combined phaser.js.
* New build script now cleanly splits Phaser, Pixi and p2 so they are each UMD wrapped and each available in the global scope (now more requireJS friendly!).
* phaser-no-libs.js allows you to use your own version of p2.js or pixi.js with Phaser. Warning: This is totally unsupported. If you hit bugs, you fix them yourself.
* Group.sendToBottom(child) is the handy opposite of Group.bringToTop()
* Group.moveUp(child) will move a child up the display list, swapping with the child above it.
* Group.moveDown(child) will move a child down the display list, swapping with the child below it.
* Device.windowsPhone is now tested for.
* The Debug panel now works in WebGL mode. Pay attention to the warning at the top of the Debug docs (feature request #499)
* You can now create blank Tilemaps and then populate them with data later.
* A single Animation object now has 3 new events: onStart, onLoop and onComplete.
* Animation.loopCount holds the number of times the animation has looped since it last started.
* Tween.generateData(frameRate) allows you to generate tween data into an array, which can then be used however you wish (see new examples)
* Group.xy(index, x, y) allows you to set the x and y coordinates of a Group child at the given index.
* Group.reverse() reverses the display order of all children in the Group.
* Tweens are now bound to their own TweenManager, not always the global game one. So you can create your own managers now (for you clark :)
* ScaleManager.fullScreenTarget allows you to change the DOM element that the fullscreen API is called on (feature request #526)
* Merged Georges p2 BodyDebug and reformatted for jshint pass. Looks awesome :)
* ArcadePhysics.Body has a new gravityScale property, which is a modifier multiplied against the world gravity value on a Body.
* Line.coordinatesOnLine will return all coordinates on the line using Bresenhams line algorithm.
* Line now has x, y, width, height, top, bottom, left and right properties, so you can effectively get its bounds.
* TilemapLayer.getRayCastTiles will let you get all tiles that hit the given line for further processing.

### Updates

* Massive thanks to clark-stevenson for doing an amazing job update the TypeScript definitions file.
* Debug.renderRectangle has a new parameter: filled. If true it renders as with fillRect, if false strokeRect.
* Phaser.AnimationParser now sets the trimmed data directly for Pixi Texture frames. Tested across JSON Hash, JSON Data, Sprite Sheet and XML.
* Game.add.renderTexture now has the addToCache parameter. If set the texture will be stored in Game.Cache and can be retrieved with Cache.getTexture(key).
* Game.add.bitmapData now has the addToCache parameter. If set the texture will be stored in Game.Cache and can be retrieved with Cache.getBitmapData(key).
* The InputManager now sets the canvas style cursor to 'inherit' instead of 'default'.
* World.reset now calls Camera.reset which sends the camera back to 0,0 and un-follows any object it may have been tracking.
* Added hostname: '*' to the grunt-connect in Gruntfile.js (fixes #426)
* Device, Canvas and GamePad classes all updated for better CocoonJS support (thanks Videlais)
* BitmapData.alphaMask will draw the given image onto a BitmapData using an image as an alpha mask.
* The new GameObjectCreator (which you access via game.make or State.make) lets you easily create an object but NOT add it to the display list.
* TilemapParser will now throw a warning if the tileset image isn't the right size for the tile dimensions.
* We now force IE11 into Canvas mode to avoid a Pixi bug with pre-multiplied alpha. Will remove once that is fixed, sorry, but it's better than no game at all, right? :(
* Loader.setPreloadSprite() will now set sprite.visible = true once the crop has been applied. Should help avoid issues (#430) on super-slow connections.
* Updated the way the page visibility is checked, should now be more compatible across more browsers.
* Phaser.Input.Key.isUp now defaults to 'true', as does GamepadButton.isUp (#474)
* Vastly improved visibility API support + pageshow/pagehide + focus/blur. Working across Chrome, IE, Firefox, iOS, Android (also fixes #161)
* Pausing the game will now mute audio and resuming will un-mute, unless it was muted via the game (fixes #439)
* ScaleManager has 2 new events: ScaleManager.enterFullScreen and ScaleManager.leaveFullScreen, so you can respond to fullscreen changes directly.
* RandomDataGenerator.integerInRange(min, max) now includes both `min` and `max` within its range (#501)
* Tween no longer copies all the object properties into the `_valuesStart` object on creation.
* Completely empty Tilemaps can now be created. This allows for dynamic map generation at runtime.
* Keyboard.event now stores the most recent DOM keyboard event.
* Animation.stop has a new parameter: dispatchComplete. If true it'll dispatch an Animation.onComplete event.
* TileSprites now have a physics body property and call it in the pre and post updates. As with all physics bodies it's null by default.
* json is now the default tilemap format when not defined (thanks RyanDansie, #528)
* The Particle Emitter now remembers the frames given to it and resets it when a new particle is emitted.
* Game.focusLoss and focusGain methods and onBlur and onFocus Signals added, allowing for more fine-grained control over game pause vs. focus loss.
* Keyboard.removeKey method added (thanks qdrj, #550)
* Key.event now stores the most recent DOM event that triggered it.

### Bug Fixes

* Explicitly paused Timer continues if you un-focus and focus the browser window (thanks georgiee)
* Added TimerEvent.pendingDelete and checks in Timer.update, so that removing an event in a callback no longer throws an exception (thanks georgiee)
* Fixed TypeScript defs on lines 1741-1748 (thanks wombatbuddy)
* Previously if you used Sprite.crop() it would crop all Sprites that shared the same base image. It now takes a local copy of the texture data and crops just that.
* Tilemap had the wrong @method signatures so most were missing from the docs.
* Fixed bug where changing State would cause the camera to not reset if it was following an object.
* Tile had 2 properties (callback and callbackContext) that were never assigned, updated to use the proper names (thanks ratkingsimon)
* Fixed an error that would occur if you used InputHandler.onInputUp and the Sprite destroys itself during the event.
* IE11 didn't populate the Device.ie## Version value. Now extracted from Trident revision, but still use Device.trident instead for IE11+ checks.
* Fixed bug in Math.angleBetween where it was using the coordinates in the wrong order.
* Previously using a Pixel Perfect check didn't work if the Sprite was rotated or had a non-zero anchor point, now works under all conditions + atlas frames.
* If pixelPerfect Input Sprites overlapped each other the pixel check wasn't taken into consieration in the Pointer move method.
* Updated Input.Mouse to use event.button not event.which, so the const reference from input.mouse.button is correct (thanks grimor)
* Text that was fixedToCamera would 'jitter' if the world scrolled. Now works as expected across all fixed objects.
* Fixed a bug where Sound.play wouldn't pick-up the local loop setting if not specified in the parameter.
* Active animations now monitor if the game pauses, and resume normally when the game un-pauses (fixes #179)
* Swapping between tabs will now pause the game correctly on mobile browsers (iOS7+)
* Swapping between tabs will pause and resume tweens correctly, allowing their onComplete events to still fire (fixes #292)
* Fullscreen mode now uses window.outerWidth/Height when using EXACT_FIT as the scale mode, which fixes input coordinate errors (fixes #232)
* Fullscreen mode now works in Internet Explorer and uses the new fullscreen non-prefix call.
* Fixed TilemapParser - would spit out a tileset warning if margin/spacing were set (fix #485, thanks Cybolic)
* AnimationParser.spriteSheet wasn't taking the margin or spacing into account when calculating the numbers of sprites per row/column, nor was it allowing for extra power-of-two padding at the end (fix #482, thanks yig)
* AnimationManager.add documentation said that 'frames' could be null, but the code couldn't handle this so it defaults to an empty array if none given (thanks yig)
* Fixed issue stopping SoundManager.volume from working correctly on a global volume basis (fixes #488)
* Phaser.Timer will no longer create negative ticks during game boot, no matter how small the Timer delay is (fixes #366)
* Phaser.Timer will no longer resume if it was previously paused and the game loses focus and then resumes (fixes #383)
* Tweens now resume correctly if the game pauses (focus loss) while they are paused.
* Tweens don't double pause if they were already paused and the game pauses.
* Buttons are now cleanly destroyed if part of a Group without leaving their InputHandler running.
* You can now safely destroy a Group and the 'destroyChildren' boolean will propogate fully down the display list.
* Calling destroy on an already destroyed object would throw a run-time error. Now checked for and aborted.
* Calling destroy while in an Input Event callback now works for either the parent Group or the calling object itself.
* Loader.replaceInFileList wouldn't over-write the previous entry correctly, which caused the Loader.image overwrite parameter to fail (thanks basoko, fixes #493)
* If the game was set to NO_SCALE and you swapped orientation, it would pause and resize, then fail to resize when you swapped back (thanks starnut, fixes #258)
* Device no longer things a Windows Phone or Windows Tablet are desktop devices (thanks wombatbuddy, fixes #506)
* Sound.onMarkerComplete event is now dispatched when a marker stops. See Sound.onLoop for a looping marker event (thanks registered99, fixes #500)
* Events.onInputUp would be dispatched twice if the Sprite had drag enabled, now only dispatched once (thanks Overbryd, fixes #502)
* You can now load in CSV Tilemaps again and they get created properly (fixes #391)
* Tilemap.putTile can now insert a tile into a null/blank area of the map (before it could only replace existing tiles)
* Tilemap.putTile now correctly re-calculates the collision data based on the new collideIndexes array (fixes #371)
* Circle.circumferencePoint using the asDegrees parameter would apply degToRad instead of radToDeg (thanks Ziriax, fixes #509)
* InputHandler.enableSnap now correctly assigns the snap offset parameters (fixes #515)
* Objects that are 'fixedToCamera' are now still correctly placed even if the camera is scaled (#512)
* Changed the define function calls to use named modules, allows pixi, phaser and p2 to reside in 1 file and still be located by requirejs (thanks brejep, #531)
* Cache.destroy fixed to clear up properly (thanks Dumtard, #537)



## Version 1.1.6 - "Shienar" - 24th February 2014

### New Examples

* Added lovely new little mini golf game by jpcloud.

### Updates

* Loader can now load JSON files natively (thanks lucas)
* TilemapParser now errors if the tileset isn't the right size

### Bug Fixes

* Updated Physics.Body.applyDamping so that velocity is reduced down to zero properly (thanks caezs)
* ArcadePhysics.collideSpriteVsTilemapLayer wouldn't call the process or collide callbacks if only 1 tile was involved in the check (thanks mandarinx)
* Lots of documentation fixes (thanks nhowell)
* Fix for PixiPatch so it renders masks again (thanks georgios)
* Modified ArcadePhysics.intersects so it returns a value as well as asigns (thanks bunnyhero)
* Lots of TypeScript defs fixes (thanks clark)



## Version 1.1.5 - "Saldaea" - 12th February 2014

### Bug Fixes

* Explicitly paused Timer continues if you un-focus and focus the browser window (thanks georgiee)
* Added TimerEvent.pendingDelete and checks in Timer.update, so that removing an event in a callback no longer throws an exception (thanks georgiee)
* Fixed TypeScript defs on lines 1741-1748 (thanks wombatbuddy)
* Added SAT.js to TypeScript definition. Now compiles properly.
* Added missing Line.js to the Grunt file.
* Tilemap#paste diffX and diffY equations changed, fixed issue #393 (thanks brejep)
* Added missing return value in Body.hitLeft and hitRight, fixes issue #398 (thanks ram64).
* Fixed easing tween example case. Issue #379 (thanks wesleywerner)
* Removed SAT.js UMD wrapped, fixes issue #361 (thanks luizbills)
* Removed inContact check from Body.separate.
* Fixed Tilemap docs (wrongly pointed to Tileset methods)



## Version 1.1.4 - "Kandor" - February 5th 2014

### Significant API changes

* Loader.tileset has been removed as it's no longer required, this was as part of the Tilemap system overhaul.
* TilemapLayers are now created via the Tilemap object itself: map.createLayer(x, y, width, height, tileset, layer, group) and no longer via the GameObjectFactory.
* Tilemap.createFromObjects can now turn a bunch of Tiled objects into Sprites in one single call, and copies across all properties as well.
* Tween.onStartCallback and onCompleteCallback have been removed to avoid confusion. You should use the onStart, onLoop and onComplete events instead.
* Button.forceOut default value has changed from true to false, so Buttons will revert to an Up state (if set) when pressed and released.
* The way the collision process callback works has changed significantly and now works as originally intended.
* The World level quadtree is no longer created, they are now built and ripped down each time you collide a Group, this helps collision accuracy.
* A SAT system has been integrated for Body collision and separation.
* Bodies are no longer added to a world quadtree, so have had all of their quadtree properties removed such as skipQuadtree, quadTreeIndex, etc.
* Body.drag has been removed. Please use the new Body.linearDamping value instead (which is a number value, not a Point object)
* Body.embedded and Body.wasTouching have been removed as they are no longer required.
* Body.customSeparateX/Y have been removed as you should now use Body.customSeparateCallback.
* Body.maxVelocity defaults have been removed from 10,000 to 2000.
* Body.customSeparateCallback allows you to set your own callback when two Bodies need to separate rather than using the built-in method.
* Body.collideCallback allows you to set a callback that is fired whenever the Body is hit on any of its active faces.
* Body.allowCollision has been renamed to Body.checkCollision.
* Body.rebound is a boolean that controls if a body will exchange velocity on collision. Set to false to allow it to be 'pushed' (see new examples).
* Removed Body.deltaAbsX and deltaAbsY as they are no longer used internally.
* Body.screenX and screenY moved to getters, no longer calculated every frame.
* ArcadePhysics now has setBounds and setBoundsToWorld, and you can specify which walls are created or not (left, right, up, down)
* Removed: Debug.renderSpriteTouching, Debug.renderLocalTransformInfo, Debug.renderWorldTransformInfo, Debug.renderSpriteCollision and Debug.dumpLinkedList.
* Body.setSize has been removed. Please use Body.setCircle, setRectangle or setPolygon instead.

### New Features

* Phaser.Timer is now feature complete and fully documented. You can create Phaser.TimerEvents on a Timer and lots of new examples have been provided.
* Gamepad API support has been added with lots of new examples (thanks Karl Macklin)
* Phaser.Game constructor can now be passed a single object containing all of your game settings + Stage settings. Useful for advanced configurations.
* The width/height given to Phaser.Game can now be percentages, i.e. "100%" will set the width to the maximum window innerWidth.
* Added a stage.fullScreenScaleMode property to determine scaling when fullscreen (thanks oysterCrusher)
* Added support for margin and spacing around a frame in Loader.spritesheet.
* Added Device.vibration to check if the Vibration API is available or not.
* Added Device.trident and Device.trident## Version for testing IE11.
* Added Device.silk for detecting a Kindle Fire and updated desktop OS check to exclude Kindles (thanks LuckieLordie)
* TilemapLayers now have debug and debugAlpha values, this turns on the drawing of the collision edges (very handy for debugging, as the name implies!)
* Tweens have a new event: onLoop.
* You can now load any binary file via the Loader: game.load.binary(key, url, callback) - the optional callback allows for post-load processing before entering the Cache.
* Group.set will let you deep set a new propery on a single child of the Group.
* Stage.display property added. A direct reference to the root Pixi Stage object (very useful for RenderTexture manipulation)
* Added Ejecta detection to Device (thanks endel)
* Tweens can now work with relative + and - values. You can do: `tween(sprite).to( { x: '+400' })` and it will add 400 to the current sprite.x value.
* Buttons now properly use their upFrame if set.
* InputHandler now has snapOffsetX and snapOffsetY properties so your snap grid doesn't have to be 0,0 aligned (thanks srmeier)
* Loader.progressFloat contains the actual non-rounded progress value, where-as Loader.progress contains a rounded value. Use progressFloat if you've > 100 files to load.
* Groups can now be added to other Groups as children via group.add() and group.addAt()
* Groups now have an 'alive' property, which can be useful when iterating through child groups with functions like forEachAlive.
* Added a new Project Template "Full Screen Mobile" which you can find in the resources folder. Contains html / css / layout needed for a deployed Phaser game.
* Body.speed - the current speed of the body.
* Body.angle - the current angle the Body is facing based on its velocity. This is not the same as the Sprite angle that may own the body.
* Body.linearDamping - This now replaces Body.drag and provides for a much smoother damping (friction) experience.
* Body.minBounceVelocity - If a Body has bounce set, this threshold controls if it should rebound or not. Use it to stop 'jittering' on bounds/tiles with super-low velocities.
* QuadTree.populate - you can pass it a Group and it'll automatically insert all of the children ready for inspection.
* Input.setMoveCallback allows you to set a callback that will be fired each time the activePointer receives a DOM move event.
* Math.distancePow(x1,y1,x2,y2,power) returns the distance between two coordinates at the given power.
* Physics.collide now supports the 2nd parameter as an array, for when you want to collide an object against a number of sprites that aren't all in the same Group.
* Physics.overlap now supports the 2nd parameter as an array, for when you want to overlap test an object against a number of sprites that aren't all in the same Group.
* Math.reverseAngle - reverses an angle (in radians).
* Math.normalizeAngle - normalises an angle, now in radians only.
* Math.normalizeLatitude - Normalizes a latitude to the [-90,90] range.
* Math.normalizeLongitude - Normalizes a longitude to the [-180,180] range.
* Phaser.Line added to the geometry classes, with full point on line/segment and intersection tests (see new examples)
* Phaser.CANVAS_PX_ROUND is a boolean. If 'true' the Canvas renderer will Math.floor() all coordinates before drawImage, stopping pixel interpolation. Defaults to false.
* Phaser.CANVAS_CLEAR_RECT is a boolean. If 'true' (the default) it will context.clearRect() every frame. If false this is skipped (useful if you know you don't need it)
* Collision now works between Sprites positioned via sprite.x/y, sprite.body.x/y or sprite.body.velocity.
* If you are tweening a sprite and still want physics collision, set `sprite.body.moves = false` otherwise it will fight against the tween motion.
* Game.enableStep will enable core game loop stepping. When enabled you must call game.step() directly (perhaps via a DOM button?), very useful for debugging!
* Game.disableStep turns core update loop stepping off.
* Debug.renderPhysicsBody(body, color) is extremely useful for debugging the new physics bodies. Will draw the outline + points in the color given.
* Debug.renderBodyInfo(sprite, x, y, color) will display lots of Sprite body data.
* Sprite.events.onBeginContact will be fired when a Body makes contact with another Body. Once contact is over an onEndContact event will be dispatched.

### New Examples

* Physics - Bounce by Patrick OReilly.
* Physics - Bounce with gravity by Patrick OReilly.
* Physics - Bounce accelerator (use the keyboard) by Patrick OReilly.
* Physics - Bounce knock (use the keyboard) by Patrick OReilly.
* Physics - Snake (use the keyboard to control the snake like creature) by Patrick OReilly and Richard Davey.
* Physics - Launcher - Angry Birds style ball launcher demo by Patrick OReilly.
* Physics - Launcher Follow - throw the sprite anywhere in the world by Patrick OReilly.
* Physics - Launcher Follow World - an advanced version of the Launcher Follow example by Patrick OReilly.
* Input - Touch Joystick example showing how to use the clay.io virtual game controller (thanks gabehollombe)
* Games - Matching Pairs by Patrick OReilly.
* Games - Simon Says by Patrick OReilly.
* Tweens - Example showing how to use the tween events, onStart, onLoop and onComplete.
* Display - Pixi Render Texture. A Phaser conversion of the Pixi.js Render Texture example.
* Input - 5 new examples showing how to use the Gamepad API (thanks Karl Macklin)
* Animation - Group Creation, showing how to create animations across all Group children in one call.
* Particles - Rain by Jens Anders Bakke.
* Particles - Snow by Jens Anders Bakke.
* Groups - Nested Groups - showing how to embed one Group into another Group.
* Time - Lots of new examples showing how to use the updated Phaser.Timer class.

### Updates

* Updated to latest Pixi.js dev branch build (pre 1.4 release)
* When a Sprite is destroyed any active filters are removed at the same time.
* Updated Pixi.js so that removing filters now works correctly without breaking the display list.
* Phaser.Canvas.create updated so it can be given an ID as the 3rd parameter (can also be set via new Game configuration object).
* Updated display/fullscreen example to reflect new full screen change.
* Loads of updates to the TypeScript definitions files - games fully compile now and lots of missing classes added :) (thanks Niondir)
* Removed 'null parent' check from Group constructor. Will parent to game.world only if parent value is undefined.
* The tutorials have now been translated into Spanish - thanks feiss :)
* separateY updated to re-implement the 'riding platforms' special condition (thanks cocoademon)
* SoundManager.onSoundDecode now dispatches the key followed by the sound object, also now dispatched by the Cache when doing an auto-decode on load.
* Switch method of using trimmed sprites to support scaling and rotation (thanks cocoademon)
* Most of the GameObjectFactory functions now have a group parameter, so you can do: game.add.sprite(x, y, frame, frameName, group) rather than defaulting to the World group.
* Group.countLiving and countDead used to return -1 if the Group was empty, but now return 0.
* Text can now be fixedToCamera, updated world/fixed to camera example to show this.
* ArcadePhysics.overlap and collide now recognise TileSprites in the collision checks.
* Lots of documentation fixes in the Tween class.
* Tweens fire an onLoop event if they are set to repeat. onComplete is now only fired for the final repeat (or never if the repeat is infinite)
* Pointer used to un-pause a paused game every time it was clicked/touched (this avoided some rogue browser plugins). Now only happens if Stage.disableVisibilityChange is true.
* Input doesn't set the cursor to default if it's already set to none.
* You can now collide a group against itself. This will check all children against each other, but not themselves (thanks cocoademon)
* RenderTexture.render / renderXY has a new parameter: renderHidden, a boolean which will allow you to render Sprites even if their visible is set to false.
* Added in prototype.constructor definitions to every class (thanks darkoverlordofdata)
* Group.destroy has a new parameter: destroyChildren (boolean) which will optionally call the destroy method of all Group children.
* Button.clearFrames method has been added.
* Device.quirksMode is a boolean that informs you if the page is in strict (false) or quirks (true) mode.
* Canvas.getOffset now runs a strict/quirks check and uses document.documentElement when calculating scrollTop and scrollLeft to avoid Chrome console warnings.
* The Time class now has its own Phaser.Timer which you can access through game.time.events. See the new Timer examples to show how to use them.
* Added StateManager.getCurrentState to return the currently running State object (thanks Niondir)
* Removed the console.log redirect from Utils as it was messing with Firefox.
* Body.acceleration is now much smoother and less eratic at high speeds.
* Removed ArcadePhysics binding to the QuadTree, so it can now be used independantly of the physics system.
* Removed ArcadePhysics.preUpdate and postUpdate as neither are needed any more.
* Body.bottom and Body.right are no longer rounded, so will give accurate sub-pixel values.
* Fixed lots of documentation in the Emitter class.
* The delta timer value used for physics calculations has had its cap limit modified from 1.0 to 0.05 in line with the core updates.
* Phaser.Math.min enhanced so you can now pass in either an array of numbers or lots of numbers as parameters to get the lowest.
* Phaser.Math.max added as the opposite of Math.min.
* Phaser.Math.minProperty and maxProperty added. Like Math.min/max but can be given a property an an array or list of objects to inspect.
* Added 'full' paramter to Body.reset, allowing you to control if motion or all data is reset or not.
* Exposed Group.pivot and Sprite.pivot to allow you to directly set the pivot points for rotation.
* Swapped to using the native and faster Array.isArray check.
* Added callback context parameter to Tween.onUpdateCallback(callback, context) to avoid having to bind or create anonymous functions.
* Updated TweenManager.removeAll so it flags all tweens as pendingDelete rather than nuking the array, to avoid tween callback array size errors (thanks DarkDev)

### Bug Fixes

* Cache.getImageKeys returned __missing in the array, now excluded.
* Fixed Group.scale so you can now scale a Group directly.
* Removed World.scale as it was preventing Group.scale from working - you can still scale the world, but you'll need to factor in Input changes yourself.
* Moved 'dirty' flag for Tilemap to a per-layer flag. Fixes #242
* Group.length now returns the number of children in the Group regardless of their exists/alive state, or 0 if the Group has no children.
* Switch Camera.setBoundsToWorld to match world.bounds instead of world (thanks cocoademon)
* Fixed an issue where passing null as the Group parent wouldn't set it to game.world as it should have (thanks tito100)
* Fixed Pixi bug (#425) incorrect width property for multi-line BitmapText (thanks jcd-as)
* Tween.onStart is now called when the tween starts AFTER the delay value, if given (thanks stevenbouma)
* Sprites that are fixedToCamera can now be input dragged regardless of world position (thanks RafaelOliveira)
* RenderTexture now displays correctly in Canvas games.
* Canvas.addToDOM is now more robust when applying the overflowHidden style.
* Fixed Pixi.StripShader which should stop the weird TileSprite GPU issues some were reporting (thanks GoodboyDigital)
* Patched desyrel.xml so it doesn't contain any zero width/height characters, as they broke Firefox 25.
* Cache.addSound now implements a locked attribute (thanks haden)
* Sound now checks for CocoonJS during playback to avoid readyState clash (thanks haden)
* Buttons now clear previously set frames correctly if you call setFrames.
* Sounds will now loop correctly if they are paused and resumed (thanks haden)
* InputHandler.checkBoundsRect and checkBoundsSprite now take into account if the Sprite is fixedToCamera or not.
* Removed the frame property from TileSprites as it cannot use them, it tiles the whole image only, not just a section of it.
* Fixed WebGLRenderer updateGraphics bug (thanks theadam)
* Removed duplicate Timer.create line (thanks hstolte)
* Fixed issue with the camera being slightly out of sync with 'fixedToCamera' sprites.
* 1px camera jitter issue fixed where map is same size, or smaller than the game size.



## Version 1.1.3 - "Arafel" - November 29th 2013

### New Features

* Phaser.Filter. A new way to use the new WebGL shaders/filters that the new version of Pixi supports.
* Phaser.BitmapData object. A Canvas you can freely draw to with lots of functions. Can be used as a texture for Sprites. See the new examples and docs for details.
* The entire Phaser library has been updated to match the new JSHint configuration.
* Added a .jshintrc so contributions can be run through JSHint to help retain formatting across the library (thanks kevinthompson)
* Added a new in-built texture. Sprites now use __default if no texture was provided (a 32x32 transparent PNG) or __missing if one was given but not found (a 32x32 black box with a green cross through it)
* Loader can now load JavaScript files. Just use game.load.script('key', 'url') - the file will be turned into a script tag in the document head on successful load.
* RenderTexture.render now takes a Phaser.Group. Also added renderXY for when you don't want to make a new Point object.
* Physics.overlap now supports Sprites, Groups or Emitters and can perform group vs. group (etc) overlap checks with a custom callback and process handler.
* Added Sound.externalNode which allows you to connect a Sound to an external node input rather than the SoundManager gain node.
* Added SoundManager.connectToMaster boolean. Used in conjunction with Sound.externalNode you can easily configure audio nodes to connect together for special effects.
* PluginManager.remove, added PluginManager.removeAll (thanks crazysam)
* scrollFactorX/scrollFactorY have been added to TilemapLayers (thanks jcd-as)
* Phaser.Game parent can now be an HTMLElement or a string (thanks beeglebug)
* Now using the latest version of Pixi.js. Which means you can use all the sexy new WebGL filters :)
* Sprite.animations.getAnimation will return an animation instance which was added by name.
* Added Mouse.button which is set to the button that was pressed: Phaser.Mouse.LEFT_BUTTON, MIDDLE_BUTTON or RIGHT_BUTTON (thanks wKLV)
* Added Mouse.pointerLock signal which you can listen to whenever the browser enters or leaves pointer lock mode.
* StageScaleMode.forceOrientation allows you to lock your game to one orientation and display a Sprite (i.e. a "please rotate" screen) when incorrect.
* World.visible boolean added, toggles rendering of the world on/off entirely.
* Polygon class & drawPolygon method added to Graphics (thanks rjimenezda)
* Added Group.iterate, a powerful way to count or return children that match a certain criteria. Refactored Group to use iterate, lots of repeated code cut.
* Added Group.sort. You can now sort the Group based on any given numeric property (x, y, health), finally you can do depth-sorting :) Example created to show.
* Enhanced renderTexture so it can accept a Phaser.Group object and improved documentation and examples.
* Device.littleEndian boolean added. Only safe to use if the browser supports TypedArrays (which IE9 doesn't, but nearly all others do)
* You can now call game.sound.play() and simply pass it a key. The sound will play if the audio system is unlocked and optionally destroy itself on complete.
* Mouse.capture is a boolean. If set to true then DOM mouse events will have event.preventDefault() applied, if false they will propogate fully.
* The object returned by Math.sinCosGenerator now contains a length property.

### Updates

* Lots of documentation fixes and updates across nearly all files. Tilemap now documented for example and lots of instances of 'Description' filled out.
* ArcadePhysics.updateMotion applies the dt to the velocity calculations as well as position now (thanks jcs)
* RequestAnimationFrame now retains the callbackID which is passed to cancelRequestAnimationFrame.
* Button now goes back to over state when setFrames used in action (thanks beeglebug)
* plugins now have a postUpdate callback (thanks cocoademon)
* Tided up the Graphics object (thanks BorisKozo)
* If running in Canvas mode and you have a render function it will save the context and reset the transform before running your render function.
* Sprite will now check the exists property of the Group it is in, if the Group.exists = false the Sprite won't update.
* If you specify 'null' as a Group parent it will now revert to using the World as the parent (before only 'undefined' worked)
* Skip preupdate/update for PIXI hierarchies in which an ancestor doesn't exist (thanks cocoademon)
* Loader.audio can now accept either an array of URL strings or a single URL string (thanks crazysam + kevinthompson)
* MSPointer updated to support IE11 by dropping the prefix from the event listeners.
* Device.cocoonJS added to detect if the game is running under Cocoon or a native browser.
* Loader now uses a new queue system internally, meaning you can have assets with the same key spread across different types.

### Bug Fixes

* Lots of fixes to the TypeScript definitions file (many thanks gltovar)
* Tilemap commands use specified layer when one given (thanks Izzimach)
* Mouse.stop now uses the true useCapture, which means the event listeners stop listening correctly (thanks beeglebug)
* Input Keyboard example fix (thanks Atrodilla)
* BitmapText.destroy now checks if it has a canvas before calling parentNode on it.
* Group.swap had a hellish to find bug that only manifested when B-A upward swaps occured. Hours of debugging later = bug crushed.
* Point.rotate asDegrees fixed (thanks BorisKozo)
* ArcadePhysics.separateTile wasn't returning the value, so the custom process callback wasn't getting called (thanks flameiguana)
* StageScaleMode.forceOrientation now correctly stores the forcePortrait value (thanks haden)
* Fixes to Math and Loader (thanks theJare)
* Tween - isRunning not reset when non-looped tween completes (thanks crazysam + kevinthompson)
* Math.normalizeAngle and Math.wrapAngle (thanks theJare)
* Device.isTouch modified to test maxTouchPointers instead of MSPointer.
* InputHandler.checkPointerOver now checks the visible status of the Sprite Group before processing.
* The Sprite hulls (used for tile collision) were not being updated in sprite->sprite separations (thanks jcs)
* Plugins that had a postUpdate but no Update weren't being marked as active (thanks crazysam)
* StateManager.onPausedCallback function is not called when the game is paused (thanks haden)
* Fix for 'jitter' in scrolling where tilemaps & sprites are one frame off (thanks jcs)



## Version 1.1.2 - November 1st 2013

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



## Version 1.1.1 - October 26th 2013

* Quick patch to get Phaser.AUTO working again on Firefox / Android.
* Any key added via addKey now automatically adds it to the capture list.



## Version 1.1 - October 25th 2013

### What's New

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

### What's changed

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

### What has been updated:

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

### What has been fixed:

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



## Version 1.0.6 - September 24th 2013

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



## Version 1.0.5 - September 20th 2013

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



## Version 1.0.4 - September 18th 2013

* Small fix to Phaser.Canvas to stop it from setting overflow hidden if the parent DOM element doesn't exist.
* Added Loader.setPreloadSprite(sprite, direction) - this will automatically apply a crop rect to the Sprite which is updated in line with the load progress.
* A lot of changes inside the StateManager. State functions are now passed through link() which automatically creates the key Game properties (load, input, etc)
* Fixed a bug in getFrameByName that wouldn't return the first frame in the array.
* Updated Phaser.Rectangle.intersects to use x and y instead of left and top so it can be used to check Physics bodies overlapping.
* Fixed issue in Cache where the Frame index wasn't being set correctly (thanks Cameron)
* Fixed issue in Sprite where boundsY wasn't set (thanks Cameron)
* For some reason there were 2 copies of the Canvas class in the build file - fixed, a few KB saved :)



## Version 1.0.3 - September 17th 2013

* FrameData.getFrameIndexes and getFrameIndexesByName refactored into a more versatile getFrames function.
* Various fixes to looping parameters in the Sound system.
* Documentation started across most classes. Keep track of progress in the Docs folder.
* Optimised AnimationManager.add so it will only get the required frames rather than all of them and is now faster at parsing the frame data.
* Fixed Phaser.Text and Phaser.BitmapText so they now render correctly and added several Text examples.



## Version 1.0.2 - September 16th 2013

* Added optional parameter to Animation.stop: resetFrame. If true the animation will be stopped and then the current frame reset to the first frame in the animation.
* Fixed an issue causing 'explode' particle bursts to ignore the quantity parameter.
* Added 'collideWorldBounds' to Emitter.makeParticles function.
* Added Emitter.angularDrag
* Changed Emitter.bounce from a number to a Point, so now set its x/y properties to control different amounts of bounce per axis.
* Fixed a bug in the AnimationManager where useNumericIndex was always set to true
* Added in lots of Particle examples
* Added in the start of a Breakout game
* Added in the start of a Platformer game



## Version 1.0.1 - September 15th 2013

* Added checks into every Group function to ensure that the Group has children before running them.
* Added optional flag to Group.create which allows you to set the default exists state of the Sprites.
* Sprite.animation.stop no longer needs an animation name parameter, will default to stopping the current animation.
* Fixed the license in package.json
* Fixed a logic bug in the separateTileX function that would sometimes cause tunneling of big sprites through small tiles.



## Version 1.0 - September 13th 2013

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



## Version 0.9.6 - 24th May 2013

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



## Version 0.9.5 - 28th April 2013

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



## Version 0.9.4 - 28th April 2013

* Added Tilemap.getTile, getTileFromWorldXY, getTileFromInputXY
* Added Tilemap.setCollisionByIndex and setCollisionByRange
* Added GameObject.renderRotation boolean to control if the sprite will visually rotate or not (useful when angle needs to change but graphics don't)
* Added additional check to Camera.width/height so you cannot set them larger than the Stage size
* Added Collision.separateTile and Tilemap.collide
* Fixed Tilemap bounds check if map was smaller than game dimensions
* Fixed: Made World._cameras public, World.cameras and turned Game.camera into a getter for it (thanks Hackmaniac)
* Fixed: Circle.isEmpty properly checks diameter (thanks bapuna)
* Updated Gruntfile to export new version of phaser.js wrapped in a UMD block for require.js/commonJS (thanks Hackmaniac)



## Version 0.9.3 - 24th April 2013

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



## Version 0.9.2 - 20th April 2013

* Fixed issue with create not being called if there was an empty init method.
* Added ability to flip a sprite (Sprite.flipped = true) + a test case for it.
* Added ability to restart a sprite animation.
* Sprite animations don't restart if you call play on them when they are already running.
* Added Stage.disablePauseScreen. Set to true to stop your game pausing when the tab loses focus.



## Version 0.9.1 - 19th April 2013

* Added the new align property to GameObjects that controls placement when rendering.
* Added an align example to the Sprites test group (click the mouse to change alignment position)
* Added a new MicroPoint class. Same as Point but much smaller / less functions, updated GameObject to use it.
* Completely rebuilt the Rectangle class to use MicroPoints and store the values of the 9 points around the edges, to be used
for new collision system.
* Game.Input now has 2 signals you can subscribe to for down/up events, see the Sprite align example for use.
* Updated the States examples to bring in-line with 0.9 release.



## Version 0.9 - 18th April 2013

* Large refactoring. Everything now lives inside the Phaser module, so all code and all tests have been updated to reflect this. Makes coding a tiny bit more verbose but stops the framework from globbing up the global namespace. Also should make code-insight work in WebStorm and similar editors.
* Added the new GeomSprite object. This is a sprite that uses a geometry class for display (Circle, Rectangle, Point, Line). It's extremely flexible!
* Added Geometry intersection results objects.
* Added new Collision class and moved some functions there. Contains all the Game Object and Geometry Intersection methods.
* Can now create a sprite animation based on frame names rather than indexes. Useful when you've an animation inside a texture atlas. Added test to show.
* Added addKeyCapture(), removeKeyCapture() and clearCaptures() to Input.Keyboard. Calls event.preventDefault() on any keycode set to capture, allowing you to avoid page scrolling when using the cursor keys in a game for example.
* Added new Motion class which contains lots of handy functions like 'moveTowardsObject', 'velocityFromAngle' and more.
* Tween Manager added. You can now create tweens via Game.createTween (or for more control game.tweens). All the usual suspects are here: Bounce, * Elastic, Quintic, etc and it's hooked into the core game clock, so if your game pauses and resumes your tweens adjust accordingly.



## Version 0.8 - 15th April 2013

* Added ability to set Sprite frame by name (sprite.frameName), useful when you've loaded a Texture Atlas with filename values set rather than using frame indexes.
* Updated texture atlas 4 demo to show this.
* Fixed a bug that would cause a run-time error if you tried to create a sprite using an invalid texture key.
* Added in DynamicTexture support and a test case for it.



## Version 0.7 - 14th April 2013

* Renamed FullScreen to StageScaleMode as it's much more fitting. Tested across Android and iOS with the various scale modes.
* Added in world x/y coordinates to the input class, and the ability to get world x/y input coordinates from any Camera.
* Added the RandomDataGenerator for seeded random number generation.
* Setting the game world size now resizes the default camera (optional bool flag)



## Version 0.6 - 13th April 2013

* Added in Touch support for mobile devices (and desktops that enable it) and populated x/y coords in Input with common values from touch and mouse.
* Added new Circle geometry class (used by Touch) and moved them into a Geom folder.
* Added in Device class for device inspection.
* Added FullScreen class to enable full-screen support on mobile devices (scrolls URL bar out of the way on iOS and Android)



## Version 0.5 - 12th April 2013

* Initial release
