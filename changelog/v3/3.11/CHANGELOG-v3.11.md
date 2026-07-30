# Phaser 3 Change Log

## Version 3.11.0 - Leafa - 13th July 2018

### Camera - New Features, Updates and Fixes

* All of the 2D Camera classes are now 100% covered by JSDocs!
* All of the 3D Camera classes are now deprecated and will be removed in the next version. They will be moved to a stand-alone plugin.
* `Camera.alpha` (and its related method `Camera.setAlpha`) allows you to set an alpha level for the entire camera. This impacts everything it is rendering, even if those objects also have their own alpha values too. You can tween the property to make the camera contents fade in / out, or otherwise set it as needed in your game.
* `Camera.deadzone` (and its related method `Camera.setDeadzone`) allows you to specify the deadzone for a camera. The deadzone is a rectangular region used when a camera is following a target. If the target is within the deadzone then the camera will not scroll. As soon as the target leaves the deadzone, the camera will begin tracking it (applying lerp if needed.) It allows you to set a region of the camera in which a player can move freely before tracking begins. The deadzone is re-centered on the camera mid point every frame, meaning you can also use the rectangle for other in-game checks as needed.
* `Camera.pan` is a new Camera Effect that allows you to control automatic camera pans between points in your game world. You can specify a duration and ease type for the pan, and it'll emit events just like all other camera effects, so you can hook into the start, update and completion of the pan. See the examples and docs for more details.
* `Camera.zoom` is a new Camera Effect that allows you to control automatic camera zooming. You can specify a duration and ease type for the zoom, as well as the zoom factor of course, and it'll emit events just like all other camera effects, so you can hook into the start, update and completion of the zoom. Used in combination with the new Pan effect you can zoom and pan around with ease. See the examples and docs for more details.
* `Camera.midPoint` is a new Vec2 property that is updated every frame. Use it to obtain exactly where in the world the center of the camera is currently looking.
* `Camera.displayWidth` is a new property that returns the display width of the camera, factoring in the current zoom level.
* `Camera.displayHeight` is a new property that returns the display height of the camera, factoring in the current zoom level.
* `Camera.worldView` is a new property, an instance of a Rectangle, that contains the dimensions of the area of the world currently visible by the camera. You can use it for intersection or culling tests that don't need to factor in camera rotation.
* `Camera.dirty` is a new boolean property. A dirty Camera has had either its viewport size, bounds, scroll, rotation or zoom levels changed since the last frame. The flag is reset in the `postCameraRender` method, but until that point can be checked and used.
* `Camera.centerOn` is a new method that will move the camera so its viewport is centered on the given coordinates. A handy way of jumping to different points around a map without needing to calculate the scroll offsets.
* The Camera bounds didn't factor in the camera zoom properly, meaning you would often not be able to reach the corners of a camera bound world at a zoom level other than 1. The bounds are now calculated each frame to ensure they match the zoom level and it will no longer allow you to scroll off the edge of the bounds. Fix #3547 (thanks @nkholski)
* `Camera.centerToBounds` didn't take the bounds offset into account, so bounds at non-zero positions wouldn't center properly. All bounds now center correctly. Fix #3706 (thanks @cyantree)
* `Camera.setBounds` has a new optional argument `centerOn`. If specified it will automatically center the camera on the new bounds given.
* The Camera will no longer stutter when following Game Objects at high zoom levels.
* `Camera._id` has been renamed to `Camera.id`, a read-only bitmask used for camera exclusion from Game Objects.
* The Camera Manager `cameraPool` has been removed entirely. It was mostly pointless in practice as Cameras are not regenerated frequently enough to need pooling. It also didn't maintain the bitmask list correctly before.
* `CameraManager.resetAll` now destroys all current Cameras, resets the camera ID marker to 1 and adds a single new Camera.
* `CameraManager.currentCameraId` has been removed. IDs are assigned more intelligently now, via the `getNextID` internal method.
* `CameraManager.addExisting` no longer needs to be passed a Camera that already exists in the pool (as the pool has been removed), meaning you can now create your own Cameras and pass them to `addExisting` and have them treated as normal cameras and not be ignored by the manager. They are also assigned a proper ID when added.
* `CameraManager.addExisting` has a new boolean argument `makeMain` which will make the new camera the main one.
* `CameraManager.getTotal` is a new method that will return the total number of Cameras being managed, with an optional `isVisible` argument, that only counts visible cameras if set.
* `CameraManager.remove` can now take an array of cameras to be removed from the manager, as well as a single camera.
* `CameraManager.remove` would previously not allow you to remove a camera if it meant there would be no cameras left in the Camera Manager. This restriction has been removed. A Camera Manager can now run even with zero cameras. Your game obviously won't display anything, but it's still now possible.
* `CameraManager.remove` will now return the total number of Cameras removed.

### Round Pixels Changes

Before explaining the changes it's worth covering what the three different game config properties do:

`roundPixels` - this will cause the renderer to draw most Game Objects at whole integer positions. Their actual positions can be anything, but the renderer will floor the values to ensure they are integers immediately before drawing. It only works on texture based Game Objects. Graphics objects, for instance, ignore this property.

`antialias` - when set to `true` WebGL textures are created using `gl.LINEAR`, which allows WebGL to try its best to interpolate the texture when rendered at non-texture frame sizes. This can happen if you scale a Game Object, or zoom a Camera. In both cases it will need to interpolate the pixel values to accommodate the new size. If this property is set to `false` then it will use `gl.NEAREST` instead. This uses a nearest neighbor method of interpolation, and is nearly always the better option if you need to keep the textures crisp, such as when using scaled pixel art. Disabling `antialias` invokes nearest-neighbor interpolation on the game canvas itself as well. If you need a mixture of aliased and anti-aliased textures in your game, then you can change them on a per-texture basis by using `Texture.setFilter`.

There is a third game config property called `pixelArt`. If set to `true` it's the same thing as enabling `roundPixels` and disabling `antialias`. This is the optimum setting for pixel art games.

* Both renderers will now check for `pixelArt` OR `antialias` before setting the canvas scale mode. Both values are checked during texture creation as well.
* If in your game config you have enabled either pixel art mode or roundPixels, then all Cameras will have their `roundPixels` values set to `true` by default. You can toggle this by changing the `CameraManager.roundPixels` property, or change it on a camera-by-camera basis, as needed.
* `Camera.roundPixels` is now used across all rendering code for both Canvas and WebGL. Previously, it would check the renderer config value, but now all renderer code uses the camera value to decide if it should floor the drawing position or not.

### Texture Tint Pipeline - New Features, Updates and Fixes

The Texture Tint Pipeline has been rewritten to tidy up hundreds of lines of duplicate code and to move the responsibility of drawing to the Game Objects themselves. Previously, had you excluded say Tilemaps from your build of Phaser, the renderer would still include masses of code dealing with the drawing of them. This task has been moved to the Game Objects and the pipeline just provides a set of clean utility functions for batching, flushing and drawing.

The decision to make this change was not taken lightly. However, I felt that none of the pipelines actually lived up to their name. You could never actually pass objects through one pipeline to another as they didn't have entry and exit points and were instead just glorified singular batches. Although you could change the pipeline being used on a Game Object this action meant that every pipeline had to be responsible for every single type of Game Object, both now and in the future, and they were full of redundant stub functions as a result. The payload size was also considerable. It has now gone from 1,961 lines of code at 76 KB down to 729 lines of code and 27 KB. It's not the only file to benefit either. The `ForwardDiffuseLightPipeline` also reduced from 402 lines (15.7 KB) down to 159 lines and 6 KB. Sizes include comments and are un-minified. In a production bundle the difference will be even greater. This is work we will continue in the next release as we do the same updates to the FlatTintPipeline, responsible for rendering Graphics objects, and look at consolidating the shaders allowing you to use Graphics and Sprites mixed in the display list with no shader swapping cost.

* You can now set the WebGL batch size in the Game Config via the property `batchSize`. The default is 2000 before the batch will flush, which is a happy average between desktop and mobile. If targeting desktop specifically, you may wish to increase this value to reduce draw calls.
* There is a new method `batchVertices` which will add a vertices block to the current batch. This is now used internally by nearly all render functions.
* The shader has a new attribute: `tintEffect`. This is a single FLOAT.
* The vertex size has increased by 1 FLOAT to account for the extra shader attribute.
* All of the rendering functions now use the `TransformMatrix` class far more than before. This allows the matrix operations to be run-time compiled and cut down on masses of code.
* The `drawTexture` method has been removed. It has been replaced by `drawTextureFrame` which has a new and more concise signature. See the API docs for details.
* The `batchTileSprite` method has been removed. It is now handled in the TileSprite WebGL Render function.
* The `drawStaticTilemapLayer` method has been removed. It is now handled in the Static Tilemap Layer WebGL Render function.
* The `drawEmitterManager` method has been removed. It is now handled in the Particle Manager WebGL Render function.
* The `batchText` method has been removed. It is now handled in the Static Text WebGL Render function.
* The `batchDynamicTilemapLayer` method has been removed. It is now handled in the Dynamic Tilemap Layer WebGL Render function.
* The `batchMesh` method has been removed. It is now handled in the Mesh WebGL Render function.
* The `batchBitmapText` method has been removed. It is now handled in the BitmapText WebGL Render function.
* The `batchDynamicBitmapText` method has been removed. It is now handled in the DynamicBitmapText WebGL Render function.
* The `batchBlitter` method has been removed. It is now handled in the Blitter WebGL Render function.

Due to the changes in the Texture Tint Pipeline the `Textures.Frame` class has also been updated. The following changes concern the Frame UV data:

* Previously, the UV data spanned 8 properties: `x0`, `y0`, `x1`, `y1`, `x2`, `y2`, `x3` and `y3` and was stored in the `data.uvs` object. These have been replaced with directly accessible properties: `u0`, `v0`, `u1` and `v1`. These 4 properties are used directly in all renderer code now. Although it was clearer having 8 properties, 4 of them were just duplicates, so we've traded a little clarity for a smaller overall object and less dictionary look-ups.
* `Frame.uvs` (and the corresponding `Frame.data.uvs`) object has been removed.

### New Tint Effects

As well as tidying the Texture Tint Pipeline, I also updated the shader. It now has a new attribute 'tintEffect' which allows you to control how a tint is applied to a Game Object. The default way tinting worked was for the tint color values to be multiplied with the texture pixel values. This meant you were unable to do things like tint a Game Object white, because multiplying a color by white doesn't change it. The new tint mode allows you to literally replace the pixel color values.

* `setTintFill` is a new method available to all Game Objects that have the Tint component. It differs from `setTint` in that the colors literally replace the pixel values from the texture (while still respecting the alpha). This means you can now create effects such as flashing a sprite white if it gets hit, or red for damage, etc. You can still use different colors per corner of the Game Object, allowing you to create nice seamless gradient effects.
* `tintFill` is a new boolean property that allows you to toggle between the two different tint types: multiply or replace.
* `isTinted` is a new read-only boolean indicating if a Game Object is tinted or not. Handy for knowing if you need to clear a tint after an effect.
* `Mesh.tintFill` allows you to control the tint effect applied to the Mesh vertices when color blending.

The Tint component documentation has been overhauled to explain these differences in more detail, and you can find lots of new examples as well.

### New Texture Crop Component

There is a new Game Object Component called `TextureCrop`. It replaces the Texture Component (which still exists) and adds in the ability to crop the texture being used. This component is now being used by the `Sprite` and `Image` Game Objects.

* You can crop the frame being used via the new `setCrop` method. The crop is a rectangle that limits the area of the texture frame that is visible during rendering. Cropping a Game Object does not change its size, dimensions, physics body or hit area, it just changes what is shown when rendered. This is ideal for hiding part of a Sprite without using a mask, or for effects like displaying a progress or loading bar. Cropping works even when the Game Object is flipped, or is a trimmed frame from an atlas.
* You can toggle the crop on a Game Object by changing the `isCropped` boolean at any point.
* The crop is automatically re-applied when the texture or frame of a Game Object is changed. If you wish to disable this, turn off the crop before changing the frame.

### BitmapText New Features, Updates and Bug Fixes

* Multi-line BitmapText objects can now be aligned. The constructor has a new argument `align` which can accept either left-aligned (the default), center aligned, or right-aligned. Alignment works by calculating the longest line of text in the object and then offsetting the other lines to match it.
* `BitmapText.setCenterAlign` is a new chainable method to center-align the text.
* `BitmapText.setLeftAlign` is a new chainable method to left-align the text.
* `BitmapText.setRightAlign` is a new chainable method to right-align the text.
* `BitmapText.align` is a new property that holds the alignment of the text.
* `BitmapText.setFont` is a new method that allows you to change the font it is rendering with.
* Internally all of the BitmapText properties have been renamed with an underscore (i.e. `letterSpacing` is now `_letterSpacing`), so as to not change the API, getters and setters for them all have been added.
* Internally there is a new `dirty` flag that tracks if any part of the BitmapText has changed. This is used when getting the BitmapText's bounds object, as used in the renderer for line alignment, and in properties like `width` and `height`. The dirty flag ensures the bounds are only recalculated if something has changed, cutting down on un-necessary calculations.
* `GetBitmapTextSize`, which is used internally in the BitmapText Game Objects, will now produce different bounds from the previous version. Previously, the bounds were tight against the letters in the text. However, this meant the bounds were not properly aligned with the origin of the BitmapText, and consequently you'd get different bounds if the text consisted of different characters. The bounds are now calculated purely based on the glyph data and letter spacing values. This will give a far more consistent overall experience, but it does mean if you were using the bounds to position text previously, you'll need to revisit that code again. See issue #3799 for more details (and to discuss this further if you wish) (thanks @SBCGames)
* `GetBitmapTextSize` and its exposed method `BitmapText.getTextBounds` now factor in the display origin of the BitmapText into the `global` position returned.
* The `BitmapText` WebGL Renderer incorrectly calculated the font scale at very small sizes, causing characters to overlap when they shouldn't. Scale is now applied to the correct component parts in the render code.
* Under WebGL `BitmapText` would be cut off if you specified a resolution value > 1. Fix #3642 (thanks @kanthi0802)
* Under WebGL, `DynamicBitmapText` that had a crop set on it would fail to render if anything was above it on the display list. It now crops properly, no matter what is above or below it on the display list.
* The `DynamicBitmapText` class now extends the `BitmapText` class. This saves on lots of space in the bundle and consolidates functionality between the two. Please be aware of it if you have classes that extend either of them.
* If you were using the `displayCallback` in the `DynamicBitmapText` class it would generate a brand new object containing all the glyph data, every frame, for every glyph, and send it to the callback. This has been changed so it now uses a new cached local object: `callbackData`. This object is recycled for every glyph, stopping un-needed gc from building up.

### Dynamic Tilemap Layer New Features, Updates and Bug Fixes

* `DynamicTilemapLayer.tilesDrawn` is a read-only property that contains the number of tiles sent to the renderer in the previous frame.
* `DynamicTilemapLayer.tilesTotal` is a read-only property that contains the total number of tiles in the layer, updated every frame.
* `DynamicTilemapLayer.skipCull` and its associated chainable method `setSkipCull` allows you to control if the cameras should cull the layer tiles before rendering them or not. By default they will cull, to avoid over-rendering, but in some circumstances you may wish to disable this and can now do so by toggling this property.
* The `CullTiles` component, as used by the Dynamic Tilemap, has been recoded from scratch to take advantage of updates in the Camera system. It will now properly cull tiles, irrespective of the layer scale, or camera zoom. It also now supports the layers `skipCull` property, allowing you to override the culling. The Dungeon Generator labs demo now works again as a result of this fix, and has been updated with a debug mode and camera control UI. You can edit the example source to swap between 4 different dungeon layouts, from 2500 tiles up to 1 million tiles. There are limitations to the way the culling works though. If you rotate the camera you may find you see the cull edge. You can disable this using the new `skipCull` property. Fixing this also fixed #3818 (thanks @Mursaat)
* `DynamicTilemapLayer.cullPaddingX`, `cullPaddingY` and the associated chainable method `setCullPadding` allows you to control how many additional tiles are added into the cull rectangle when it is calculated. If you find that your camera size and zoom settings are causing tiles to get prematurely culled, resulting in clipping during scrolling, then set the `cullPadding` values to add extra layers of tiles to the calculations in both directions without needing to disable culling entirely.
* `DynamicTilemapLayer.cullCallback` allows you to change the function that is used to perform the tile culling. By default it will call `TilemapComponents.CullTiles` but you can override this to call any function you like. It is sent 3 arguments: the layer data, the camera and the array to store the tiles in. Using this feature you can now create whatever culling system you require, should the default one prove to not be suitable for your game. Fix #3811 (thanks @georgzoeller)
* Dynamic Tilemap Layers now properly support the Lights2D Pipeline. This means you can provide a normal map for the layer tileset and it'll illuminate with the Lights shader properly. See the new `light map` example in the labs for a demonstration. Note that there are limits on the number of tiles that can be rendered with lighting enabled. Fix #3544 (thanks @FrancescoNegri)

### New Features

* `Graphics.fillRoundedRect` will draw a stroked rounded rectangle to a Graphics object. The radius of the corners can be either a number, or an object, allowing you to specify different radius per corner (thanks @TadejZupancic)
* `Graphics.strokeRoundedRect` will draw a filled rounded rectangle to a Graphics object. The radius of the corners can be either a number, or an object, allowing you to specify different radius per corner (thanks @TadejZupancic)
* `ParticleEmitter.stop` is a new chainable method to stop a particle emitter. It's the same as setting `on` to `false` but means you don't have to break the method flow to do so (thanks @samme)
* `ScenePlugin.pause` (and the corresponding methods in Scene Systems and the Scene Manager) now has a new optional `data` argument, which is passed to the target Scene and emitted in its 'pause' event.
* `ScenePlugin.resume` (and the corresponding methods in Scene Systems and the Scene Manager) now has a new optional `data` argument, which is passed to the target Scene and emitted in its 'resume' event.
* `ScenePlugin.sleep` (and the corresponding methods in Scene Systems and the Scene Manager) now has a new optional `data` argument, which is passed to the target Scene and emitted in its 'sleep' event.
* `ScenePlugin.wake` (and the corresponding methods in Scene Systems and the Scene Manager) now has a new optional `data` argument, which is passed to the target Scene and emitted in its 'wake' event.
* `ScenePlugin.setActive` now has a new optional `data` argument, which is passed to the target Scene and emitted in its 'pause' or 'resume' events.
* `TileSprite.tileScaleX` and `tileScaleY` are two new properties that allow you to control the scale of the texture within the Tile Sprite. This impacts the way the repeating texture is scaled, and is independent to scaling the Tile Sprite itself. It works in both Canvas and WebGL mode.
* `TransformMatrix.copyFrom` is a new method that will copy the given matrix into the values of the current one.
* `TransformMatrix.multiplyWithOffset` is a new method that will multiply the given matrix with the current one, factoring in an additional offset to the results. This is used internally by the renderer code in various places.
* `Rectangle.Intersection` will take two Rectangle objects and return the area of intersection between them. If there is no intersection, an empty Rectangle is returned.
* `Pointer.prevPosition` is a new Vector2 that stores the previous position of the Pointer, prior to the most recent DOM event. You can use this when performing calculations between the old and current positions, such as for tracking the pointer speed.
* `Pointer.getInterpolatedPosition` is a new method that will return an array of smoothly interpolated values between the old and previous position of the Pointer. You can configure how many interpolation steps should take place (the default is 10) and provide an output array to store them in. This method is handy if you've got an object tracking a pointer and you want to ensure it has smooth movement (as the DOM will often process pointer events at a faster rate than the game loop can update).
* `TransformMatrix.copyFromArray` will populate a matrix from the given array of values. Where 0, 1, 2, 3, 4 and 5 map to a, b, c, d, e and f.
* `WebGLPipeline` has a new over-rideable method called `boot` which is called when the renderer and all core game systems have finished being set-up.
* `KeyboardPlugin.checkDown` is a new method that allows you to check if a Key is being pressed down or not in an update loop. The difference between this method and checking the `Key.isDown` property directly is that you can provide a duration to this method. For example, if you wanted a key press to fire a bullet, but you only wanted it to be able to fire every 100ms, then you can call this method with a `duration` of 100 and it will only return `true` every 100ms.

### Updates

* DataManager.removeValue (and by extension the `remove` method too) will not emit the parent of the DataManager as the 2nd argument in the `removedata` event, to keep it consistent with the set events (thanks @rexrainbow)
* The docs for the Loader `filecomplete` event said that you could listen for a specific file using its type and key, i.e.: `filecomplete-image-monster`, however, the code used an underscore instead of a hyphen. We feel the hyphen looks cleaner, so the Loader code has been updated, meaning you can now use the hyphen version of the event properly (thanks @NokFrt)
* If a Game Object is already being dragged, it cannot be dragged by another pointer (in multi-touch mode) until the original pointer has released it (thanks @rexrainbow)
* Calling `Tween.play` on a tween created via `TweenManager.create` wouldn't actually start playback until the tween was first added to the Tween Manager. Now, calling `play` will have it automatically add itself to the Tween Manager if it's not already in there. Fix #3763 (thanks @pantoninho)
* If the Blitter object has no Bobs to render it will now abort immediately, avoiding several context calls in Canvas mode.
* `Scene.run` will now pass the optional `data` object in all cases, no matter if it's waking, resuming or starting a Scene (thanks @rook2pawn)
* `ScenePlugin.start` and `ScenePlugin.restart` will now always queue the op with the Scene Manager, regardless of the state of the Scene, in order to avoid issues where plugins carry on running for a frame before closing down. Fix #3776 (thanks @jjalonso)
* `Tileset.glTexture` is a new property that maps to the WebGL Texture for the Tileset image. It's used internally by the renderer to avoid expensive object look-ups and is set automatically in the `Tileset.setImage` method.
* `Frame.glTexture` is a new property that maps to the WebGL Texture for the Frames Texture Source image. It's used internally by the renderer to avoid expensive object look-ups and is set automatically in the `Frame` constructor.
* `TransformMatrix.e` and `TransformMatrix.f` are two new properties that are an alias for the `tx` and `ty` values.
* `Graphics.arc` has a new optional argument `overshoot`. This is a small value that is added onto the end of the `endAngle` and allows you to extend the arc further than the default 360 degrees. You may wish to do this if you're trying to draw an arc with an especially thick line stroke, to ensure there are no gaps. Fix #3798 (thanks @jjalonso)
* The TextureManager Sprite Sheet Parser will now throw a concise console warning if you specify invalid frame sizes that would result in no frames being generated (thanks @andygroff)
* The `Quad` Game Object now has a new `setFrame` method that allows you to change the frame being rendered by the Quad, including using frames that are part of a texture atlas. Fix #3161 (thanks @halgorithm)
* The `ScenePlugin` will now queue all of the following ops with the Scene Manager: `start`, `run`, `pause`, `resume`, `sleep`, `wake`, `switch` and `stop`. This means for all of these calls the Scene Manager will add the call into its queue and process it at the start of the next frame. This fixes #3812 and keeps things more predictable (thanks @Waclaw-I)
* `TransformMatrix.multiply` has a new optional argument `out` which is a matrix to store the multiplication results in. If not given it will act as before, multiplying the current matrix.
* `Zones` now have a NOOP `setAlpha` method, which allows them to be added into Containers (thanks @TadejZupancic)
* The `setPipeline` method now returns the instance of the Game Object on which it was called. It used to return the pipeline that was set, but this made it non-chainable which broke with the conventions set in all the other `set` methods. If you use `setPipeline` in your code anywhere to retrieve the pipeline reference, please use the `pipeline` property of the Game Object instead.

### Bug Fixes

* The DataManager `changedata` event was emitting the original value of the data instead of new value (thanks @iamchristopher) 
* The LoaderPlugin didn't emit the `filecomplete` event if any of files failed to load, causing it to fail to run the Scene `create` function as well. Fix #3750 (thanks @NokFrt)
* Fix setter calls in BuildGameObjectAnimation so it will now properly set the delay, repeat, repeat delay and yoyo of a config based animation (thanks @DannyT)
* The Arcade Body `blocked.none` property is now set to `false` after separation with static bodies or tiles. Previously, the blocked direction was set correctly, but the `none` remained `true` (thanks @samme)
* `Bob.setFrame` didn't actually set the frame on the Bob, now it does. Fix #3774 (thanks @NokFrt)
* `Bob.alpha` was ignored by the canvas renderer, only working in WebGL. This has now been fixed.
* Although the Blitter object had the Alpha component, setting it made no difference. Setting Blitter alpha now impacts the rendering of all children, in both Canvas and WebGL, and you can also specify an alpha per Bob as well.
* `SceneManager.run` would ignore scenes that are currently in the queue of scenes pending to be added. This has now been fixed so that the scene is queued to be started once it's ready (thanks @rook2pawn)
* `GameObject.disableInteractive` was toggling input. Every second call would turn the input back on (thanks @TadejZupancic)
* The position of the TilemapLayer wasn't taken into account when culling tiles for the Camera. It's now calculated as part of the cull flow (thanks @Upperfoot)
* Fix extra argument passing in Array.Each (thanks @samme)
* TileSprite was using the Size component instead of ComputedSize, meaning its `getBounds` and `displayWidth` and `displayHeight` results were incorrect. Fix #3789 (thanks @jjalonso)
* `ArrayUtils.AddAt` didn't calculate the array offset correctly if you passed an array in to be merged with an existing array. This also caused Container.addAt to fail if an array was passed to it. Fix #3788 (thanks @jjalonso)
* The `Pointer.camera` property would only be set if there was a viable Game Object in the camera view. Now it is set regardless, to always be the Camera the Pointer interacted with.
* Added the Mask component to Container. It worked without it, but this brings it in-line with the documentation and other Game Objects. Fix #3797 (thanks @zilbuz)
* The DataManager couldn't redefine previously removed properties. Fix #3803 (thanks @AleBles @oo7ph)
* The Canvas DrawImage function has been recoded entirely so it now correctly supports parent matrix and camera matrix calculations. This fixes an issue where children inside Containers would lose their rotation, and other issues, when in the Canvas Renderer. Fix #3728 (thanks @samid737)
* `clearMask(true)` would throw an exception if the Game Object didn't have a mask. Now it checks first before destroying the mask. Fix #3809 (thanks @NokFrt)
* In the WebGL `GeometryMask` the stencil has been changed from `INVERT` to `KEEP` in order to fix issues when masking Graphics objects and other complex objects. Fix #3807. This also fixes the issue where children in Containers would display incorrectly outside of a Geometry mask. Fix #3746 (thanks @zilbuz @oklar)
* `BitmapMask.destroy` will now remove the textures and framebuffers that it created from the WebGL Renderer as part of the destroy process. Fix #3771 (thanks @nunof07)

### Examples, Documentation and TypeScript

My thanks to the following for helping with the Phaser 3 Examples, Docs and TypeScript definitions, either by reporting errors, fixing them or helping author the docs:

@DannyT @squilibob @dvdbrink @t1gu1 @cyantree @DrevanTonder @mikewesthad @tarsupin @shadowofsoul

Also, a special mention to @andygroff for his excellent work enhancing the search box on the examples site, and @hexus for his assistance completing the documentation for the Game Objects.
