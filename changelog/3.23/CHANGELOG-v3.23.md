# Phaser 3 Change Log

## Version 3.23 - Ginro - 27th April 2020

### JSDocs

The entire Phaser 3 API now has 100% complete JSDoc coverage!

The following sections had their documentation completed in this release:

* Animations
* Create
* Curves
* Geom
* Math
* Renderer
* Textures
* Tilemaps

### Removed

The following features have been removed in this version of Phaser:

* Impact Physics has been removed completely and is no longer a choice of physics system. The resulting `Scene.impact` property and Impact config object have also been removed.

### Deprecated

The following features are now deprecated and will be removed in a future version of Phaser:

* The Light Pipeline and associated components will be removed. This feature was never properly finished and adds too much redundant, non-optional code into the core API. The ability to load normal maps alongside textures will _remain_, for use in your own lighting shaders, which gives you far more control over the final effect.

### New: Rope Game Object

This version of Phaser contains the brand new Rope Game Object. A Rope is a special kind of Game Object that has a repeating texture that runs in a strip, either horizontally or vertically. Unlike a Sprite, you can define how many vertices the Rope has, and can modify each of them during run-time, allowing for some really lovely effects.

Ropes can be created via the Game Object Factory in the normal way (`this.add.rope()`) and you should look at the examples and documentation for further implementation details.

Note that Ropes are a WebGL only feature.

### New Features

* `Line.GetEasedPoints` is a new function that will take a Line, a quantity, and an ease function, and returns an array of points where each point has been spaced out across the length of the Line based on the ease function given.
* `XHRSettings.withCredentials` is a new boolean property that controls the `withCredentials` setting of the XHR Request made by the Loader. It indicates whether or not cross-site Access-Control requests should be made using credentials such as cookies, authorization headers or TLS client certificates. You can set this on a per-file basis, or global in the Game Config.
* `Config.loaderWithCredentials` is the new global setting for `XHRSettings.withCredentials`.
* `Camera.renderToGame` is a new property used in conjunction with `renderToTexture`. It controls if the Camera should still render to the Game canvas after rendering to its own texture or not. By default, it will render to both, but you can now toggle this at run-time.
* `Camera.setRenderToTexture` has a new optional parameter `renderToGame` which sets the `Camera.renderToGame` property, controlling if the Camera should render to both its texture and the Game canvas, or just its texture.
* The free version of Texture Packer exports a `pivot` property when using JSON Array or Hash, however the Texture Packer Phaser export uses the `anchor` property. This update allows the loaders to work with either property, regardless of which export you use (thanks @veleek)
* `get()` is a new method in the HTML and Web Audio Sound Managers that will get the first sound in the manager matching the given key, if any (thanks @samme)
* `getAll()` is a new method in the HTML and Web Audio Sound Managers that will get all sounds in the manager matching the given key, if any (thanks @samme)
* `removeAll()` is a new method in the HTML and Web Audio Sound Managers that will remove all sounds in the manager, destroying them (thanks @samme)
* `stopByKey()` is a new method in the HTML and Web Audio Sound Managers that will stop any sound in the manager matching the given key, if any (thanks @samme)
* `Rectangle.FromXY` is a new function that will create the smallest Rectangle containing two coordinate pairs, handy for marquee style selections (thanks @samme)
* `PathFollower.pathDelta` is a new property that holds the distance the follower has traveled from the previous point to the current one, at the last update (thanks @samme)
* `Vector2.fuzzyEquals` is a new method that will check whether the Vector is approximately equal to a given Vector (thanks @samme)
* `Vector2.setAngle` is a new method that will set the angle of the Vector (thanks @samme)
* `Vector2.setLength` is a new method that will set the length, or magnitude of the Vector (thanks @samme)
* `Vector2.normalizeLeftHand` is a new method that will rotate the Vector to its perpendicular, in the negative direction (thanks @samme)
* `Vector2.limit` is a new method that will limit the length, or magnitude of the Vector (thanks @samme)
* `Vector2.reflect` is a new method that will reflect the Vector off a line defined by a normal (thanks @samme)
* `Vector2.mirror` is a new method that will reflect the Vector across another (thanks @samme)
* `Vector2.rotate` is a new method that will rotate the Vector by an angle amount (thanks @samme)
* `Math.Angle.Random` is a new function that will return a random angle in radians between -pi and pi (thanks @samme)
* `Math.Angle.RandomDegrees` is a new function that will return a random angle in degrees between -180 and 180 (thanks @samme)
* `Physics.Arcade.World.fixedStep` is a new boolean property that synchronizes the physics fps to the rendering fps when enabled. This can help in some cases where "glitches" can occur in the movement of objects. These glitches are especially noticeable on objects that move at constant speed and the fps are not consistent. Enabling this feature disables the fps and timeScale properties of the Arcade.World class (thanks @jjcapellan)
* `Curves.Path.getTangent` is a new method that gets a unit vector tangent at a relative position on the path (thanks @samme)
* `DataManager.inc` is a new method that will increase a value for the given key. If the key doesn't already exist in the Data Manager then it is increased from 0 (thanks @rexrainbow)
* `DataManager.toggle` is a new method that will toggle a boolean value for the given key. If the key doesn't already exist in the Data Manager then it is toggled from false (thanks @rexrainbow)
* The Tiled parser will now recognize Tiled `point objects` and export them with `point: true`. Equally, Sprites generated via `createFromObjects` are now just set to the position of the Point object, using the Sprites dimensions. This is a breaking change, so if you are using Point objects and `createFromObjects` please re-test your maps against this release of Phaser (thanks @samme)
* You can now use Blob URLs when loading `Audio` objects via the Loader (thanks @aucguy)
* You can now use Blob URLs when loading `Video` objects via the Loader (thanks @aucguy)
* Tiled Image Collections now have rudimentary support and will create a single tileset per image. This is useful for prototyping, but should not be used heavily in production. See #4964 (thanks @gogoprog)
* When loading files using your own XHR Settings you can now use the new property `headers` to define an object containing multiple headers, all of which will be sent with the xhr request (thanks @jorbascrumps)
* `Camera.rotateTo` is a new Camera effect that allows you to set the rotation of the camera to a given value of the duration specified (thanks @jan1za)

### Updates

* `XHRLoader` will now use the `XHRSettings.withCredentials` as set in the file or global loader config.
* `Animation.setCurrentFrame` will no longer try to call `setOrigin` or `updateDisplayOrigin` if the Game Object doesn't have the Origin component, preventing unknown function errors.
* `MatterTileBody` now extends `EventEmitter`, meaning you can listen to collision events from Tiles directly and it will no longer throw errors about `gameObject.emit` not working. Fix #4967 (thanks @reinildo)
* Added `MatterJS.BodyType` to `GameObject.body` type. Fix #4962 (thanks @meisterpeeps)
* The `JSONHash` loader didn't load custom pivot information, but `JSONArray` did. So that functionality has been duplicated into the `JSONHash` file type (thanks @veleek)
* When enabling a Game Object for input debug, the debug body's depth was 0. It's now set to be the same depth as the actual Game Object (thanks @mktcode)
* Spine Files can now be loaded via a manifest, allowing you to specify a prefix in the loader object and providing absolute paths to textures. Fix #4813 (thanks @FostUK @a610569731)
* `collideSpriteVsGroup` now exits early when the Sprite has `checkCollision.none`, skipping an unnecessary iteration of the group (thanks @samme)
* `collideSpriteVsGroup` when looping through the tree results now skips bodies with `checkCollision.none` (thanks @samme)
* When enabling a Game Object for Input Debugging the created debug shape will now factor in the position, scale and rotation of the Game Objects parent Container, if it has one (thanks @scott20145)

### Bug Fixes

* The conditional checking if the `PathFollower` was at the end of the path or not was incorrect (thanks @samme)
* Creating an `Arcade Physics Body` from a scaled Game Object would use the un-scaled dimensions for the body. They now use the scaled dimensions. This may be a breaking change in some games, so please be aware of it (thanks @samme)
* Creating an `Arcade Physics Static Body` from a scaled Game Object would use the un-scaled dimensions for the body. They now use the scaled dimensions. This may be a breaking change in some games, so please be aware of it (thanks @samme)
* The `Arcade Physics Static Body` center was incorrect after construction. Probably caused problems with circle collisions. Fix  #4770 (thanks @samme)
* An Arcade Physics Body `center` and `position` are now correct after construction and before preUpdate(), for any Game Object origin or scale (thanks @samme)
* When calling `Body.setSize` with the `center` parameter as `true` the calculated offset would be incorrect for scaled Game Objects. The offset now takes scaling into consideration (thanks @samme)
* `HTML5AudioFile.load` would throw an error in strict mode (thanks @samme)
* When using the `No Audio` Sound Manager, calling `destroy()` would cause a Maximum call stack size exceeded error as it was missing 6 setter methods. It will now destroy properly (thanks @samme)
* When using HTML5 Audio, setting the game or sound volume outside of the range 0-1 would throw an index size error. The value is now clamped before being set (thanks @samme)
* Sound Managers were still listening to Game BLUR, FOCUS, and PRE_STEP events after being destroyed. These events are now cleared up properly (thanks @samme)
* In WebGL, the `TextureTintPipeline` is now set before rendering any camera effects. If the pipeline had been changed, the effects would not run (thanks @TroKEMp)
* When transitioning to a sleeping Scene, the transition `data` wasn't sent to the Scene `wake` method. It's now sent across to both sleeping and waking scenes. Fix #5078 (thanks @MrMadClown)
* `Scale.lockOrientation('portrait')` would throw a runtime error in Firefox: 'TypeError: 'mozLockOrientation' called on an object that does not implement interface Screen.' It no longer does this. Fix #5069 (thanks @123survesh)
* The `FILE_COMPLETE` event was being emitted twice for a JSON loaded animation file. It now only fires once. Fix #5059 (thanks @jjcapellan)
* If you restart or stop / start a scene and then queue at least one new file in `preload`, the scenes `update` function is called before `create`, likely causing an error. Fix #5065 (thanks @samme)
* `Circle.GetPoints` will now check that `stepRate` is > 0 to avoid division by zero errors leading to the quantity becoming infinity (thanks @jdcook)
* `Ellipse.GetPoints` will now check that `stepRate` is > 0 to avoid division by zero errors leading to the quantity becoming infinity (thanks @jdcook)
* `Line.GetPoints` will now check that `stepRate` is > 0 to avoid division by zero errors leading to the quantity becoming infinity (thanks @jdcook)
* `Polygon.GetPoints` will now check that `stepRate` is > 0 to avoid division by zero errors leading to the quantity becoming infinity (thanks @jdcook)
* `Rectangle.GetPoints` will now check that `stepRate` is > 0 to avoid division by zero errors leading to the quantity becoming infinity (thanks @jdcook)
* `Triangle.GetPoints` will now check that `stepRate` is > 0 to avoid division by zero errors leading to the quantity becoming infinity (thanks @jdcook)
* Changing the game size with a scale mode of FIT resulted in a canvas with a incorrect aspect ratio. Fix #4971 (thanks @Kitsee @samme)
* The Matter Physics `Common.isString` function would cause a 'TypeError: Invalid calling object' in Internet Explorer (thanks @samme)
* `Arcade.Body.checkCollision.none` did not prevent collisions with Tiles. Now it does (thanks @samme)
* When running in HEADLESS mode, using a `Text` Game Object would cause a runtime error "Cannot read property gl of null". Fix #4976 (thanks @raimon-segura @samme)
* The Tilemap `LayerData` class `properties` property has been changed from 'object' to an array of objects, which is what Tiled exports when defining layer properties in the editor. Fix #4983 (thanks @Nightspeller)
* `AudioFile` and `VideoFile` had their state set to `undefined` instead of `FILE_PROCESSING` (thanks @samme)
* `Container.getBounds` would return incorrect values if it had child Containers within it. Fix #4580 (thanks @Minious @thedrint)
* The Loader no longer prepends the current path to the URL if it's a Blob object (thanks @aucguy)
* Spine Atlases can now be loaded correctly via Asset Packs, as they now have the right index applied to them (thanks @jdcook)
* Input events for children inside nested Containers would incorrectly fire depending on the pointer position (thanks @rexrainbow)
* Animations with both `yoyo` and `repeatDelay` set will respect the delay after each yoyo runs (thanks @cruzdanilo)
* `CanvasTexture.setSize` forgot to update the `width` and `height` properties of the Texture itself. These now match the underlying canvas element. Fix #5054 (thanks @sebbernery)

### Examples, Documentation and TypeScript

My thanks to the following for helping with the Phaser 3 Examples, Docs and TypeScript definitions, either by reporting errors, fixing them or helping author the docs:

@JasonHK @supertommy @majalon @samme @MartinBlackburn @halilcakar @jcyuan @MrMadClown @Dinozor @EmilSV @Jazcash
