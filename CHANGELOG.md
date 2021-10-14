## Version 3.60.0 - Miku - in development

### New Features - Sprite FX

* When defining the `renderTargets` in a WebGL Pipeline config, you can now set optional `width` and `height` properties, which will create a Render Target of that exact size, ignoring the `scale` value (if also given).
* `WebGLPipeline.isSpriteFX` is a new boolean property that defines if the pipeline is a Sprite FX Pipeline, or not. The default is `false`.
* `GameObjects.Components.FX` is a new component that provides access to FX specific propertis and methods. The Image and Sprite Game Objects have this component by default.
* `fxPadding` and its related method `setFXPadding` allow you to set extra padding to be added to the texture the Game Object renders with. This is especially useful for Sprite FX shaders that modify the sprite beyond its bounds, such as glow or shadow effects.
* The `WebGLPipeline.setShader` method has a new optional parameter `buffer` that allows you to set the vertex buffer to be bound before the shader is activated.
* The `WebGLPipeline.setVertexBuffer` method has a new optional parameter `buffer` that allows you to set the vertex buffer to be bound if you don't want to bind the default one.
* The `WebGLRenderer.createTextureFromSource` method has a new optional boolean parameter `forceClamp` that will for the clamp wrapping mode even if the texture is a power-of-two.
* `RenderTarget` will now automatically set the wrapping mode to clamp.

### New Features - Compressed Texture Support

Phaser 3.60 contains support for Compressed Textures. It can parse both KTX and PVR containers and within those has support for the following formats: ETC, ETC1, ATC, ASTC, BPTC, RGTC, PVRTC, S3TC and S3TCSRB. Compressed Textures differ from normal textures in that their structure is optimized for fast GPU data reads and lower memory consumption. Popular tools that can create compressed textures include PVRTexTool, ASTC Encoder and Texture Packer.

Compressed Textures are loaded using the new `this.load.texture` method, which takes a texture configuration object that maps the formats to the files. The browser will then download the first file in the object that it knows it can support. You can also provide Texture Atlas JSON data, too, so you can use compressed texture atlases. Currently, Texture Packer is the best tool for creating these.

Development of this feature was kindly sponsored by Club Penguin Rewritten (https://cprewritten.net).

* `TextureSoure.compressionAlgorithm` is now populated with the compression format used by the texture.
* `Types.Textures.CompressedTextureData` is the new compressed texture configuration object type.
* `TextureManager.addCompressedTexture` is a new method that will add a compressed texture, and optionally atlas data into the Texture Manager and return a `Texture` object than any Sprite can use.
* `Textures.Parsers.KTXParser` is a new parser for the KTX compression container format.
* `Textures.Parsers.PVRParser` is a new parser for the PVR compression container format.
* The `WebGLRenderer.compression` property now holds a more in-depth object containing supported compression formats.
* The `WebGLRenderer.createTextureFromSource` method now accepts the `CompressedTextureData` data objects and creates WebGL textures from them.
* `WebGLRenderer.getCompressedTextures` is a new method that will populate the `WebGLRenderer.compression` object and return its value. This is called automatically when the renderer boots.
* `WebGLRenderer.getCompressedTextureName` is a new method that will return a compressed texture format GLenum based on the given format.

### New Features

* `ScaleManager.getViewPort` is a new method that will return a Rectangle geometry object that matches the visible area of the screen (thanks @rexrainbow)
* When starting a Scene and using an invalid key, Phaser will now raise a console warning informing you of this, instead of silently failing. Fix #5811 (thanks @ubershmekel)
* `GameObjects.Layer.addToDisplayList` and `removeFromDisplayList` are new methods that allows for you to now add a Layer as a child of another Layer. Fix #5799 (thanks @samme)
* `GameObjects.Video.loadURL` has a new optional 4th parameter `crossOrigin`. This allows you to specify a cross origin request type when loading the video cross-domain (thanks @rmartell)
* You can now set `loader.imageLoadType: "HTMLImageElement"` in your Game Configuration and the Phaser Loader will use an Image Tag to load all images, rather than XHR and a Blob object which is the default. This is a global setting, so all file types that use images, such as Atlas or Spritesheet, will be changed via this flag (thanks @hanzooo)
* You can now control the drawing offset of tiles in a Tileset using the new optional property `Tileset.tileOffset` (which is a Vector2). This property is set automatically when Tiled data is parsed and found to contain it. Fix #5633 (thanks @moJiXiang @kainage)
* You can now set the alpha value of the Camera Flash effect before running it, where-as previously it was always 1 (thanks @kainage)
* The `Tilemap.createFromObjects` method has been overhauled to support typed tiles from the Tiled Map Editor (https://doc.mapeditor.org/en/stable/manual/custom-properties/#typed-tiles). It will now also examine the Tileset to inherit properties based on the tile gid. It will also now attempt to use the same texture and frame as Tiled when creating the object (thanks @lackhand)

### Updates

* When you try to use a frame that is missing on the Texture, it will now give the key of the Texture in the console warning (thanks @samme)
* The `Display.Masks.BitmapMask` `destroy` method will now remove the context-lost event handler.
* The `hitArea` parameter of the `GameObjects.Zone.setDropZone` method is now optional and if not given it will try to create a hit area based on the size of the Zone Game Object (thanks @rexrainbow)
* `BitmapMask.scene` is a new property that allows the Bitmap Mask to reference the Scene it was created in.
* The `DOMElement.preUpdate` method has been removed. If you overrode this method, please now see `preRender` instead.
* `DOMElement.preRender` is a new method that will check parent visibility and improve its behavior, responding to the parent even if the Scene is paused or the element is inactive. Dom Elements are also no longer added to the Scene Update List. Fix #5816 (thanks @prakol16 @samme)
* Phaser 3 is now built with webpack 5 and all related packages have been updated.
* Previously, an Array Matrix would enforce it had more than 2 rows. This restriction has been removed, allowing you to define and rotate single-row array matrices (thanks @andriibarvynko)
* The Gamepad objects now have full TypeScript definitions thanks to @sylvainpolletvillard
* Lots of configuration objects now have full TypeScript definitions thanks to @16patsle
* `Particle.fire` will now throw an error if the particle has no texture frame. This prevents an uncaught error later when the particle fails to render. Fix #5838 (thanks @samme @monteiz)
* `ParticleEmitterManager.setEmitterFrames` will now print out console warnings if an invalid texture frame is given, or if no texture frames were set. Fix #5838 (thanks @samme @monteiz)
* `SceneManager.stop` will now ignore the call if the Scene has already been shut down, avoiding potential problems with duplicate event handles. Fix #5826 (thanks @samme)

### Bug Fixes

* `Animation.createFromAseprite` would calculate an incorrect frame duration if the frames didn't all have the same speed.
* The URL scheme `capacitor://` has been added to the protocol check to prevent malformed double-urls in some environments (thanks @consolenaut)
* Removed `Config.domBehindCanvas` property as it's never used internally. Fix #5749 (thanks @iamallenchang)
* `dispatchTweenEvent` would overwrite one of the callback's parameters. This fix ensures that `Tween.setCallback` now works consistently. Fix #5753 (thanks @andrei-pmbcn @samme)
* The context restore event handler is now turned off when a Game Object is destroyed. This helps avoid memory leakage from Text and TileSprite Game Objects, especially if you consistently destroy and recreate your Game instance in a single-page app (thanks @rollinsafary-inomma @rexrainbow @samme)
* When the device does not support WebGL, creating a game with the renderer type set to `Phaser.WEBGL` will now fail with an error. Previously, it would fall back to Canvas. Now it will not fall back to Canvas. If you require that feature, use the AUTO render type. Fix #5583 (thanks @samme)
* The `Tilemap.createFromObjects` method will now correctly place both tiles and other objects. Previously, it made the assumption that the origin was 0x1 for all objects, but Tiled only uses this for tiles and uses 0x0 for its other objects. It now handles both. Fix #5789 (thanks @samme)
* The `CanvasRenderer.snapshotCanvas` method used an incorrect reference to the canvas, causing the operation to fail. It will now snapshot a canvas correctly. Fix #5792 #5448 (thanks @rollinsafary-inomma @samme @akeboshi1)
* The `Tilemap.tileToWorldY` method incorrectly had the parameter `tileX`. It will worked, but didn't make sense. It is now `tileY` (thanks @mayacoda)
* The `Tilemap.convertTilemapLayer` method would fail for _isometric tilemaps_ by not setting the physic body alignment properly. It will now call `getBounds` correctly, allowing for use on non-orthagonal maps. Fix #5764 (thanks @mayacoda)
* The `PluginManager.installScenePlugin` method will now check if the plugin is missing from the local keys array and add it back in, if it is (thanks @xiamidaxia)
* The Spine Plugin would not work with multiple instances of the same game on a single page. It now stores its renderer reference outside of the plugin, enabling this. Fix #5765 (thanks @xiamidaxia)
* In Arcade Physics, Group vs. self collisions would cause double collision callbacks due to the use of the quad tree. For this specific conditions, the quad tree is now skipped. Fix #5758 (thanks @samme)
* During a call to `GameObject.Shapes.Rectangle.setSize` it will now correctly update the Rectangle object's display origin and default hitArea (thanks @rexrainbow)
* The Arcade Physics Body will now recalculate its center after separation with a Tile in time for the values to be correct in the collision callbacks (thanks @samme)
* The `ParseTileLayers` function has been updated so that it no longer breaks when using a Tiled infinite map with empty chunks (thanks @jonnytest1)
* The `PutTileAt` function will now set the Tile dimensions from the source Tileset, fixing size related issues when placing tiles manually. Fix #5644 (thanks @moJiXiang @stuffisthings)
* The new `Tileset.tileOffset` property fixes an issue with drawing isometric tiles when an offset had been defined in the map data (thanks @moJiXiang)
* Fixed issue in `Geom.Intersects.GetLineToLine` function that would fail with colinear lines (thanks @Skel0t)
* The `CameraManager.destroy` function will now remove the Scale Manager `RESIZE` event listener created as part of `boot`, where-as before it didn't clean it up, leading to gc issues. Fix #5791 (thanks @liuhongxuan23)
* With `roundPixels` set to true in the game or camera config, Sprites will no longer render at sub-pixel positions under CANVAS. Fix #5774 (thanks @samme)
* The Camera will now emit `PRE_RENDER` and `POST_RENDER` events under the Canvas Renderer. Fix #5729 (thanks @ddanushkin)
* The Multi Pipeline now uses `highp float` precision by default, instead of `mediump`. This fixes issues with strange blue 'spots' appearing under WebGL on some Android devices. Fix #5751 #5659 #5655 (thanks @actionmoon @DuncanPriebe @ddanushkin)
* The `Tilemaps.Tile.getBounds` method would take a `camera` parameter but then not pass it to the methods called internally, thus ignoring it. It now factors the camera into the returned Rectangle.
* `Tilemap.createFromObjects` has had the rendering of Tiled object layers on isometric maps fixed. Objects contained in object layers generated by Tiled use orthogonal positioning even when the map is isometric and this update accounts for that (thanks @lfarroco)
* Timers with very short delays (i.e. 1ms) would only run the callback at the speed of the frame update. It will now try and match the timer rate by iterating the calls per frame. Fix #5863 (thanks @rexrainbow)

### Examples, Documentation and TypeScript

My thanks to the following for helping with the Phaser 3 Examples, Docs, and TypeScript definitions, either by reporting errors, fixing them, or helping author the docs:

@necrokot Golen @Pythux @samme @danfoster @eltociear @sylvainpolletvillard @hanzooo @etherealmachine @DeweyHur





## Version 3.55.2 - Ichika - 27th May 2021

### Bug Fixes

* Fixed an issue in `FillPathWebGL`, `IsoBoxWebGLRenderer` and `IsoTriangleWebGLRenderer` functions which caused the filled versions of most Shape Game Objects to pick-up the texture of the previous object on the display list. Fix #5720 (thanks @samme)

## Version 3.55.1 - Ichika - 26th May 2021

### New Features

* The `GameObject.destroy` method has a new `fromScene` parameter, set automatically by Phaser. Fix #5716 (thanks @rexrainbow)
* The Game Object `DESTROY` event is now set the new `fromScene` boolean as the 2nd parameter, allowing you to determine what invoked the event (either user code or a Scene change). Fix #5716 (thanks @rexrainbow)

### Bug Fixes

* Fixed an issue with the TypeScript defs not recognising the Game Object Config properly. Fix #5713 (thanks @vforsh)
* Fixed an issue in the `FillPathWebGL` function which caused the filled versions of the Arc, Circle, Ellipse, Polygon and Star Shapes to not render. Fix #5712 (thanks @rexrainbow)
* Fixed rendering parameters in `IsoBox` and `IsoTriangle` Game Objects that stopped them from rendering correctly.
* Added the missing `WebGLPipelineUniformsConfig` type def. Fix #5718 (thanks @PhaserEditor2D)

## Version 3.55.0 - Ichika - 24th May 2021

### New Features

* `GameObjects.DOMElement.pointerEvents` is a new property that allows you to set the `pointerEvents` attribute on the DOM Element CSS. This is `auto` by default and should not be changed unless you know what you're doing.
* `Core.Config.domPointerEvents` is a new config property set via `dom: { pointerEvents }` within the Game Config that allows you to set the `pointerEvents` css attribute on the DOM Element container.
* The `RenderTexture.endDraw` method has a new optional boolean `erase` which allows you to draw all objects in the batch using a blend mode of ERASE. This has the effect of erasing any filled pixels in the objects being drawn.
* All of the methods from the `GraphicsPipeline` have now been merged with the `MultiPipeline`, these include `batchFillRect`, `batchFillTriangle`, `batchStrokeTriangle`, `batchFillPath`, `batchStrokePath` and `batchLine`. The Graphics Game Object and all of the Shape Game Objects have been updated to use the new Multi Pipeline. This means that drawing Sprites and Graphics / Shapes will all batch together again. Fix #5553 #5500 (thanks @venarius @roberthook823)

### Updates

* The types have been improved for WebGL Compressed Textures (thanks @vforsh)
* `Container.moveAbove` is a new method that will move a Game Object above another in the same Container (thanks @rexrainbow)
* `Container.moveBelow` is a new method that will move a Game Object below another in the same Container (thanks @rexrainbow)
* `List.moveAbove` is a new method that will move a Game Object above another in the same List (thanks @rexrainbow)
* `List.moveBelow` is a new method that will move a Game Object below another in the same List (thanks @rexrainbow)
* The `MeasureText` function, as used by Text Game Objects, has had its performance enhanced by removing a duplicate image data check and also now checks for metrics properties correctly (thanks @valadaptive)
* `WebGLShader.setUniform1` has a new optional boolean parameter `skipCheck` which will force the function to set the values without checking against the previously held ones.
* `WebGLShader.setUniform2` has a new optional boolean parameter `skipCheck` which will force the function to set the values without checking against the previously held ones.
* `WebGLShader.setUniform3` has a new optional boolean parameter `skipCheck` which will force the function to set the values without checking against the previously held ones.
* `WebGLShader.setUniform4` has a new optional boolean parameter `skipCheck` which will force the function to set the values without checking against the previously held ones.
* The `WebGLShader.set1fv`, `set2fv`, `set3fv`, `set4fv`, `set1iv`, `set2iv`, `set3iv`, `set4iv`, `setMatrix2fv`, `setMatrix3fv` and `setMatrix4fv` methods no longer try to do array comparisons when setting the uniforms, but sets them directly. Fix #5670 (thanks @telinc1)

### Bug Fixes

* Have reverted all of the DOM Element CSS changes back to how they were in 3.52, causing both DOM Input and Phaser Input to work together properly again. Fix #5628 (thanks @sacharobarts)
* The `Mesh` Game Object would incorrectly cull faces if the Scene Camera scrolled. It now calculates the cull correctly, regardless of camera world position, zoom or rotation. Fix #5570 (thanks @hendrikras)
* `Math.ToXY` will now return an empty Vector 2 if the index is out of range, where before it would return the input Vector2 (thanks @Trissolo)
* The `UpdateList.shutdown` method will now remove the `PRE_UPDATE` handler from the ProcessQueue correctly (thanks @samme)
* When loading a Video with a config object, it would not get the correct `key` value from it (thanks @mattjennings)
* The `GameObjectFactory.existing` method will now accept `Layer` as a TypeScript type. Fix #5642 (thanks @michal-bures)
* The `Input.Pointer.event` property can now be a `WheelEvent` as well.
* Fixed an issue when loading audio files from a Phaser project wrapped in Capacitor native app shell on iOS (thanks @consolenaut)
* Video would not resume playing after regaining focus swapping from another browser tab. Fix #5377 (thanks @spayton)
* Container will now invoke `addToRenderList` before leaving the render method, fixing an issue with Container Input. Fix #5506 (thanks @vforsh @rexrainbow)
* The `Game.postBoot` callback was never being invoked due to an incorrect internal property setter. Fix #5689 (thanks @sebastianfast)
* The `Light` Game Object didn't set the shader uniforms correctly, causing it to appear to ignore image rotation with normal maps. Fix #5660 (thanks @sroboubi @telinc1)

### Examples, Documentation and TypeScript

My thanks to the following for helping with the Phaser 3 Examples, Docs, and TypeScript definitions, either by reporting errors, fixing them, or helping author the docs:

@x-wk @samme @trynx @Palats @supertorpe @Pixelguy @Fractal @halgorithm @Golden @H0rn0chse @EmilSV @Patapits @karbassi

## Version 3.54.0 - Futaro - 26th March 2021

### New Features

* `Phaser.Math.Median` is a new function that will calculate the median of the given values. The values are sorted and the middle value is returned. In case of an even number of values, the average of the two middle values is returned (thanks @vforsh)
* `ScenePlugin.pluginKey` is a new string-based property, set by the `PluginManager` that contains the key of the plugin with the Scene Systems.

### Updates

* When the Scene-owned Input Plugin is shutdown (i.e. via a call to `Scene.stop`) it will now _remove_ any `Key` objects that the plugin created, not just reset them. This is a quality-of-life breaking change from how it worked previously (thanks @veleek)
* Thanks to a TS Parser update by @krotovic the JSDocs can now define `@this` tags. Fix #4669.
* The `Scenes.Systems.install` method has been removed. It's no longer required and would throw an error if called. Fix #5580 (thanks @Trissolo)
* The `WebAudioSoundManager.onFocus` method will now test to see if the state of the `AudioContext` is `interrupted`, as happens on iOS when leaving the page, and then resumes the context. Fix #5390 #5156 #4790 (thanks @SBCGames @micsun-al @AdamXA)

### Bug Fixes

* Adding a Game Object to a Container that already existed in another Container would leave a copy of it on the Display List. Fix #5618 (thanks Kromah @mariogarranz)
* Fixed missing `backgroundColor` property in GameConfig. Fix #5597 (thanks @eli-s-r)
* BitmapText wouldn't render correctly with the Canvas Renderer when the texture came from a Texture Atlas. Fix #5545 (thanks @vforsh)
* #5504 had broken DOM Elements being able to be clicked due to an oversight of the DOM Container. DOM Elements now correctly pick-up the default pointer events handler. Fix #5594 (thanks @pizkaz)
* The `RGBToString` function will no longer return CSS strings with decimal places if the input contained them (thanks @neil-h)
* Objects added to a `SpineContainer` were also added to the base Display List, causing them to appear twice. Fix #5599 (thanks @spayton)
* When an Animation has `skipMissedFrames` set it will now bail out of the skip catch-up loop if any of the frames cause the animation to complete. Fix #5620 (thanks @fenrir1990 @Aveyder)
* The `Spine Plugin` factory functions now use the local Scene Spine Plugin reference in order to create the objects, rather than the Scene belonging to the first instance of the plugin. This prevents errors when you have globally installed the Spine plugin, but then remove or destroy the first Scene using it (thanks stever1388 @samme)

### Examples, Documentation and TypeScript

My thanks to the following for helping with the Phaser 3 Examples, Docs, and TypeScript definitions, either by reporting errors, fixing them, or helping author the docs:

@samme @masterT @krotovic @Kvisaz

## Version 3.53.1 - Anastasia - 8th March 2021

* Fixed an issue where Container children were not removed from the display list properly.

## Version 3.53.0 - Anastasia - 8th March 2021

### New Features

* You can now run Phaser from within a Web Worker. You must use the `type: 'classic'` method and then use `importScripts('phaser.js')` within your workers, but it will no longer throw window errors and allows you access to lots of the core Phaser functions from Workers.
* `Scenes.Events.PRE_RENDER` is a new event fired after the display list is sorted and before the Scene is rendered (thanks @samme)
* You can now set the boolean `preserveDrawingBuffer` in the Game Config (either directly, or in the Render Config). This is passed to the WebGL context during creation and controls if the buffers are automatically cleared each frame or not. The default is to clear them. Set to `true` to retain them.
* `GameObjects.Shape.setDisplaySize` is a new method that helps setting the display width and height of a Shape object in a chainable way. Fix #5526 (thanks @samme)
* `Tilemaps.Parsers.Tiled.ParseTilesets` has been updated so it now retains the `type` field information that can be optionally specified within Tiled. This is useful when creating objects from tiles and tile variants (thanks @lackhand)
* `Tilemaps.Parsers.Tiled.ParseWangsets` is a new function that will parse the Wangset information from Tiled map data, if present, and retain it so you can access the data (thanks @lackhand)
* `WebGLPipeline.glReset` is a new boolean property that keeps track of when the GL Context was last reset by the Pipeline Manager. It then redirects calls to `bind` to `rebind` instead to restore the pipeline state.

### Display List Updates

* `GameObject.addToDisplayList` is a new method that allows you to add a Game Object to the given Display List. If no Display List is given, it will default to the Scene Display List. A Game Object can only exist on one Display List at any given time, but may move freely between them.
* `GameObject.addToUpdateList` is a new method that adds the Game Object to the Update List belonging to the Scene. When a Game Object is added to the Update List it will have its `preUpdate` method called every game frame.
* `GameObject.removeFromDisplayList` is a new method that removes the Game Object from the Display List it is currently on.
* `GameObject.removeFromUpdateList` is a new method that removes the Game Object from the Scenes Update List.
* `GameObject.destroy` will now call the new `removeFromDisplayList` and `removeFromUpdateList` methods.
* `DisplayList.addChildCallback` will now use the new `addToDisplayList` and `removeFromDisplayList` Game Object methods.
* `Container.addHandler` will now use the new `addToDisplayList` and `removeFromDisplayList` Game Object methods.
* `Layer.addChildCallback` and `removeChildCallback` will now use the new `addToDisplayList` and `removeFromDisplayList` Game Object methods.
* `Group` now listens for the `ADDED_TO_SCENE` and `REMOVED_FROM_SCENE` methods and adds and removes itself from the Update List accordingly.
* `Group.add` and `create` now uses the new `addToDisplayList` and `addToUpdateList` Game Object methods.
* `Group.remove` now uses the new `removeFromDisplayList` and `removeFromUpdateList` Game Object methods.
* `Group.destroy` has a new optional boolean parameter `removeFromScene`, which will remove all Group children from the Scene if specified.

### Updates

* Phaser no longer includes the IE9 polyfills. All polyfills have been removed from the core builds and moved to their own specific version called `phaser-ie9`, which can be found in the `dist` folder.
* All of the Device functions will now check to see if Phaser is running inside of a Web Worker, or not. If it is, they will return early, avoiding trying to make calls to `window` or other elements not present within Workers.
* The Webpack loaders have been moved to dev dependencies to avoid peer issues during use of Phaser as a package (thanks @andrewstart)
* The `WebAudioSoundManager.createAudioContext` method is no longer private.
* The `WebAudioSoundManager.context` property is no longer private.
* The `WebAudioSoundManager.masterMuteNode` property is no longer private.
* The `WebAudioSoundManager.masterVolumeNode` property is no longer private.
* The `WebAudioSoundManager.destination` property is no longer private.
* The `WebAudioSound.audioBuffer` property is no longer private.
* The `WebAudioSound.source` property is no longer private.
* The `WebAudioSound.loopSource` property is no longer private.
* The `WebAudioSound.muteNode` property is no longer private.
* The `WebAudioSound.volumeNode` property is no longer private.
* The `WebAudioSound.pannerNode` property is no longer private.
* The `WebAudioSound.hasEnded` property is no longer private, but _is_ read only.
* The `WebAudioSound.hasLooped` property is no longer private, but _is_ read only.
* The `WebAudioSoundManager.createAudioContext` method will now use `webkitAudioContext` if defined in `window` (rather than using the polyfill) to handle audio on Safari.
* If a loaded JSON File fails to parse it will now issue a console warning along with the file key (thanks @samme)
* The Canvas Renderer will no longer run a `fillRect` if `clearBeforeRender` is `false` in the Game Config.
* The `LightsManager.addPointlight` method now has full JSDocs and the `attenuation` parameter.
* `LightPipeline.lightsActive` is a new boolean property that keeps track if the Lights Manager in a Scene is active, or not.
* The `LightPipeline` now only calls `batchSprite`, `batchTexture` and `batchTextureFrame` if the Scene Lights Manager is active. Fix #5522 (thanks @inmylo)
* The Tiled Parser has been updated so it now supports object properties defined in an array with name / type values (thanks @veleek)
* `LineCurve.getTangent` can now take an output vector to receive the tangent value (thanks @samme)
* `DOMElementCSSRenderer` no longer sets the `pointerEvents` style attribute to `auto`. This is the default value anyway and it now means you can override it from your code by setting the `pointer-events` attribute directly. Fix #5470 (thanks @hayatae @endel)
* `SceneManager.loadComplete` will no longer try to unlock the Sound Manager, preventing `AudioContext was not allowed to start` console warnings after each Scene finishes loading.
* `WebGLRenderer.deleteTexture` will now run `resetTextures(true)` first, incase the requested texture to be deleted is currently bound. Previously, it would delete the texture and then reset them.
* If `TextureSource.destroy` has a WebGL Texture it will tell the WebGL Renderer to reset the textures first, before deleting its texture.
* `Cameras.Controls.FixedKeyControl.minZoom` is a new configurable property that sets the minimum camera zoom. Default to 0.001 (thanks @samme)
* `Cameras.Controls.FixedKeyControl.maxZoom` is a new configurable property that sets the maximum camera zoom. Default to 1000 (thanks @samme)
* `Cameras.Controls.SmoothedKeyControl.minZoom` is a new configurable property that sets the minimum camera zoom. Default to 0.001 (thanks @samme)
* `Cameras.Controls.SmoothedKeyControl.maxZoom` is a new configurable property that sets the maximum camera zoom. Default to 1000 (thanks @samme)
* The `WebGLPipeline.rebind` method now accepts an optional parameter `currentShader`. If provided it will set the current shader to be this after the pipeline reset is complete.
* The `PipelineManager.rebind` method will now flag all pipelines as `glReset = true`, so they know to fully rebind the next time they are invoked.

### Bug Fixes

* `BlitterWebGLRenderer` was calling an out-dated function `setRenderDepth` instead of `addToRenderList` (thanks Harm)
* When a loaded JSON file fails to parse, it's marked `FILE_ERRORED` and the Loader continues. Before this change the Loader would stall (thanks @samme)
* `Math.FromPercent` silently assumed the `min` parameter to be 0. It can now be any value, allowing you to generate percentages between `min` and `max` correctly (thanks @somechris)
* The Container and Zone Game Objects were not handling being added to the render list, causing them to fail input detection tests. Fix #5506 #5508 (thanks @rexrainbow @vforsh @Nightspeller)
* `IsometricWorldToTileXY` was returning a tile incorrectly offset from the given coordinates. It now returns from the expected location (thanks @veleek)
* `DOMElementCSSRenderer` will now return early if `src.node` doesn't exist or is null, rather than trying to extract the `style` property from it. Fix #5566 (thanks @rattias)
* The BitmapMask will now check to see if `renderer` exists before trying to hook to its event emitter (thanks @mattjennings)
* TileSprite will now check to see if `renderer` exists before trying to restore itself during a context loss (thanks @mattjennings)
* A Texture will now check to see if `renderer` exists before resetting the WebGL textures (thanks @mattjennings)
* Destroying a Text Game Object when using the HEADLESS renderer would cause an `Uncaught TypeError`. Fix #5558 (thanks @mattjennings)
* The `Actions.PlayAnimation` arguments have been updated to match the new animation system introduced in Phaser 3.50. It will now take either a string-key, or a play animation configuration object, and the `startFrame` parameter has been replaced with `ignoreIfPlaying`. The function will also only call `play` if the Game Object has an animation component, meaning you can now supply this action with a mixed-content array without errors. Fix #5555 (thanks @xuxucode)
* `RenderTarget.resize` will now `Math.floor` the scaled width and height as well as ensure they're not <= 0 which causes  `Framebuffer status: Incomplete Attachment` errors. Fix #5563 #5478 (thanks @orjandh @venarius)
* `Matter.Components.Sleep.setToSleep` and `setAwake` were documented as returning `this`, however they didn't return anything. Both now `return this` correctly. Fix #5567 (thanks @micsun-al)
* The Particle position would be wrong when set to follow a Sprite using the Canvas Renderer. Fix #5457 (thanks @samme)
* Fixed a conditional bug in Arcade Physics `ProcessX` when Body2 is Immovable and Body1 is not.
* The Spine Plugin would throw an error while unloading and restarting the game. Fix #5477 (thanks @ayamomiji @Pong420)
* The Spine Plugin would cause all textures to render as blue if a Spine object followed any Game Object using the Graphics Pipeline on the display list, due to the gl context restoration not being properly handled. Fix #5493 #5449 (thanks @EmilSV @FloodGames)
* Spine Game Objects and Containers will now add themselves to the Camera render list, fixing issues where input didn't work if depth was used or they were overlapped with another interactive Game Object.
* Calling `Group.destroy` would cause a runtime error if `Group.runChildUpdate` had been set. Fix #5576 (thanks @samme)
* Moving a Sprite from a Container or Layer to the Scene would fail without first resetting the display list. Fix #5535 (thanks @malahaas @samme @tringcooler)

### Examples, Documentation and TypeScript

My thanks to the following for helping with the Phaser 3 Examples, Docs, and TypeScript definitions, either by reporting errors, fixing them, or helping author the docs:

@edemaine @xuxucode @schontz @kaktus42 @Nero0 @samme

## Version 3.52.0 - Crusch - 14th January 2021

### New Features

* The `getPostPipeline` method available on most Game Objects will now return an array of piplines if an instance is given and the Game Object has more than one of those pipelines set on it. If only one pipeline is set, it will be returned directly.

### Updates

* `BaseCamera.renderList` is a new array that is populated with all Game Objects that the camera has rendered in the current frame. It is automatically cleared during `Camera.preUpdate` and is an accurate representation of the Game Objects the Camera rendered. It's used internally by the Input Plugin, but exposed should you wish to read the contents or use it for profiling.
* `BaseCamera.addToRenderList` is a new method that will add the given Game Object to the Cameras current render list.
* The `InputPlugin.sortGameObjects` method now uses the new Camera render list to work out the display index depths.
* The `InputPlugin.sortDropZones` method is a new method, based on the old `sortGameObjects` method that is used for sorting input enabled drop zones.
* The background color behind the game url in the banner is now transparent, so it looks correct with dark dev tools themes (thanks @kainage)

### Bug Fixes

* `WebAudioSound.destroy` now checks to see if `pannerNode` exists before disabling it, preventing an error in Safari (thanks @jdcook)
* Fixed the cause of `Uncaught TypeError: Cannot read property 'getIndex' of null` by checking the display list property securely. Fix #5489 (thanks @actionmoon)
* Fixed an issue where adding input-enabled Game Objects to a Layer would have the input system ignore their depth settings. Fix #5483 (thanks @pr4xx)
* The method `TilemapLayer.weightedRandomize` has changed so that the parameter `weightedIndexes` is now first in the method and is non-optional. Previously, it was the 5th parameter and incorrectly flagged as optional. This change was made to the docs but not the parameters, but now works according to the docs (thanks Fantasix)
* The Mesh `GenerateVerts` function was returning an object with the property `verts` instead of `vertices` as expected by the `Mesh.addVertices` method. It now returns the correct name (thanks @lackhand)
* `AtlasJSONFile` will now call `File.pendingDestroy`, clearing up the resources it used during load and emitting a missing `FILE_COMPLETE` event. Fix #5495 (thanks @mikuso)
* `AtlasJSONFile`, `AtlasXMLFile`, `BitmapFontFile` and `UnityAtlasFile` will now call `File.pendingDestroy`, clearing up the resources it used during load and emiting a missing `FILE_COMPLETE` event. Fix #5495 (thanks @mikuso)
* Some Bitmap Text fonts were not rendering under Canvas due to the way in which the texture offset was calculated. It now uses the `__BASE` frame to get the texture offset, rather than the first frame in the set. Fix #5462 #5501 (thanks @monteiz @DPMakerQB)

### Examples, Documentation and TypeScript

My thanks to the following for helping with the Phaser 3 Examples, Docs, and TypeScript definitions, either by reporting errors, fixing them, or helping author the docs:

@ygongdev Tucker @lackhand

## Version 3.51.0 - Emilia - 5th January 2021

### New Features

* `WebGLRenderer.isTextureClean` is a new boolean property that tracks of all of the multi-textures are in a clean 'default' state, to avoid lots of gl texture binds and activations during a Scene restart or destruction process.
* `GameObject.removePostPipeline` would previously only remove a single pipeline instance. Calling the method with a class will now clear all instances of the pipeline class from the Game Object (thanks @rexrainbow)

### Updates

* `Layer.destroy` will now call `destroy` on all of its children as well.
* The `Layer` Game Object has been given all of the missing properties and methods from Game Object to make the class shapes identical. This includes the properties `parentContainer`, `tabIndex`, `input` and `body`. You cannot set any of these properties, they are ignored by the Layer itself. It also includes the methods: `setInteractive`, `disableInteractive` and `removeInteractive`. A Layer cannot be enabled for input or have a physics body. Fix #5459 (thanks @PhaserEditor2D)
* `Layer.getIndexList` is a new method, taken from the Game Object, that will return the index of the Layer in the display list, factoring in any parents.

### Bug Fixes

* On some keyboards it was possible for the `keyup` event to not fire because it was filtered out by the Keyboard Plugin repeat key check. Fix #5472 (thanks @cjw6k)
* Fixed issue causing `Cannot read property 'pipelines' of null` to be thrown if using 3.50 with the HEADLESS renderer. Fix #5468 (thanks @Grenagar)
* Canvas Tilemap Rendering is now working again. Fix #5480 (thanks @marshmn)
* `Layer.destroy` will now emit the `DESTROY` event at the start of the method. Fix #5466 (thanks @samme)
* The error `RENDER WARNING: there is no texture bound to the unit ...` would be thrown when trying to restart a Scene. When a Scene is shutdown is will now reset the WebGL Texture cache. Fix #5464 (thanks @ffx0s)
* The error `RENDER WARNING: there is no texture bound to the unit ...` would be thrown when destroying a Text Game Object, or any Game Object that uses its own custom texture. Destroying such an object will now reset the WebGL Texture cache. Fix #5464 (thanks @mark-rushakoff)
* When using an asset pack with a prefix, and loading a Spine file, the prefix was being appended twice causing the texture to fail loading. It's now appended correctly (thanks @jdcook)

### Examples, Documentation and TypeScript

My thanks to the following for helping with the Phaser 3 Examples, Docs, and TypeScript definitions, either by reporting errors, fixing them, or helping author the docs:

@pol0nium @ErinLMoore @umi-tyaahan @nk9

## Version 3.50.1 - Subaru - 21st December 2020

* The new Web Audio Panning feature breaks WebAudio on Safari (OSX and iOS). The stereo panner node is now only created if supported. Fix #5460 (thanks @d4rkforce)
