# Phaser 3 Change Log

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
