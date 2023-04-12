# Version 3.60.0 - Miku - 12th April 2023

## New Features

* [Built-in Spector JS](Spector.md) for WebGL debugging on desktop and mobile
* New and improved [Video Game Object](VideoGameObject.md)
* New [Timeline Sequencer](Timeline.md)
* [ESM Module Support](ESMSupport.md)
* Built-in [Special FX](SpecialFX.md) including Bloom, Blur, Distort and more
* Support for [Spatial Audio](SpatialAudio.md)
* New [Spine 4 Plugin](Spine4.md)
* New [Plane Game Object](PlaneGameObject.md) for perspective distortions
* New [Nine Slice Game Object](NineSliceGameObject.md) for perfect UI scaling
* Support for [Compressed Textures](CompressedTextures.md)
* Brand new [Particle Emitter](ParticleEmitter.md) system with loads of new features
* Upgraded to [Matter Physics v0.19](MatterPhysics.md)
* New [Tween Manager](TweenManager.md) for better performance and memory management
* New [Dynamic Textures](DynamicTextures.md) for rendering to textures at runtime
* Vastly improved [WebGL Renderer](WebGLRenderer.md) mobile performance and other updates and pipeline changes
* New [TimeStep features](TimeStep.md) for enforcing fps rates and more

## Updates

* [Spine 3 Plugin](Spine3.md) bug fixes and updates
* [Input System](Input.md) bug fixes and updates
* [Loader and File Type](Loader.md) bug fixes and updates
* [Sound Manager](Sound.md) bug fixes and updates


### New Features

* The Hexagonal Tilemap system now supports all 4 different types of layout as offered by Tiled: `staggeraxis-y + staggerindex-odd`, `staggeraxis-x + staggerindex-odd`, `staggeraxis-y + staggerindex-even` and `staggeraxis-x, staggerindex-even` (thanks @rexrainbow)
* The Arcade Physics World has a new property `tileFilterOptions` which is an object passed to the `GetTilesWithin` methods used by the Sprite vs. Tilemap collision functions. These filters dramatically reduce the quantity of tiles being checked for collision, potentially saving thousands of redundant math comparisons from taking place.
* The `Graphics.strokeRoundedRect` and `fillRoundedRect` methods can now accept negative values for the corner radius settings, in which case a concave corner is drawn instead (thanks @rexrainbow)
* `AnimationManager.getAnimsFromTexture` is a new method that will return all global Animations, as stored in the Animation Manager, that have at least one frame using the given Texture. This will not include animations created directly on local Sprites.
* `BitmapText.setLineSpacing` is a new method that allows you to set the vertical spacing between lines in multi-line BitmapText Game Objects. It works in the same was as spacing for Text objects and the spacing value can be positive or negative. See also `BitmapText.lineSpacing` for the property rather than the method.
* `WebGLPipeline.vertexAvailable` is a new method that returns the number of vertices that can be added to the current batch before it will trigger a flush.
* The `Tilemap` and `TilemapLayer` classes have a new method `getTileCorners`. This method will return an array of Vector2s with each entry corresponding to the corners of the requested tile, in world space. This currently works for Orthographic and Hexagonal tilemaps.
* `Animation.showBeforeDelay` is a new optional boolean property you can set when creating, or playing an animation. If the animation has a delay before playback starts this controls if it should still set the first frame immediately, or after the delay has expired (the default).
* `InputPlugin.resetPointers` is a new method that will loop through all of the Input Manager Pointer instances and reset them all. This is useful if a 3rd party component, such as Vue, has stolen input from Phaser and you need to reset its input state again.
* `Pointer.reset` is a new method that will reset a Pointer instance back to its 'factory' settings.
* When using `Group.createMultiple` it will now skip the post-creations options if they are not set in the config object used, or a Game Object constructor. Previously, things like alpha, position, etc would be over-written by the defaults if they weren't given in the config, but now the method will check to see if they are set and only use them if they are. This is a breaking change, but makes it more efficient and flexible (thanks @samme)
* When running a Scene transition there is a new optional callback `onStart`, which is passed the parameters `fromScene`, `toScene` and `duration` allowing you to consolidate transition logic into a single callback, rather than split across the start and end events (thanks @rexrainbow)
* `TextureManager.silentWarnings` is a new boolean property that, when set, will prevent the Texture Manager from emiting any warnings or errors to the console in the case of missing texture keys or invalid texture access. The default is to display these warnings, this flag toggles that.
* `TextureManager.parseFrame` is a new method that will return a Texture Frame instance from the given argument, which can be a string, array, object or Texture instance.
* `GameConfig.stableSort` and `Device.features.stableSort` is a new property that will control if the internal depth sorting routine uses our own StableSort function, or the built-in browser `Array.sort`. Only modern browsers have a _stable_ `Array.sort` implementation, which Phaser requires. Older ones need to use our function instead. Set to 0 to use the legacy version, 1 to use the ES2019 version or -1 to have Phaser try and detect which is best for the browser (thanks @JernejHabjan)
* `Device.es2019` is a new boolean that will do a basic browser type + version detection to see if it supports ES2019 features natively, such as stable array sorting.
* All of the following Texture Manager methods will now allow you to pass in a Phaser Texture as the `source` parameter: `addSpriteSheet`, `addAtlas`, `addAtlasJSONArray`, `addAtlasJSONHash`, `addAtlasXML` and `addAtlasUnity`. This allows you to add sprite sheet or atlas data to existing textures, or textures that came from external sources, such as SVG files, canvas elements or Dynamic Textures.
* `Game.pause` is a new method that will pause the entire game and all Phaser systems.
* `Game.resume` is a new method that will resume the entire game and resume all of Phaser's systems.
* `Game.isPaused` is a new boolean that tracks if the Game loop is paused, or not (and can also be toggled directly)
* `ScaleManager.getViewPort` is a new method that will return a Rectangle geometry object that matches the visible area of the screen, or the given Camera instance (thanks @rexrainbow)
* When starting a Scene and using an invalid key, Phaser will now raise a console warning informing you of this, instead of silently failing. Fix #5811 (thanks @ubershmekel)
* `GameObjects.Layer.addToDisplayList` and `removeFromDisplayList` are new methods that allows for you to now add a Layer as a child of another Layer. Fix #5799 (thanks @samme)
* `GameObjects.Video.loadURL` has a new optional 4th parameter `crossOrigin`. This allows you to specify a cross origin request type when loading the video cross-domain (thanks @rmartell)
* You can now set `loader.imageLoadType: "HTMLImageElement"` in your Game Configuration and the Phaser Loader will use an Image Tag to load all images, rather than XHR and a Blob object which is the default. This is a global setting, so all file types that use images, such as Atlas or Spritesheet, will be changed via this flag (thanks @hanzooo)
* You can now control the drawing offset of tiles in a Tileset using the new optional property `Tileset.tileOffset` (which is a Vector2). This property is set automatically when Tiled data is parsed and found to contain it. Fix #5633 (thanks @moJiXiang @kainage)
* You can now set the alpha value of the Camera Flash effect before running it, where-as previously it was always 1 (thanks @kainage)
* The `Tilemap.createFromObjects` method has been overhauled to support typed tiles from the Tiled Map Editor (https://doc.mapeditor.org/en/stable/manual/custom-properties/#typed-tiles). It will now also examine the Tileset to inherit properties based on the tile gid. It will also now attempt to use the same texture and frame as Tiled when creating the object (thanks @lackhand)
* `TweenManager.reset` is a new method that will take a tween, remove it from all internal arrays, then seek it back to its start and set it as being active.
* The `Video` config will now detect for `x-m4v` playback support for video formats and store it in the `Video.m4v` property. This is used automatically by the `VideoFile` file loader. Fix #5719 (thanks @patrickkeenan)
* The `KeyboardPlugin.removeKey` method has a new optional parameter `removeCapture`. This will remove any keyboard capture events for the given Key. Fix #5693 (thanks @cyantree)
* The `KeyboardPlugin.removeAllKeys` method has a new optional parameter `removeCapture`. This will remove any keyboard capture events for all of the Keys owned by the plugin.
* `WebGLShader.fragSrc` is a new property that holds the source of the fragment shader.
* `WebGLShader.vertSrc` is a new property that holds the source of the vertex shader.
* `WebGLShader#.createProgram` is a new method that will destroy and then re-create the shader program based on the given (or stored) vertex and fragment shader source.
* `WebGLShader.setBoolean` is a new method that allows you to set a boolean uniform on a shader.
* `WebGLPipeline.setBoolean` is a new method that allows you to set a boolean uniform on a shader.
* `Phaser.Scenes.Systems.getStatus` is a new method that will return the current status of the Scene.
* `Phaser.Scenes.ScenePlugin.getStatus` is a new method that will return the current status of the given Scene.
* `Math.LinearXY` is a new function that will interpolate between 2 given Vector2s and return a new Vector2 as a result (thanks @GregDevProjects)
* `Curves.Path.getCurveAt` is a new method that will return the curve that forms the path at the given location (thanks @natureofcode)
* You can now use any `Shape` Game Object as a Geometry Mask. Fix #5900 (thanks @rexrainbow)
* `Mesh.setTint` is a new method that will set the tint color across all vertices of a Mesh (thanks @rexrainbow)
* `Mesh.tint` is a new setter that will  set the tint color across all vertices of a Mesh (thanks @rexrainbow)
* `Mesh.clearTint` is a new method that will clear the tint from all vertices of a Mesh (thanks @rexrainbow)
* You can now use dot notation as the datakey when defining a Loader Pack File (thanks @rexrainbow)
* `Vector2.project` is a new method that will project the vector onto the given vector (thanks @samme)
* Experimental feature: The `TilemapLayer` now has the `Mask` component - meaning you can apply a mask to tilemaps (thanks @samme)
* `TilemapLayer.setTint` is a new method that allows you to set the tint color of all tiles in the given area, optionally based on the filtering search options. This is a WebGL only feature.
* `UtilityPipeline.blitFrame` has a new optional boolean parameter `flipY` which, if set, will invert the source Render Target while drawing it to the destination Render Target.
* `GameObjects.Polygon.setTo` is a new method that allows you to change the points being used to render a Polygon Shape Game Object. Fix #6151 (thanks @PhaserEditor2D)
* `maxAliveParticles` is a new Particle Emitter config property that sets the maximum number of _alive_ particles the emitter is allowed to update. When this limit is reached a particle will have to die before another can be spawned.
* `Utils.Array.Flatten` is a new function that will return a flattened version of an array, regardless of how deeply-nested it is.
* `GameObjects.Text.appendText` is a new method that will append the given text, or array of text, to the end of the content already stored in the Text object.
* `Textures.Events.ADD_KEY` is a new event dispatched by the Texture Manager when a texture with the given key is added, allowing you to listen for the addition of a specific texture (thanks @samme)
* `Textures.Events.REMOVE_KEY` is a new event dispatched by the Texture Manager when a texture with the given key is removed, allowing you to listen for the removal of a specific texture (thanks @samme)

### Geom Updates

The following are API-breaking, in that a new optional parameter has been inserted prior to the output parameter. If you use any of the following functions, please update your code:

* The `Geom.Intersects.GetLineToLine` method has a new optional parameter `isRay`. If `true` it will treat the first line parameter as a ray, if false, as a line segment (the default).
* The `Geom.Intersects.GetLineToPoints` method has a new optional parameter `isRay`. If `true` it will treat the line parameter as a ray, if false, as a line segment (the default).
* The `Geom.Intersects.GetLineToPolygon` method has a new optional parameter `isRay`. If `true` it will treat the line parameter as a ray, if false, as a line segment (the default).
* `Geom.Intersects.GetRaysFromPointToPolygon` uses the new `isRay` parameter to enable this function to work fully again.


### Updates

* We've added a polyfill for the `requestVideoFrameCallback` API because not all current browsers support it, but the Video Game Object now relies upon it.
* `Tilemap.getLayerIndex` will now return `null` if a given TilemapLayer instance doesn't belong to the Tilemap or has been destroyed.
* The default callback context of the `TimerEvent` has changed to be the `TimerEvent` instance itself, rather than the context (thanks @samme)
* You will now get a warning from the `AnimationManager` and `AnimationState` if you try to add an animation with a key that already exists. Fix #6434.
* `Tilemap.addTilesetImage` has a new optional parameter `tileOffset` which, if given, controls the rendering offset of the tiles. This was always available on the Tileset itself, but not from this function (thanks @imothee)
* The `GameObject.getBounds` method will now return a `Geom.Rectangle` instance, rather than a plain Object (thanks @samme)
* The `GetBounds.getCenter` method now has an optional `includeParent` argument, which allows you to get the value in world space.
* The `MatterTileBody` class, which is created when you convert a Tilemap into a Matter Physics world, will now check to see if the Tile has `flipX` or `flipY` set on it and rotate the body accordingly. Fix #5893 (thanks @Olliebrown @phaserhelp)
* The `BaseCamera` has had its `Alpha` component replaced with `AlphaSingle`. Previously you had access to properties such as `alphaTopLeft` that never worked, now it correctly has just a single alpha property (thanks @samme)
* `Time.Clock.startTime` is a new property that stores the time the Clock (and therefore the Scene) was started. This can be useful for comparing against the current time to see how much real world time has elapsed (thanks @samme)
* `ColorMatrix._matrix` and `_data` are now Float32Arrays.
* Calling the `ColorMatrix.set`, `reset` and `getData` methods all now use the built-in Float32 Array operations, making them considerably faster.
* `ColorMatrix.BLACK_WHITE` is a new constant used by blackwhite operations.
* `ColorMatrix.NEGATIVE` is a new constant used by negative operations.
* `ColorMatrix.DESATURATE_LUMINANCE` is a new constant used by desaturation operations.
* `ColorMatrix.SEPIA` is a new constant used by sepia operations.
* `ColorMatrix.LSD` is a new constant used by LSD operations.
* `ColorMatrix.BROWN` is a new constant used by brown operations.
* `ColorMatrix.VINTAGE` is a new constant used by vintage pinhole operations.
* `ColorMatrix.KODACHROME` is a new constant used by kodachrome operations.
* `ColorMatrix.TECHNICOLOR` is a new constant used by technicolor operations.
* `ColorMatrix.POLAROID` is a new constant used by polaroid operations.
* `ColorMatrix.SHIFT_BGR` is a new constant used by shift BGR operations.
* `Texture.has` will now return a strict boolean, rather than an object that can be cooerced into a boolean (thanks @samme)
* The `CanvasTexture.draw` method has a new optional parameter `update` which allows you to control if the internal ImageData is recalculated, or not (thanks @samme)
* The `CanvasTexture.drawFrame` method has a new optional parameter `update` which allows you to control if the internal ImageData is recalculated, or not (thanks @samme)
* The `CanvasTexture.clear` method has a new optional parameter `update` which allows you to control if the internal ImageData is recalculated, or not (thanks @samme)
* The `Game.registry`, which is a `DataManager` instance that can be used as a global store of game wide data will now use its own Event Emitter, instead of the Game's Event Emitter. This means it's perfectly safe for you to now use the Registry to emit and listen for your own custom events without conflicting with events the Phaser Game instance emits.
* The `GenerateVerts` function has a new optional parameter `flipUV` which, if set, will flip the UV texture coordinates (thanks cedarcantab)
* The `GenerateVerts` function no longer errors if the verts and uvs arrays are not the same size and `containsZ` is true (thanks cedarcantab)
* The `Device.Browser` checks for Opera and Edge have been updated to use the more modern user agent strings those browsers now use. This breaks compatibility with really old versions of those browsers but fixes it for modern ones (which is more important) (thanks @
ArtemSiz)
* The `SceneManager.processQueue` method will no longer `return` if a new Scene was added, after starting it. This allows any other queued operations to still be run in the same frame, rather than being delayed until the next game frame. Fix #5359 (thanks @telinc1)
* `Camera.scrollX` and `scrollY` will now only set the `Camera.dirty` flag to `true` if the new value given to them is different from their current value. This allows you to use this property in your own culling functions. Fix #6088 (thanks @Waclaw-I)
* `Face.update` is a new method that updates each of the Face vertices. This is now called internally by `Face.isInView`.
* `Vertex.resize` is a new method that will set the position and then translate the Vertex based on an identity matrix.
* The `Vertex.update` method now returns `this` to allow it to be chained.
* You can now optionally specify the `maxSpeed` value in the Arcade Physics Group config (thanks @samme)
* You can now optionally specify the `useDamping` boolean in the Arcade Physics Group config (thanks @samme)
* Removed the `HexagonalTileToWorldY` function as it cannot work without an X coordinate. Use `HexagonalTileToWorldXY` instead.
* Removed the `HexagonalWorldToTileY` function as it cannot work without an X coordinate. Use `HexagonalWorldToTileXY` instead.
* Earcut has been updated to version 2.2.4. This release improves performance by 10-15% and fixes 2 rare race conditions that could leave to infinite loops. Earcut is used internally by Graphics and Shape game objects when triangulating polygons for complex shapes.
* The `CONTEXT_RESTORED` Game Event has been removed and the WebGL Renderer no longer listens for the `contextrestored` DOM event, or has a `contextRestoredHandler` method. This never actually worked properly, in any version of Phaser 3 - although the WebGLRenderer would be restored, none of the shaders, pipelines or textures were correctly re-created. If a context is now lost, Phaser will display an error in the console and all rendering will halt. It will no longer try to re-create the context, leading to masses of WebGL errors in the console. Instead, it will die gracefully and require a page reload.
* The `Text` and `TileSprite` Game Objects no longer listen for the `CONTEXT_RESTORED` event and have had their `onContextRestored` methods removed.
* `Scenes.Systems.canInput` is a new internal method that determines if a Scene can receive Input events, or not. This is now used by the `InputPlugin` instead of the previous `isActive` test. This allows a Scene to emit and handle input events even when it is running `init` or `preload`. Previously, it could only do this after `create` had finished running. Fix #6123 (thanks @yaasinhamidi)
* The `BitmapText` Game Object has two new read-only properties `displayWidth` and `displayHeight`. This allows the BitmapText to correctly use the `GetBounds` component.
* The `BitmapText` Game Object now has the `GetBounds` component added to it, meaning you can now correctly get its dimensions as part of a Container. Fix #6237 (thanks @likwidgames)
* `WebGLSnapshot` will now flip the pixels in the created Image element if the source was a framebuffer. This means grabbing a snapshot from a Dynamic or Render Texture will now correctly invert the pixels on the y axis for an Image. Grabbing from the game renderer will skip this.
* `WebGLRenderer.snapshotFramebuffer` and by extension, the snapshot methods in Dynamic Textures and Render Textures, has been updated to ensure that the width and height never exceed the framebuffer dimensions, or it'll cause a runtime error. The method `snapshotArea` has had this limitation removed as a result, allowing you to snapshot areas that are larger than the Canvas. Fix #5707 (thanks @teng-z)
* `Animation.stop` is always called when a new animation is loaded, regardless if the animation was playing or not and the `delayCounter` is reset to zero. This stops animations with delays preventing other animations from being started until the delay has expired. Fix #5680 (thanks @enderandpeter)
* `ScaleManager.listeners` has been renamed to `domlisteners` to avoid conflicting with the EventEmitter listeners object. Fix #6260 (thanks @x-wk)
* `Geom.Intersects.LineToLine` will no longer create an internal `Point` object, as it's not required internally (thanks @Trissolo)
* The `tempZone` used by `GridAlign` has now had `setOrigin(0, 0)` applied to it. This leads to more accurate / expected zone placement when aligning grid items.
* The `GetBitmapTextSize` function now includes an extra property in the resulting `BitmapTextCharacter` object called `idx` which is the index of the character within the Bitmap Text, without factoring in any word wrapping (thanks @JaroVDH)
* `Camera.isSceneCamera` is a new boolean that controls if the Camera belongs to a Scene (the default), or a Texture. You can set this via the `Camera.setScene` method. Once set the `Camera.updateSystem` method is skipped, preventing the WebGL Renderer from setting a scissor every frame.
* `Camera.preRender` will now apply `Math.floor` instead of `Math.round` to the values, keeping it consistent with the Renderer when following a sprite.
* When rendering a Sprite with a Camera set to `roundPixels` it will now run `Math.floor` on the Matrix position, preventing you from noticing 'jitters' as much when Camera following sprites in heavily zoomed Camera systems.
* `TransformMatrix.setQuad` is a new method that will perform the 8 calculations required to create the vertice positions from the matrix and the given values. The result is stored in the new `TransformMatrix.quad` Float32Array, which is also returned from this method.
* `TransformMatrix.multiply` now directly updates the Float32Array, leading to 6 less getter invocations.
* The `CameraManager.getVisibleChildren` method now uses the native Array filter function, rather than a for loop. This should improve performance in some cases (thanks @JernejHabjan)
* `SceneManager.systemScene` is a new property that is set during the game boot and is a system Scene reference that plugins and managers can use, that lives outside of the Scene list.
* The `TextureManager.get` methof can now accept a `Frame` instance as its parameter, which will return the frames parent Texture.
* The `GameObject.setFrame` method can now accept a `Frame` instance as its parameter, which will also automatically update the Texture the Game Object is using.
* `Device.safariVersion` is now set to the version of Safari running, previously it was always undefined.
* When you try to use a frame that is missing on the Texture, it will now give the key of the Texture in the console warning (thanks @samme)
* The `hitArea` parameter of the `GameObjects.Zone.setDropZone` method is now optional and if not given it will try to create a hit area based on the size of the Zone Game Object (thanks @rexrainbow)
* The `DOMElement.preUpdate` method has been removed. If you overrode this method, please now see `preRender` instead.
* `DOMElement.preRender` is a new method that will check parent visibility and improve its behavior, responding to the parent even if the Scene is paused or the element is inactive. Dom Elements are also no longer added to the Scene Update List. Fix #5816 (thanks @prakol16 @samme)
* Phaser 3 is now built with webpack 5 and all related packages have been updated.
* Previously, an Array Matrix would enforce it had more than 2 rows. This restriction has been removed, allowing you to define and rotate single-row array matrices (thanks @andriibarvynko)
* The Gamepad objects now have full TypeScript definitions thanks to @sylvainpolletvillard
* Lots of configuration objects now have full TypeScript definitions thanks to @16patsle
* `Particle.fire` will now throw an error if the particle has no texture frame. This prevents an uncaught error later when the particle fails to render. Fix #5838 (thanks @samme @monteiz)
* `ParticleEmitterManager.setEmitterFrames` will now print out console warnings if an invalid texture frame is given, or if no texture frames were set. Fix #5838 (thanks @samme @monteiz)
* `SceneManager.stop` and `sleep` will now ignore the call if the Scene has already been shut down, avoiding potential problems with duplicate event handles. Fix #5826 (thanks @samme)
* Removed the `Tint` and `Flip` components from the `Camera` class. Neither were ever used internally, or during rendering, so it was just confusing having them in the API.
* A new `console.error` will be printed if the `File`, `MultiFile`, `JSONFile` or `XMLFile` fail to process or parse correctly, even if they manage to load. Fix #5862 #5851 (thanks @samme @ubershmekel)
* The `ScriptFile` Loader File Type has a new optional parameter: `type`. This is a string that controls the type attribute of the `<script>` tag that is generated by the Loader. By default it is 'script', but you can change it to 'module' or any other valid type.
* The JSON Hash and Array Texture Parsers will now throw a console.warn if the JSON is invalid and contains identically named frames.
* `Scene.pause` will now check to see if the Scene is in either a RUNNING or CREATING state and throw a warning if not. You cannot pause non-running Scenes.
* `Mesh.addVertices` will now throw a console warning if invalid vertices data is given to the method (thanks @omniowl)
* `Mesh.addVerticesFromObj` will now throw a console warning if invalid vertices data is given to the method (thanks @omniowl)
* `TouchManager.onTouchOver` and `onTouchOut` have been removed, along with all of their related event calls as they're not used by any browser any more.
* `TouchManager.isTop` is a new property, copied from the MouseManager, that retains if the window the touch is interacting with is the top one, or not.
* The `InputManager.onTouchMove` method will now check if the changed touch is over the canvas, or not, via the DOM `elementFromPoint` function. This means if the touch leaves the canvas, it will now trigger the `GAME_OUT` and `GAME_OVER` events, where-as before this would only happen for a Mouse. If the touch isn't over the canvas, no Pointer touch move happens, just like with the mouse. Fix #5592 (thanks @rexrainbow)
* `TileMap.createBlankDynamicLayer` has now been removed as it was deprecated in 3.50.
* `TileMap.createDynamicLayer` has now been removed as it was deprecated in 3.50.
* `TileMap.createStaticLayer` has now been removed as it was deprecated in 3.50.
* `Animations.AnimationManager.createFromAseprite` has a new optional 3rd parameter `target`. This allows you to create the animations directly on a Sprite, instead of in the global Animation Manager (thanks Telemako)
* `Animations.AnimationState.createFromAseprite` is a new method that allows you to create animations from exported Aseprite data directly on a Sprite, rather than always in the global Animation Manager (thanks Telemako)
* The `path` package used by the TS Defs generator has been moved to `devDependencies` (thanks @antkhnvsk)
* The `GetValue` function has a new optional parameter `altSource` which allows you to provide an alternative object to source the value from.
* The `Renderer.Snapshot.WebGL` function has had its first parameter changed from an `HTMLCanvasElement` to a `WebGLRenderingContext`. This is now passed in from the `snapshot` methods inside the WebGL Renderer. The change was made to allow it to work with WebGL2 custom contexts (thanks @andymikulski)
* If you start a Scene that is already starting (START, LOADING, or CREATING) then the start operation is now ignored (thanks @samme)
* If you start a Scene that is Sleeping, it is shut down before starting again. This matches how Phaser currently handles paused scenes (thanks @samme)
* The right-click context menu used to be disabled on the document.body via the `disableContextMenu` function, but instead now uses the MouseManager / TouchManager targets, which if not specified defaults to the game canvas. Fix # (thanks @lukashass)
* The Particle 'moveTo' calculations have been simplied and made more efficient (thanks @samme)
* The `Key.reset` method no longer resets the `Key.enabled` or `Key.preventDefault` booleans back to `true` again, but only resets the state of the Key. Fix #6098 (thanks @descodifica)
* When setting the Input Debug Hit Area color it was previously fixed to the value given when created. The value is now taken from the object directly, meaning you can set `gameObject.hitAreaDebug.strokeColor` in real-time (thanks @spayton)
* You can now have a particle frequency smaller than the delta step, which would previously lead to inconsistencies in emission rates (thanks @samme)
* The `Light` Game Object now has the `Origin` and `Transform` components, along with 4 new properties: `width`, `height`, `displayWidth` and `displayHeight`. This allows you to add a Light to a Container, or enable it for physics. Fix #6126 (thanks @jcoppage)
* The `Transform` Component has a new boolean read-only property `hasTransformComponent` which is set to `true` by default.
* The Arcade Physics `World.enableBody` method will now only create and add a `Body` to an object if it has the Transform component, tested by checking the `hasTransformComponent` property. Without the Transform component, creating a Body would error with NaN values, causing the rest of the bodies in the world to fail.
* `ProcessQueue.isActive` is a new method that tests if the given object is in the active list, or not.
* `ProcessQueue.isPending` is a new method that tests if the given object is in the pending insertion list, or not.
* `ProcessQueue.isDestroying` is a new method that tests if the given object is pending destruction, or not.
* `ProcessQueue.add` will no longer place the item into the pending list if it's already active or pending.
* `ProcessQueue.remove` will check if the item is in the pending list, and simply remove it, rather than destroying it.
* `Container.addHandler` will now call `GameObject.addedToScene`.
* `Container.removeHandler` will now call `GameObject.removedFromScene`.
* If defined, the width and height of an input hit area will now be changed if the Frame of a Game Object changes. Fix #6144 (thanks @rexrainbow)
* When passing a `TextStyle` configuration object to the Text Game Objects `setStyle` method, it would ignore any `metrics` data it may contain and reset it back to the defaults. It will now respect the `metrics` config and use it, if present. Fix #6149 (thanks @michalfialadev)
* A Texture `ScaleMode` will now override the Game Config `antialias` setting under the Canvas Renderer, where-as before if `antialias` was `true` then it would ignore the scale mode of the texture (thanks @Cirras)
* The `Physics.Arcade.Body.reset()` method will now call `Body.checkWorldBounds` as part of the process, moving the body outside of the bounds, should you have positioned it so they overlap during the reset. Fix #5978 (thanks @lukasharing)
* The temporary canvas created in `CanvasFeatures` for the `checkInverseAlpha` test is now removed from the CanvasPool after use.
* The `CanvasFeatures` tests and the TextureManager `_tempContext` now specify the `{ willReadFrequently: true }` hint to inform the browser the canvas is to be read from, not composited.
* When calling `TextureManager.getTextureKeys` it will now exclude the default `__WHITE` texture from the results (thanks @samme)
* If the WebGL Renderer logs an error, it will now show the error string, or the code if not present in the error map (thanks @zpxp)
* The `Texture.destroy` method will only destroy sources, dataSources and frames if they exist, protecting against previously destroyed instances.

### Bug Fixes

* `Matter.convertTilemapLayers` had an edge-case which could create composite bodies unintentionally. If any tiles had multiple colliders and you were providing body creation options, the `parts` property in the options would be modified and then concatenated with any bodies created after it. This could mean that some tiles would be combined when they shouldn't be, and on large maps would eventually hang once the convex hull got too big / complex. It now runs a copy on the object before using it (thanks @EddieCameron)
* The `TilemapLayer.skipCull` feature wasn't being applied correctly for Isometric, Hexagonal or Staggered tiles, only for Orthographic tiles (the default). It will now respect the `skipCull` property and return all tiles during culling if enabled. Fix #5524 (thanks @veleek)
* Shutting down a Scene that didn't have the `LoaderPlugin` would throw an error when removing event handlers. It now checks first, before removing (thanks @samme)
* The `renderFlags` property, used to determine if a Game Object will render, or not, would be calculated incorrectly depending on the order of the `scaleX` and `scaleY` properties. It now works regardless of the order (thanks @mizunokazumi)
* The `SpriteSheetFromAtlas` parser was using the incorrect `sourceIndex` to grab frames from a given texture. This caused a crash whenever a trimmed spritesheet was added from any multiatlas image other than the first (thanks @Bambosh)
* The `maxSpeed` setting in Arcade Physics wasn't recalculated during the Body update, prior to being compared, leading to inconsistent results. Fix #6329 (thanks @Bambosh)
* Several paths have been fixed in the `phaser-core.js` entry point (thanks @pavle-goloskokovic)
* When a Game Object had Input Debug Enabled the debug image would be incorrectly offset if the Game Object was attached to was scaled and the hit area shape was smaller, or offset, from the Game Object. Fix #4905 #6317 (thanks @PavelMishin @justinlueders)
* An inactive Scene is no longer updated after a Scene transition completes. Previously, it will still update the Scene one final time. This fix also prevents the `POST_UPDATE` event from firing after the transition is over. Fix #5550 (thanks @mijinc0 @samme)
* Although not recommended, when adding a `Layer` Game Object to another `Layer` Game Object, it will no longer error because it cannot find the `removeFromDisplayList` function. Fix #5595 (thanks @tringcooler)
* The `Actions.Spread` method will now place the final item correctly and abort early if the array only contains 1 or 0 items (thanks @EmilSV)
* Calling `setDisplayOrigin` on a `Video` Game Object would cause the origins to be set to `NaN` if the Video was created without an asset key. It will now give Videos a default size, preventing this error, which is reset once a video is loaded. Fix #5560 (thanks @mattjennings)
* When `ImageFile` loads with a linked Normal Map and the map completes first, but the Image is still in a pending state, it would incorrectly add itself to the cache instead of waiting. It now checks this process more carefully. Fix #5886 (thanks @inmylo)
* Using a `dataKey` to specify a part of a JSON file when using `load.pack` would fail as it wouldn't correctly assign the right part of the pack file to the Loader. You can now use this parameter properly. Fix #6001 (thanks @rexrainbow)
* The `Text.advancedWordWrap` function would incorrectly merge the current and next lines when wrapping words with carriage-returns in. Fix #6187 (thanks @Ariorh1337 @robinheidrich)
* Recoded the point conversion math in the `HexagonalTileToWorldXY` function as it was incorrect. Now returns world coordinates correctly.
* `Tilemap.copy` would error if you copied a block of tiles over itself, even partially, as it tried to copy already replaced tiles as part of the function. It will now copy correctly, regardless of source or destination areas. Fix #6188 (thanks @Arkyris)
* `Tile.copy` will now use the `DeepCopy` function to copy the `Tile.properties` object, as otherwise it just gets copied by reference.
* Recoded the point conversion math in the `HexagonalWorldToTileXY` function as it was incorrect. Now detects any dimension hexagon correctly. Fix #5608 (thanks @stonerich)
* Fixed the point conversion math in the `IsometricWorldToTileXY` function and added optional boolean property that allows the setting of the tile origin to the top or base. Fix #5781 (thanks @benjamin-wilson)
* Calling `Tilemap.worldToTileX` or `worldToTileY` on a Isometric or Hexagonal Tilemap will now always return `null` instead of doing nothing, as you cannot convert to a tile index using just one coordinate for these map types, you should use `worldToTileXY` instead.
* The `Game.headlessStep` method will now reset `SceneManager.isProcessing` before `PRE_RENDER`. This fixes issues in HEADLESS mode where the Scene Manager wouldn't process additionally added Scenes created after the Game had started. Fix #5872 #5974 (thanks @micsun-al @samme)
* If `Rope.setPoints` was called with the exact same number of points as before, it wouldn't set the `dirty` flag, meaning the vertices were not updated on the next render (thanks @stupot)
* `Particle.fire` will now check to see if the parent Emitter is set to follow a Game Object and if so, and if the x/y EmitterOps are spread ops, then it'll space the particles out based on the follower coordinates, instead of clumping them all together. Fix #5847 (thanks @sreadixl)
* When using RTL (right-to-left) `Text` Game Objects, the Text would vanish on iOS15+ if you changed the text or font style. The context RTL properties are now restored when the text is updated, fixing this issue. Fix #6121 (thanks @liorGameDev)
* The `Tilemap.destroyLayer` method would throw an error "TypeError: layer.destroy is not a function". It now correctly destroys the TilemapLayer. Fix #6268 (thanks @samme)
* `MapData` and `ObjectLayer` will now enforce that the `Tilemap.objects` property is always an array. Sometimes Tiled willl set it to be a blank object in the JSON data. This fix makes sure it is always an array. Fix #6139 (thanks @robbeman)
* The `ParseJSONTiled` function will now run a `DeepCopy` on the source Tiled JSON, which prevents object mutation, fixing an issue where Tiled Object Layer names would be duplicated if used across multiple Tilemap instances. Fix #6212 (thanks @temajm @wahur666)
* The method `Color.setFromHSV` would not change the members `h`, `s` and `v`, only the RGB properties. It now correctly updates them both. Fix #6276 (thanks @rexrainbow)
* When calling `GameObject.getPostPipeline` and passing in a string for the pipeline name it would error with 'Uncaught TypeError: Right-hand side of 'instanceof' is not an object'. This is now handled correctly internally (thanks @neki-dev)
* When playing a chained animation, the `nextAnim` property could get set to `undefined` which would stop the next animation in the queue from being set. The check now handles all falsey cases. Fix #5852 (thanks @Pythux)
* When calling `InputPlugin.clear` it will now call `removeDebug` on the Game Object, making sure it clears up any Input Debug Graphics left in the Scene. Fix #6137 (thanks @spayton)
* The `Video.loadURL` method wouldn't load the video or emit the `VIDEO_CREATED` event unless `noAudio` was specified. A load event handler has been added to resolve this (thanks @samme)
* If you create a repeating or looping `TimerEvent` with a `delay` of zero it will now throw a runtime error as it would lead to an infinite loop. Fix #6225 (thanks @JernejHabjan)
* The `endFrame` and `startFrame` properties of the `SpriteSheet` parser wouldn't correctly apply themselves, the Texture would still end up with all of the frames. It will now start at the given `startFrame` so that is frame zero and end at `endFrame`, regardless how many other frames are in the sheet.
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
* The `Text`, `TileSprite` and `RenderTexture` Game Objects would call the pre and post batch functions twice by mistake, potentially applying a post fx twice to them.
* `ScaleManager.getParentBounds` will now also check to see if the canvas bounds have changed x or y position, and if so return `true`, causing the Scale Manager to refresh all of its internal cached values. This fixes an issue where the canvas may have changed position on the page, but not its width or height, so a refresh wasn't triggered. Fix #5884 (thanks @jameswilddev)
* The `SceneManager.bootScene` method will now always call `LoaderPlugin.start`, even if there are no files in the queue. This means that the Loader will always dispatch its `START` and `COMPLETE` events, even if the queue is empty because the files are already cached. You can now rely on the `START` and `COMPLETE` events to be fired, regardless, using them safely in your preload scene. Fix #5877 (thanks @sipals)
* Calling `TimerEvent.reset` in the Timer callback would cause the timer to be added to the Clock's pending removal and insertion lists together, throwing an error. It will now not add to pending removal if the timer was reset. Fix #5887 (thanks @rexrainbow)
* Calling `ParticleEmitter.setScale` would set the `scaleY` property to `null`, causing calls to `setScaleY` to throw a runtime error. `scaleY` is now a required property across both the Particle and Emitter classes and all of the conditional checks for it have been removed (thanks ojg15)
* Calling `Tween.reset` when a tween was in a state of `PENDING_REMOVE` would cause it to fail to restart. It now restarts fully. Fix #4793 (thanks @spayton)
* The default `Tween._pausedState` has changed from `INIT` to `PENDING_ADD`. This fixes a bug where if you called `Tween.play` immediately after creating it, it would force the tween to freeze. Fix #5454 (thanks @michal-bures)
* If you start a `PathFollower` with a `to` value it will now tween and complete at that value, rather than the end of the path as before (thanks @samme)
* `Text` with RTL enabled wouldn't factor in the left / right padding correctly, causing the text to be cut off. It will now account for padding in the line width calculations. Fix #5830 (thanks @rexrainbow)
* The `Path.fromJSON` function would use the wrong name for a Quadratic Bezier curve class, meaning it would be skipped in the exported JSON. It's now included correctly (thanks @natureofcode)
* The `Input.Touch.TouchManager.stopListeners` forgot to remove the `touchcancel` handler. This is now removed correctly (thanks @teng-z)
* The `BitmapMask` shader has been recoded so it now works correctly if you mask a Game Object that has alpha set on it, or in its texture. Previously it would alpha the Game Object against black (thanks stever1388)
* When the Pointer moves out of the canvas and is released it would trigger `Uncaught TypeError: Cannot read properties of undefined (reading 'renderList')` if multiple children existed in the pointer-out array. Fix #5867 #5699 (thanks @rexrainbow @lyger)
* If the Input Target in the game config was a string, it wouldn't be correctly parsed by the Touch Manager.
* The `GameObject.willRender` method will now factor in the parent `displayList`, if it has one, to the end result. This fixes issues like that where an invisible Layer will still process input events. Fix #5883 (thanks @rexrainbow)
* `InputPlugin.disable` will now also reset the drag state of the Game Object as well as remove it from all of the internal temporary arrays. This fixes issues where if you disabled a Game Object for input during an input event it would still remain in the temporary internal arrays. This method now also returns the Input Plugin, to match `enable`. Fix #5828 (thank @natureofcode @thewaver)
* The `GetBounds` component has been removed from the Point Light Game Object. Fix #5934 (thanks @x-wk @samme)
* `SceneManager.moveAbove` and `moveBelow` now take into account the modified indexes after the move (thanks @EmilSV)
* When forcing a game to use `setTimeout` and then sending the game to sleep, it would accidentally restart by using Request Animation Frame instead (thanks @andymikulski)
* Including a `render` object within the Game Config will no longer erase any top-level config render settings. The `render` object will now take priority over the game config, but both will be used (thanks @vzhou842)
* Calling `Tween.stop(0)` would run for an additional delta before stopping, causing the Tween to not be truly 100% "reset". Fix #5986 (thanks @Mesonyx)
* The `Utils.Array.SafeRange` function would exclude valid certain ranges. Fix #5979 (thanks @ksritharan)
* The "Skip intersects check by argument" change in Arcade Physics has been reverted. Fix #5956 (thanks @samme)
* The `Container.pointToContainer` method would ignore the provided `output` parameter, but now uses it (thanks @vforsh)
* The `Polygon` Game Object would ignore its `closePath` property when rendering in Canvas. Fix #5983 (thanks @optimumsuave)
* IE9 Fix: Added 2 missing Typed Array polyfills (thanks @jcyuan)
* IE9 Fix: CanvasRenderer ignores frames with zero dimensions (thanks @jcyuan)
* `BlitterCanvasRenderer` will now skip the `drawImage` call in canvas if the frame width or height are zero.
* `ParticleManagerCanvasRenderer` will now skip the `drawImage` call in canvas if the frame width or height are zero.
* `CanvasSnapshot` will now skip the `drawImage` call in canvas if the frame width or height are zero.
* `TextureManager.getBase64` will now skip the `drawImage` call in canvas if the frame width or height are zero.
* `TilemapLayerCanvasRenderer` will now skip the `drawImage` call in canvas if the frame width or height are zero.
* Drawing Game Objects to a Render Texture in WebGL would skip their blend modes. This is now applied correctly. Fix #5565 #5996 (thanks @sjb933 @danarcher)
* Loading a Script File Type will now default the 'type' property to 'script' when a type is not provided. Fix #5994 (thanks @samme @ItsGravix)
* If you Paused or Stopped a Scene that was in a preload state, it would still call 'create' after the Scene had shutdown (thanks @samme)
* BitmapText rendering wouldn't correctly apply per-character kerning offsets. These are now implemented during rendering (thanks @arbassic)
* The DisplayList will now enter a while loop until all Game Objects are destroyed, rather than cache the list length. This prevents "cannot read property 'destroy' of undefined" errors in Scenes. Fix #5520 (thanks @schontz @astei)
* Particles can now be moved to 0x0. `moveToX` and `moveToY` now default to null instead of 0 (thanks @samme)
* Layers will now destroy more carefully when children destroy themselves (thanks @rexrainbow)
* An error in the `GetBitmapTextSize` function caused kerning to not be applied correctly to Bitmap Text objects. This now works across WebGL and Canvas (thanks @arbassic @TJ09)
* `WebGLSnapshot` and `CanvasSnapshot` will now Math.floor the width/height values to ensure no sub-pixel dimensions, which corrupts the resulting texture. Fix #6099 (thanks @orjandh)
* `ContainerCanvasRenderer` would pass in a 5th `container` parameter to the child `renderCanvas` call, which was breaking the `GraphicsCanvasRenderer` and isn't needed by any Game Object, so has been removed. Fix #6093 (thanks @Antriel)
* Fixed issue in `Utils.Objects.GetValue` where it would return an incorrect result if a `source` and `altSource` were provided that didn't match in structure. Fix #5952 (thanks @rexrainbow)
* Fixed issue in Game Config where having an empty object, such as `render: {}` would cause set properties to be overriden with the default value. Fix #6097 (thanks @michalfialadev)
* The `SceneManager.moveAbove` and `moveBelow` methods didn't check the order of the Scenes being moved, so moved them even if one was already above / below the other. Both methods now check the indexes first. Fix #6040 (thanks @yuupsup)
* Setting `scale.mode` in the Game Config would be ignored. It now accepts either this, or `scaleMode` directly. Fix #5970 (thanks @samme)
* The frame duration calculations in the `AnimationManager.createFromAseprite` method would be incorrect if they contained a mixture of long and very short duration frames (thanks @martincapello)
* The `TilemapLayer.getTilesWithinShape` method would not return valid results when used with a Line geometry object. Fix #5640 (thanks @hrecker @samme)
* Modified the way Phaser uses `require` statements in order to fix an issue in Google's closure-compiler when variables are re-assigned to new values (thanks @TJ09)
* When creating a `MatterTileBody` from an isometric tile the tiles top value would be incorrect. The `getTop` method has been fixed to address this (thanks @adamazmil)
* Sprites created directly (not via the Game Object Factory) which are then added to a Container would fail to play their animations, because they were not added to the Scene Update List. Fix #5817 #5818 #6052 (thanks @prakol16 @adomas-sk)
* Game Objects that were created and destroyed (or moved to Containers) in the same frame were not correctly removed from the UpdateList. Fix #5803 (thanks @samme)
* `Container.removeHandler` now specifies the context for `Events.DESTROY`, fixing an issue where objects moved from one container, to another, then destroyed, would cause `sys` reference errors. Fix 5846 (thanks @sreadixl)
* `Container.removeAll` (which is also called when a Container is destroyed) will now directly destroy the children, if the given parameter is set, rather than doing it after removing them via the event handler. This fixes an issue where nested Containers would add destroyed children back to the Scene as part of their shutdown process. Fix #6078 (thanks @BenoitFreslon)
* The `DisplayList.addChildCallback` method will now check to see if the child has a parent container, and if it does, remove it from there before adding it to the Scene Display List. Fix #6091 (thanks @michalfialadev)
* `Display.RGB.equals` will now return the correct result. Previously, it would always return `false` (thanks @samme)
* When destroying the Arcade Physics World it will now destroy the debug Graphics object, had one been created. Previously, these would continue to stack-up should you restart the physics world (thanks @samme)
* `Graphics.strokeRoundedRect` would incorrectly draw the rectangle if you passed in a radius greater than half of the smaller side. This is now clamped internally (thanks @temajm)

### Examples, Documentation, Beta Testing and TypeScript

My thanks to the following for helping with the Phaser 3 Examples, Beta Testing, Docs, and TypeScript definitions, either by reporting errors, fixing them, or helping author the docs:

@0day-oni
@201flaviosilva
@AlbertMontagutCasero
@Arcanorum
@arosemena
@austinlyon
@chrisl8
@christian-post
@danfoster
@darrylpizarro
@DeweyHur
@drunkcat
@ef4
@eltociear
@EsteFilipe
@etherealmachine
@EmilSV
@Fake
@florestankorp
@hacheraw
@hanzooo
@jerricko
@joegaffey
@jonasrundberg
@kainage
@kootoopas
@lolimay
@MaffDev
@michalfialadev
@monteiz
@necrokot
@Nero0
@OdinvonDoom
@orjandh
@pavle-goloskokovic
@PhaserEditor2D
@Pythux
@quocsinh
@rgk
@rollinsafary-inomma
@rstanuwijaya
@samme
@Smirnov48
@steveja42
@sylvainpolletvillard
@twoco
@ubershmekel
@ultimoistante
@VanaMartin
@vforsh
@Vidminas
@x-wk
@xmahle
@xuxucode
@YeloPartyHat
@ZekeLu
FromChris
Golen
OmniOwl
