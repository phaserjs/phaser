# Phaser 3 Change Log

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
