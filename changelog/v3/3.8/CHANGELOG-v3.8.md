# Phaser 3 Change Log

## Version 3.8.0 - Klein - 16th May 2018

### New Plugin Manager

New in this release is a revamped Plugin Manager. Phaser has always used plugins extensively internally but this release opens them up and builds in a lot of new features making them easy for you to both create and digest.

There is a new `Phaser.Plugins` namespace in which the classes live. The functions of the old PluginManager have moved to the new PluginCache and the PluginManager, which is available under `this.plugins` from all Scenes by default, now allows you to install and access any plugin.

Plugins are split into two different types: A Global Plugin and a Scene Plugin.

A **Global Plugin** is a plugin that lives within the Plugin Manager rather than a Scene. You can get access to it by calling `PluginManager.get` and providing a key. Any Scenes that request a plugin in this way all get access to the same plugin instance, allowing you to use a single plugin across multiple Scenes.

A **Scene Plugin** is a plugin dedicated to running within a Scene. These are different to Global Plugins in that their instances do not live within the Plugin Manager, but within the Scene Systems class instead. And that every Scene created is given its own unique instance of a Scene Plugin. Examples of core Scene Plugins include the Input Plugin, the Tween Plugin and the physics Plugins.

Plugins can now be installed in 3 different ways: 1) You can preload them, using the `load.plugin` and the new `load.scenePlugin` methods. This will allow you to load externally hosted plugins into your game, or pull down a plugin dynamically at run-time. 2) You can install global and scene plugins in your Game Configuration. The plugin code can be bundled with your game code into a single bundle. By specifying plugins in the game config they're instantly available as soon as your game boots. Finally, you can install plugins at run-time directly from within a Scene.

Plugins can also create brand new Game Objects and File Types, which install themselves into the respective factories. This means you can now write a plugin that adds a new file type and Game Object in a single package.

The new Plugin Manager and associated classes are 100% covered by JSDocs and there are stacks of new examples in the `plugins` folder in the Phaser 3 Labs too, so please dig in and have a play with these powerful new things!

### New Features

* You can pass in your own `canvas` and `context` elements in your Game Config and Phaser will use those to render with instead of creating its own. This also allows you to pass in a WebGL 2 context. Fix #3653 (thanks @tgrajewski)
* WebGLRenderer.config has a new property `maxTextures` which is derived from `gl.MAX_TEXTURE_IMAGE_UNITS`, you can get it via the new method `getMaxTextures()`.
* WebGLRenderer.config has a new property `maxTextureSize` which is derived from `gl.MAX_TEXTURE_SIZE`, you can get it via the new method `getMaxTextureSize()`
* WebGLRenderer has a new property `compression` which holds the browser / devices compressed texture support gl extensions, which is populated during `init`.
* When calling `generateFrameNames` to define an animation from a texture atlas you can now leave out all of the config properties and it will create an animation using every frame found in the atlas. Please understand you've no control over the sequence of these frames if you do this and it's entirely dictated by the json data (thanks @Aram19)
* The keycodes for 0 to 9 on the numeric keypad have been added. You can now use them in events, i.e. `this.input.keyboard.on('keydown_NUMPAD_ZERO')` (thanks @Gaushao)
* All Game Objects have a new method `setRandomPosition` which will randomly position them anywhere within the defined area, or if no area is given, anywhere within the game size.

### Updates

* Game.step now emits a `prestep` event, which some of the global systems hook in to, like Sound and Input. You can use it to perform pre-step tasks, ideally from plugins.
* Game.step now emits a `step` event. This is emitted once per frame. You can hook into it from plugins or code that exists outside of a Scene.
* Game.step now emits a `poststep` event. This is the last chance you get to do things before the render process begins.
* Optimized TextureTintPipeline.drawBlitter so it skips bobs that have alpha of zero and only calls `setTexture2D` if the bob sourceIndex has changed, previously it called it for every single bob.
* Game.context used to be undefined if running in WebGL. It is now set to be the `WebGLRenderingContext` during WebGLRenderer.init. If you provided your own custom context, it is set to this instead.
* The Game `onStepCallback` has been removed. You can now listen for the new step events instead.
* Phaser.EventEmitter was incorrectly namespaced, it's now only available under Phaser.Events.EventEmitter (thanks Tigran)

### Bug Fixes

* The Script File type in the Loader didn't create itself correctly as it was missing an argument (thanks @TadejZupancic)
* The Plugin File type in the Loader didn't create itself correctly as it was missing an argument.
* WebAudioSoundManager.unlock will now check if `document.body` is available before setting the listeners on it. Fixes old versions of Firefox, apparently. #3649 (thanks @squilibob)
* Utils.Array.BringToTop failed to move the penultimate item in an array due to an index error. Fix #3658 (thanks @agar3s)
* The Headless renderer was broken due to an invalid access during TextureSource.init.
* Animation.yoyo was ignored when calculating the next frame to advance to, breaking the yoyo effect. It now yoyos properly (thanks Tomas)
* Corrected an error in Container.getBoundsTransformMatrix that called a missing method, causing a `getBounds` on a nested container to fail. Fix #3624 (thanks @poasher)
* Calling a creator, such as GraphicsCreator, without passing in a config object, would cause an error to be thrown. All Game Object creators now catch against this.

### Examples, Documentation and TypeScript

My thanks to the following for helping with the Phaser 3 Examples, Docs and TypeScript definitions, either by reporting errors, fixing them or helping author the docs:

@samme @mzguimaraes @NaNdreas @Matthew-Herman @melissaelopez @TheColorRed 
