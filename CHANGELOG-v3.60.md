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

* `WebGLShader.fragSrc` is a new property that holds the source of the fragment shader.
* `WebGLShader.vertSrc` is a new property that holds the source of the vertex shader.
* `WebGLShader#.createProgram` is a new method that will destroy and then re-create the shader program based on the given (or stored) vertex and fragment shader source.
* `WebGLShader.setBoolean` is a new method that allows you to set a boolean uniform on a shader.
* `Math.LinearXY` is a new function that will interpolate between 2 given Vector2s and return a new Vector2 as a result (thanks @GregDevProjects)
* `Curves.Path.getCurveAt` is a new method that will return the curve that forms the path at the given location (thanks @natureofcode)
* `Vector2.project` is a new method that will project the vector onto the given vector (thanks @samme)
* `GameObjects.Polygon.setTo` is a new method that allows you to change the points being used to render a Polygon Shape Game Object. Fix #6151 (thanks @PhaserEditor2D)

### Updates

* We've added a polyfill for the `requestVideoFrameCallback` API because not all current browsers support it, but the Video Game Object now relies upon it.
* The default callback context of the `TimerEvent` has changed to be the `TimerEvent` instance itself, rather than the context (thanks @samme)
* The `GetBounds.getCenter` method now has an optional `includeParent` argument, which allows you to get the value in world space.
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
* The `tempZone` used by `GridAlign` has now had `setOrigin(0, 0)` applied to it. This leads to more accurate / expected zone placement when aligning grid items.
* `TransformMatrix.setQuad` is a new method that will perform the 8 calculations required to create the vertice positions from the matrix and the given values. The result is stored in the new `TransformMatrix.quad` Float32Array, which is also returned from this method.
* `TransformMatrix.multiply` now directly updates the Float32Array, leading to 6 less getter invocations.
* The `DOMElement.preUpdate` method has been removed. If you overrode this method, please now see `preRender` instead.
* `DOMElement.preRender` is a new method that will check parent visibility and improve its behavior, responding to the parent even if the Scene is paused or the element is inactive. Dom Elements are also no longer added to the Scene Update List. Fix #5816 (thanks @prakol16 @samme)
* Phaser 3 is now built with webpack 5 and all related packages have been updated.
* Lots of configuration objects now have full TypeScript definitions thanks to @16patsle
* The `path` package used by the TS Defs generator has been moved to `devDependencies` (thanks @antkhnvsk)
* The `Light` Game Object now has the `Origin` and `Transform` components, along with 4 new properties: `width`, `height`, `displayWidth` and `displayHeight`. This allows you to add a Light to a Container, or enable it for physics. Fix #6126 (thanks @jcoppage)
* The `Transform` Component has a new boolean read-only property `hasTransformComponent` which is set to `true` by default.

### Bug Fixes

* Several paths have been fixed in the `phaser-core.js` entry point (thanks @pavle-goloskokovic)
* The `Actions.Spread` method will now place the final item correctly and abort early if the array only contains 1 or 0 items (thanks @EmilSV)
* If `Rope.setPoints` was called with the exact same number of points as before, it wouldn't set the `dirty` flag, meaning the vertices were not updated on the next render (thanks @stupot)
* The method `Color.setFromHSV` would not change the members `h`, `s` and `v`, only the RGB properties. It now correctly updates them both. Fix #6276 (thanks @rexrainbow)
* If you create a repeating or looping `TimerEvent` with a `delay` of zero it will now throw a runtime error as it would lead to an infinite loop. Fix #6225 (thanks @JernejHabjan)
* The `PluginManager.installScenePlugin` method will now check if the plugin is missing from the local keys array and add it back in, if it is (thanks @xiamidaxia)
* During a call to `GameObject.Shapes.Rectangle.setSize` it will now correctly update the Rectangle object's display origin and default hitArea (thanks @rexrainbow)
* Timers with very short delays (i.e. 1ms) would only run the callback at the speed of the frame update. It will now try and match the timer rate by iterating the calls per frame. Fix #5863 (thanks @rexrainbow)
* Calling `TimerEvent.reset` in the Timer callback would cause the timer to be added to the Clock's pending removal and insertion lists together, throwing an error. It will now not add to pending removal if the timer was reset. Fix #5887 (thanks @rexrainbow)
* If you start a `PathFollower` with a `to` value it will now tween and complete at that value, rather than the end of the path as before (thanks @samme)
* The `Path.fromJSON` function would use the wrong name for a Quadratic Bezier curve class, meaning it would be skipped in the exported JSON. It's now included correctly (thanks @natureofcode)
* When forcing a game to use `setTimeout` and then sending the game to sleep, it would accidentally restart by using Request Animation Frame instead (thanks @andymikulski)
* The `Polygon` Game Object would ignore its `closePath` property when rendering in Canvas. Fix #5983 (thanks @optimumsuave)
* IE9 Fix: Added 2 missing Typed Array polyfills (thanks @jcyuan)
* IE9 Fix: CanvasRenderer ignores frames with zero dimensions (thanks @jcyuan)
* `WebGLSnapshot` and `CanvasSnapshot` will now Math.floor the width/height values to ensure no sub-pixel dimensions, which corrupts the resulting texture. Fix #6099 (thanks @orjandh)
* Modified the way Phaser uses `require` statements in order to fix an issue in Google's closure-compiler when variables are re-assigned to new values (thanks @TJ09)
* `Display.RGB.equals` will now return the correct result. Previously, it would always return `false` (thanks @samme)

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
