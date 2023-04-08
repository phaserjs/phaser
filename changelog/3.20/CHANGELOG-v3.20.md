# Phaser 3 Change Log

## Version 3.20.0 - Fitoria - 11th October 2019

### Video Game Object

This is a new Game Object is capable of handling playback of a previously loaded video from the Phaser Video Cache,
or playing a video based on a given URL. Videos can be either local, or streamed:

```javascript
preload () {
  this.load.video('pixar', 'nemo.mp4');
}

create () {
  this.add.video(400, 300, 'pixar');
}
```

To all intents and purposes, a video is a standard Game Object, just like a Sprite. And as such, you can do
all the usual things to it, such as scaling, rotating, cropping, tinting, making interactive, giving a
physics body, etc.

Transparent videos are also possible via the WebM file format. Providing the video file has was encoded with
an alpha channel, and providing the browser supports WebM playback (not all of them do), then it willl render
in-game with full transparency.

You can also save a video to the Texture Manager, allowing other Game Objects to use it as their texture,
including using it as a sampler2D input for a shader.

See the Video Game Object class for more details. Other Video related changes are as follows:

* `Loader.FileTypes.VideoFile` is a new Video File Loader File Type, used for preloading videos as streams or blobs.
* `WebGLRenderer.createVideoTexture` is a new method that will create a WebGL Texture from the given Video Element.
* `WebGLRenderer.updateVideoTexture` is a new method that will update a WebGL Texture from the given Video Element.
* `TextureSource.isVideo` is a new boolean property that is set when the Texture Source is backed by an HTML Video Element.
* `Cache.video` is a new global cache that store loaded Video content.
* `Device.Video.h264Video` has been renamed to `Device.Video.h264` to keep it in-line with the Audio Device names.
* `Device.Video.hlsVideo` has been renamed to `Device.Video.hls` to keep it in-line with the Audio Device names.
* `Device.Video.mp4Video` has been renamed to `Device.Video.mp4` to keep it in-line with the Audio Device names.
* `Device.Video.oggVideo` has been renamed to `Device.Video.ogg` to keep it in-line with the Audio Device names.
* `Device.Video.vp9Video` has been renamed to `Device.Video.vp9` to keep it in-line with the Audio Device names.
* `Device.Video.webmVideo` has been renamed to `Device.Video.webm` to keep it in-line with the Audio Device names.

### Spine Plugin

* The Spine runtimes have been updated to 3.8. Please note that Spine runtimes are _not_ backwards compatible. Animations exported with Spine 3.7 (or earlier) will need re-exporting with 3.8 in order to work with the new runtimes.
* Fixed a bug with the binding of the Spine Plugin causing the GameObjectFactory to remain bound to the first instance of the plugin, causing Scene changes to result in blank Spine Game Objects. Fix #4716 (thanks @olilanz)
* Fixed a bug with the caching of the Spine Texture Atlases, causing shader errors when returning from one Scene to another with a cached Texture Atlas.
* The WebGL Scene Renderer is now only disposed if the Scene is destroyed, not just shut-down.
* The Spine Game Object will no longer set the default skin name to be 'default', it will leave the name empty. Fix #4764 (thanks @Jonchun @badlogic)
* Thanks to a fix inside the Container WebGLRenderer, a bug was crushed which involved multiple Containers in a Scene, with Spine objects, from causing run-time errors. Fix #4710 (thanks @nalgorry)
* Using `Loader.setPath` to define the Spine assets locations could error if trying to load multiple files from different folders. It will now retain the path state at the time of invocation, rather than during the load.
* When loading Spine files that used the same internal image file names, only the first file would successfully load. Now, all files load correctly.

### Facebook Instant Games Plugin

* Calling `showAd` or `showVideoAd` will now check to see if the ad has already been displayed, and skip it when iterating the ads array, allowing you to display an ad with the same Placement ID without preloading it again. Fix #4728 (thanks @NokFrt)
* Calling `gameStarted` in a game that doesn't load any assets would cause the error `{code: "INVALID_OPERATION", message: "Can not perform this operation before game start."}`. The plugin will now has a new internal method `gameStartedHandler` and will redirect the flow accordingly based on asset loading. Fix #4550 (thanks @bchee)
* The documentation for the `chooseContext` method has been fixed. Fix #4425 (thanks @krzysztof-grzybek)
* `Leaderboard.getConnectedScores` incorrectly specified two parameters, neither of which were used. Fix #4702 (thanks @NokFrt)
* `Leaderboard` extends Event Emitter, which was missing in the TypeScript defs. Fix #4703 (thanks @NokFrt)

### Arcade Physics Updates

@BenjaminDRichards and the GameFroot team contributed the following updates to Arcade Physics, which fixes 3 issues encountered when the framerate drops below 60 (technically, any time when multiple physics steps run per frame, so if physics FPS is above 60 this will also occur.)

Issue 1: Friction starts to flip out. Objects on moving platforms get pushed ahead of the platform and "catch" on the leading edge.
Issue 2: Physics objects start to dip into the floor. In the "Before" demo, the camera is locked to the player, so this appears as the entire world starting to shake up and down.
Issue 3: When objects dip into the floor, their "rest velocity" is non-zero. This can affect debug and other logic.

* `Body.prevFrame` is a new vector allowing a Body to distinguish between frame-length changes and step-length changes. Several steps may run for every frame, particularly when fps is low.
* `Body._reset` flag was removed and replaced it with a check of `Body.moves`. The flag only turned on when `moves` was true, and never turned off.
* Added a reset of `prev` in Arcade.Body#step. This fixes the friction issue.
* Stopped the `Body.postUpdate` method from setting `_dx`, `_dy`, and `prev`. They remain in the state they were at the end of the last physics step. This will affect the delta methods, which are documented to provide step-based data (not frame-based data); they now do so. However, because several steps may run per frame, you can't interrogate every step unless you're running functions based on physics events like collisions. You'll just see the latest step. This should partially balance out the extra load of resetting prev.
* Added a zero-out of stepsLastFrame in Arcade.World#postUpdate, which would otherwise never zero out and keep running at least one pass per frame. This should improve performance when frames can be skipped.
* Removed `blocked` checks from `TileCheckX` and `TileCheckY`. Originally, this prevented multiple checks when an object had come to rest on a floor. However, when multiple steps run per frame, the object will accelerate again, the floor won't stop it on steps 2+, and it will end the frame a short distance into the floor. Removing the blocked checks will fix the floor dip issue and the rest velocity issue. Although this opens up multiple checks, this is probably very rare: how many times does an object hit two different floors in a single frame?

In combination these updates fix issues #4732 and #4672. My thanks to @BenjaminDRichards and @falifm.

### New Features

* `GameConfig.antialiasGL` is a new boolean that allows you to set the `antialias` property of the WebGL context during creation, without impacting any subsequent textures or the canvas CSS.
* `InteractiveObject.alwaysEnabled` is a new boolean that allows an interactive Game Object to always receive input events, even if it's invisible or won't render.
* `Bob.setTint` is  a new method that allows you to set the tint of a Bob object within a Blitter. This is then used by the Blitter WebGL Renderer (thanks @rexrainbow)
* The `UpdateList` now emits two new events: 'add' and 'remove' when children are added and removed from it. Fix #3487 (thanks @hexus)
* The `Tilemap.setCollision` method has a new optional boolean parameter `updateLayer`. If set to `true`, it will update all of the collision settings of all tiles on the layer. If `false` it will skip doing this, which can be a huge performance boost in situations where the layer tiles haven't been modified and you're just changing collision flags. This is especially suitable for maps using procedural generated tilemaps, infinite tilemaps, multiplayer tilemaps, particularly large tilemaps (especially those dyanmic in nature) or who otherwise intend to index collisions before the tiles are loaded. This update also added the new parameter to the `SetCollision`, `SetCollisionBetween` and `DynamicTilemapLayer.setCollision` methods (thanks @tarsupin)
* `ArcadePhysics.Body.setBoundsRectangle` is a new method that allows you to set a custom bounds rectangle for any Body to use, rather than the World bounds, which is the default (thanks @francois-n-dream)
* `ArcadePhysics.Body.customBoundsRectangle` is a new property used for custom bounds collision (thanks @francois-n-dream)
* The Arcade Physics Group has a new config object property `customBoundsRectangle` which, if set, will set the custom world bounds for all Bodies that Group creates (thanks @francois-n-dream)
* `WebGLRenderer.createTexture2D` has a new optional parameter `flipY` which sets the `UNPACK_FLIP_Y_WEBGL` flag of the uploaded texture.
* `WebGLRenderer.canvasToTexture` has a new optional parameter `flipY` which sets the `UNPACK_FLIP_Y_WEBGL` flag of the uploaded texture.
* `WebGLRenderer.createCanvasTexture` is a new method that will create a WebGL Texture based on the given Canvas Element.
* `WebGLRenderer.updateCanvasTexture` is a new method that will update an existing WebGL Texture based on the given Canvas Element.
* `WebGLRenderer.createVideoTexture` is a new method that will create a WebGL Texture based on the given Video Element.
* `WebGLRenderer.updateVideoTexture` is a new method that will update an existing WebGL Texture based on the given Video Element.
* `TextureSource.flipY` is a new boolean that controls if the `UNPACK_FLIP_Y_WEBGL` flag is set when a WebGL Texture is uploaded.
* `TextureSource.setFlipY` is a new method that toggles the `TextureSource.flipY` property.

### Updates

* When calling `Shader.setRenderToTexture()` it will now draw the shader just once, immediately to the texture, to avoid the texture being blank for a single frame (thanks Kyle)
* The private `Shader._savedKey` property has been removed as it wasn't used anywhere internally.
* A `hasOwnProperty` check has been applied to the `SceneManager.createSceneFromObject` method when parsing additional properties in the `extend` object (thanks @halilcakar)
* The `Blitter.dirty` flag is no longer set if the render state of a Bob is changed to make it invisible (thanks @rexrainbow)
* `WebGLPipeline.addAttribute` will now automatically update the vertextComponentCount for you, without you having to do it manually any more (thanks @yhwh)
* `MultiFile` has three new internal properties: `baseURL`, `path` and `prefix` which allow them to retain the state of the loader at the time of creation, to be passed on to all child-files. Fix #4679.
* `LoaderPlugin` and `MultiFile` have a new private property `multiKeyIndex` which multi-files use and increment when batching sub-file loads.
* TileSprites will now throw a console warning if you try to use a RenderTexture or GLTexture as their frame source. Fix #4719 (thanks @pavel-shirobok)
* `TextureSource.isGLTexture` now checks if the browser supports `WebGLTexture` before checking to see if source is an instance of one. This should fix issues with Phaser in HEADLESS mode running under node / jsdom, or where WebGLTexture isn't present. Fix #4711 (thanks @tsphillips)
* `GameObject.ToJSON` will no longer output the `scaleMode` in the json because it's not a valid Game Object property.
* `TextureSource.setFilter` will now set the `scaleMode` to the given filter.
* `CanvasInterpolation` has updated the order of the CSS properties so that `crisp-edges` comes after the browser prefix versions.
* The `CanvasRenderer.scaleMode` property has been removed as it was never set or used internally.
* The `CanvasRenderer.currentScaleMode` property has been removed as it was never set or used internally.
* The `BuildGameObject` function will no longer set `scaleMode` because it's not a valid Game Object property.
* `CanvasRenderer.antialias` is a new property, populated by the game config property of the same name (or via the `pixelArt` property) that will tell the canvas renderer what to set image interpolation to during rendering of Sprites.
* `SetTransform` will now set the imageSmoothingEnabled context value based on the renderer and texture source scale mode.
* The Blitter Canvas Renderer will now respect the game config anti-alias / pixel art settings and render accordingly.
* The Particle Emitter Canvas Renderer will now respect the game config anti-alias / pixel art settings and render accordingly.
* The Static Tilemap Canvas Renderer will now respect the game config anti-alias / pixel art settings and render accordingly.
* The Dynamic Tilemap Canvas Renderer will now respect the game config anti-alias / pixel art settings and render accordingly.
* All Game Objects that use the Canvas Set Transform function (which is most of them) will aos now respect the game config anti-alias / pixel art settings and render accordingly. This means you can now have properly scaled Bitmap Text, Text, Sprites, Render Textures, etc when pixel art is enabled in your game. Fix #4701 (thanks @agar3s)
* Containers are now able to set the alpha quadrant values (topLeft, topRight, bottomLeft and bottomRight) and have these passed onto children which are capable of supporting them, such as Sprites. Fix #4714 (thanks @MrcSnm)
* The `ProcessQueue` struct now extends Event Emitter and will emit `PROCESS_QUEUE_ADD_EVENT` when a new item is added to it.
* The `ProcessQueue` struct now extends Event Emitter and will emit `PROCESS_QUEUE_REMOVE_EVENT` when an item is removed from it.
* `ProcessQueue.removeAll` is a new method that will remove all active entries from the queue.
* `ProcessQueue.length` is a new property that returns the size of the active list.
* `UpdateList` now extends the `ProcessQueue` struct and uses all of its methods for list management, instead of doing it directly. This means private properties such as `UpdateList._list` no longer exist. It also fixes an issue re: memory management where list items would remain until the end of a Scene. Fix #4721 (thanks @darkgod6)
* `BaseSoundManager.forEachActiveSound` will now only invoke the callback if the sound actually exists and isn't pending removal. Fix #3383 (thanks @DouglasLapsley)
* `MouseManager.target` can now be defined as either a string or by passing an HTMLElement directly. Fix #4353 (thanks @BigZaphod)
* The `BasePlugin.boot` method has been removed and moved to `ScenePlugin.boot` as it's a Scene-level method only (thanks @samme)
* The `BasePlugin.scene` and `BasePlugin.systems` properties have been removed and are defined in `ScenePlugin`, as they are Scene-level properties only (thanks @samme)
* The `Tween.getValue` method has been updated so you can specify the index of the Tween Data to get the value of. Previously, it only returned the first TweenData from the data array, ignoring any subsequent properties or targets. Fix #4717 (thanks @chepe263)
* `WebGLRenderer.createTexture2D` has a new optional parameter `forceSize`, which will force the gl texture creation to use the dimensions passed to the method, instead of extracting them from the pixels object, if provided.
* The `GameObject.setTexture` method can now accept either a string, in which case it looks for the texture in the Texture Manager, or a Texture instance, in which case that instance is set as the Game Object's texture.
* `TextureManager.get` can now accept either a string-based key, or a Texture instance, as its parameter.
* `SceneManager.stop` and the matching `ScenePlugin.stop` now have an optional `data` parameter, which is passed to the Scene shutdown method. Fix #4510 (thanks @Olliebrown @GetsukenStudios)
* `Cameras.BaseCamera` is now exposed in the namespace, allowing you to access them directly (thanks @rexrainbow)
* Shaders have a new optional constructor parameter `textureData` which allows you to specify additional texture data, especially for NPOT textures (thanks @cristlee)
* `TouchManager.disableContextMenu` is a new method that will try to disable the context menu on touch devices, if the Game Config `disableContextMenu` is set. Previously, it only tried to do it for the Mouse Manager, but now does it for touch as well. Fix #4778 (thanks @simplewei)

### Bug Fixes

* `SpineCanvasPlugin.shutdown` would try to dispose of the `sceneRenderer`, but the property isn't set for Canvas.
* `ArcadePhysics.Body.checkWorldBounds` would incorrectly report as being on the World bounds if the `blocked.none` flag had been toggled elsewhere in the Body. It now only sets if it toggles a new internal flag (thanks Pablo)
* `RenderTexture.resize` wouldn't update the CanvasTexture width and height, causing the cal to draw or drawFrame to potentially distort the texture (thanks @yhwh)
* `InputPlugin.processDragMove` has been updated so that the resulting `dragX` and `dragY` values, sent to the event handler, now compensate for the scale of the Game Objects parent container, if inside of one. This means dragging a child of a scale Container will now still drag at 'full' speed.
* The RenderTextures `displayOrigin` values are now automatically updated if you call `setSize` on the Render Texture. Fix #4757 (thanks @rexrainbow)
* `onTouchStart`, `onTouchEnd` and `onTouchMove` will now check for `event.cancelable` before calling preventDefault on the touch event, fixing issues with "Ignored attempt to cancel a touchstart event with cancelable=false, for example because scrolling is in progress and cannot be interrupted." errors in some situations. Fix #4706 (thanks @MatthewAlner)
* `MatterPhysics.shutdown` could try to access properties that may have been previously removed during the Game.destroy process, causing a console error. It now checks properties before removing events from them (thanks @nagyv)
* `ArcadePhysics.Body.hitTest` would use CircleContains to do a hit test, which assumex x/y was the Circle center, but for a Body it's the top-left, causing the hit test to be off. Fix #4748 (thanks @funnisimo)
* `ArcadePhysics.World.separateCircle` has had the velocity scaling moved to after the angle is calculated, fixing a weird collision issue when `Body.bounce=0`. Also, if both bodies are movable, they now only offset by half the offset and use the center of the body for angle calculation, allowing for any offsets to be included. Fix #4751 (thanks @funnisimo @hizzd)
* `Tween.updateTo` would break out of the TweenData iteration as soon as it adjusted the first matching key, causing tweens acting on multiple targets to only update the first target. It now updates them all. Fix #4763 (thanks @RBrNx)
* The Container WebGLRenderer will now handle child mask batching properly, based on the renderers current mask.
* The Container WebGLRenderer will now handle child new type switching, allowing you to carry on with a batch of same-type Game Objects even if they're nested within Containers. Fix #4710 (thanks @nalgorry)
* `MultiAtlasFiles` that loaded their own external images would obtain incorrect path and URL values if the path had been changed by another file in the queue. They now retain the loader state and apply it to all child files during load.
* If more than one `MultiAtlasFile` used the same internal file name for its images, subsequent multi-atlases would fail to load. Fix #4330 (thanks @giviz)
* `MultiAtlasFiles` would incorrectly add the atlas JSON into the JSON cache, causing you to not be able to destroy and reload the texture using the same atlas key as before. Fix #4720 (thanks @giviz)
* `RenderTexture.fill` wasn't setting the camera up before drawing the fill rect, causing it to appear in the wrong place and the wrong size. Fix #4390 (thanks @Jerenaux)
* `DynamicBitmapText.setOrigin` wouldn't change the origin when using the Canvas Renderer, only in WebGL. It now sets the origin regardless of renderer. Fix #4108 (thanks @garethwhittaker)
* `DynamicBitmapText` wouldn't respect the multi-line alignment values when using the Canvas Renderer. It now uses them in the line calculations.
* `DynamicBitmapText` and `BitmapText` wouldn't render at the correct position when using scaled BitmapText and an origin. Fix #4054 (thanks @Aveyder)
* Incorrect lighting on batched Sprites. The lighting was not correct when batching several sprites with different rotations. Each sprite now uses its own `uInverseRotationMatrix` to compute the lighting correctly (thanks @gogoprog)
* Matter.js Body wasn't setting the part angles correctly in `Body.update` (thanks @Frozzy6)
* `ScaleManager.startFullscreen` now checks to see if the call returns a Promise, rather than checking if the browser supports them, before waiting for promise resolution. This fixes a runtime console warning in Microsoft Edge. Fix #4795 (thanks @maksdk)

### Examples, Documentation and TypeScript

My thanks to the following for helping with the Phaser 3 Examples, Docs and TypeScript definitions, either by reporting errors, fixing them or helping author the docs:

@krzysztof-grzybek @NokFrt @r-onodera @colorcube @neon-dev @SavedByZero @arnekeller 

### Thanks

Thank you to the following people for contributing ideas for new features to be added to Phaser 3. Because we've now started Phaser 4 development, I am closing off old feature requests that I personally will not work on for Phaser 3 itself. They may be considered for v4 and, of course, if someone from the community wishes to submit a PR to add them, I will be only too happy to look at that. So, if you want to get involved, filter the GitHub issues by the [Feature Request tag](https://github.com/photonstorm/phaser/issues?q=is%3Aissue+is%3Aopen+label%3A%22%F0%9F%92%96+Feature+Request%22) and dig in. In the meantime, thank you to the following people for suggesting features, even if they didn't make it this time around:

@njt1982 @TheTrope @allanbreyes @alexandernst @Secretmapper @murteira @oktayacikalin @TadejZupancic @SBCGames @hadikcz @jcyuan @pinkkis @Aedalus @jestarray @BigZaphod @Secretmapper @francois-n-dream @G-Rath 
