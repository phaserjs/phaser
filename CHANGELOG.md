# Change Log

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

## Version 3.7.1 - Sinon - 8th May 2018

### New Features

* The Phaser 3 Labs has gained a nifty 'search' feature box thanks to @NemoStein - it allows you to filter out the example categories.
* We've added a Mask component, which is available on nearly all Game Objects. It includes the methods `setMask`, `clearMask`, `createBitmapMask` and `createGeometryMask`.
* CanvasTexture is a new extension of the Texture object specifically created for when you've got a Canvas element as the backing source of the texture that you wish to draw to programmatically using the Canvas API. This was possible in previous versions, as a Texture object supported having a Canvas as its source, but we've streamlined the process and made it a lot easier for you to refresh the resulting WebGLTexture on the GPU. To create a CanvasTexture just call the `TextureManager.createCanvas` method as before, only this time you'll get a CanvasTexture back which has helper properties and methods. See the complete JSDocs for more details.
* RandomDataGenerator has a new method: `shuffle` which allows you to shuffle an array using the current RNG seed (thanks @wtravO)
* The Texture Manager now supports normal maps for Atlas JSON (in both hash and array formats), Atlas XML and Atlas Unity.
* All Game Objects have a new method `disableInteractive` which will disable the Interactive Object bound to them. You can toggle it back again by calling `setInteractive` with no arguments.
* All Game Objects have a new method `removeInteractive` which will destroy the Interactive Object bound to them entirely. Use this if a Game Object no longer needs any input at all but you don't want to destroy the Game Object itself.

### Loader New Features and Important Updates

The Loader has been given an overhaul to improve its performance and extensibility and gains the following new features:

* A popular feature from Phaser 2 is back: Loader Packs. These are JSON files that contain a bunch of files to load. You can now load a pack into the Loader, and it will parse it and then add the contents into the current load queue automatically. Those contents can be anything the Loader can handle, including other packs! Please see the documentation and examples for more details.
* The Loader is no longer locked during load. New files can be added into the load queue, even while a load is in process. Indeed, this is how the new Pack files feature works. A side effect is that if you do it a lot, your progress bar may jump around, as it's based on the number of files in the loader at that point in time. So if you add a bunch more it may look like it has reduced. It's up to you to handle this in your code, or create a type of loader graphic that doesn't highlight this (such as a spinning circle instead of a progress bar).
* The Loader now handles the flow slightly differently. Before, it would load every file, and once they were all complete it would then process them in turn. Which would add them into the various caches, create textures, and so on. This now happens as soon as the file has loaded because the browser is likely mostly idle during this time anyway, so it allows us to distribute the file processing throughout the load time, rather than in one lump at the end.
* Loading an Audio Sprite has changed. You now specify the JSON file first, and if you wish you can leave out the audio file URLs and let the Loader figure it out from the JSON meta data.
* The Loader has a new file type: `atlasXML` which will load a Shoebox / Starling / Flash CC format XML Texture Atlas.
* The Loader `multiatlas` file type has changed. You no longer have to specify the URLs of the images, instead it reads them from the JSON data and adds them into the loader automatically.
* Every file type the Loader supports can now be loaded either via the method arguments, or a configuration object, or an array of configuration objects. Before only some of them could, but they all use the same code now. See the new examples demonstrating this.
* If you used a Scene files payload then the format of the object has changed. It used to be a property in the Scene Config called `files` which was an array of files to load. It has been renamed to `pack` and it's an object that exactly matches the new Pack File format. Please see the loader example `scene files payload.js` for an example. In short, where you had: `files: []` before, just change it to `pack: { files: [] }` and it'll work.
* The Loader now supports Texture Atlases with normal maps. Before it would only support single images loaded with normal maps, but now you can provide them for all the atlas formats (json, xml and Unity)
* The Loader `multiatlas` feature will now automatically load texture normal maps, if specified in the json.
* Binary Files have a new optional `dataType` argument and property which will cast the binary data to that format after load, before inserting it into the cache, i.e.: `load.binary('mod', 'music.mod', Uint8Array)`
* The method `LoaderPlugin.tilemapWeltmeister` has been renamed to the far more friendly `LoaderPlugin.tilemapImpact`. Everything else about it remains the same, but please update to use the new method name.

### Loader Updates

* The Loader and all associated file types are now covered 100% by JSDocs.
* LinkFile is a new type of file used by the Loader that handles multiple files that need to be joined together. For example, loading a JSON and an Image for a Texture Atlas. This is now handled by a LinkFile.
* File has a new argument in its constructor which is an instance of the LoaderPlugin. It stores this in the `loader` property. It also has a new property `cache` which is a reference to the cache that the file type will be stored in.
* File has a new method `hasCacheConflict` which checks if a key matching the one used by this file exists in the target Cache or not.
* File has a new method `addToCache` which will add the file to its target cache and then emit a `filecomplete` event, passing its key and a reference to itself to the listener (thanks to @kalebwalton for a related PR)
* The Loader has a new property `cacheManager` which is a reference to the global game cache and is used by the File Types.
* The Loader has a new property `textureManager` which is a reference to the global Texture Manager and is used by the File Types.
* The Loader will now check to see if loading a file would cache a cache conflict or not, and prevent it if it will.
* The Loader now hands off processing of the file data to the file itself, which will now self-add itself to its target cache.
* The Loader will now call 'destroy' on all Files when it finishes processing them. They now tidy-up references and extra data, freeing them for gc.
* The File Types are now responsible for adding themselves to their respective caches and any extra processing that needs to happen. This has removed all of the code from the Loader that was doing this, meaning the file types are now properly abstracted away and the Loader is no longer bound to them. This allows you to exclude file types if you don't need them, creating smaller bundles as a result. It also means we can drop in new file types easily without touching the Loader itself and Plugins can register new file types.
* The XMLFile type will no longer throw an error if it can't parse the XML, instead it'll log a console warning and not add the XML to the cache.
* Loading a BitmapFont will add the image used as the font texture into the Texture Manager and the XML into the XML cache, using the key you specified for the font, so you can extract it more easily if needed.
* The default number of max parallel file loads has increased from 4 to 32. You can still change it in the game config.
* Normal Maps can now be loaded using a config object: `load.image({ key: 'shinyRobot', url: 'rob.png', normalMap: 'rob_n.png' });` - you can still use the previous array method too.
* Loader.enableParallel has been removed. If you don't want parallel file loads then set the maximum parallel limit to 1. Related to this, the Game Config `loaderEnableParallel` property has been removed.
* You can now set the `X-Requested-With` header in the XHR requests by specifying it in your XHRSettings config, either in the game, scene or file configs.
* Files will consider themselves as errored if the xhr status is >= 400 and <= 599, even if they didn't throw an onerror event.

### Updates

* If you're using Webpack with Phaser you'll need to update your config to match our new one. The two changes are: We've removed the need for `raw-loader` and we've changed the syntax of the DefinePlugin calls:
* We've swapped use of the Webpack DefinePlugin so instead of setting a global flag for the compilation of the Canvas and WebGL renderers, we use a typeof check instead. This means you should now be able to ingest the Phaser source more easily outside of Webpack without having to define any global vars (thanks @tgrajewski)
* Under Webpack we still no longer use `raw-loader` to import our shader source. Instead it's compiled to plain JS files during our in-house workflow. This should allow you to bundle Phaser with packages other than Webpack more easily.
* The Texture Manager will now emit an `addtexture` event whenever you add a new texture to it, which includes when you load image files from the Loader (as it automatically populates the Texture Manager). Once you receive an `addtexture` event you know the image is loaded and the texture is safe to be applied to a Game Object.
* BitmapMask and GeometryMask both have new `destroy` methods which clear their references, freeing them for gc.
* CanvasPool has a new argument `selfParent` which allows the canvas itself to be the parent key, used for later removal.
* Frame has a new method `setSize` which allows you to set the frame x, y, width and height and have it update all of the internal properties automatically. This is now called directly in the constructor.
* When a TextureSource is destroyed if it's got a canvas texture it's removed from the CanvasPool.
* TextureManager.checkKey will check if a texture key is in-use and log a console error if it is and then return a boolean. This is now used extensively internally to prevent you from adding textures that already exist into the manager. If you wish to just check if a key is in use without the error, use the `TextureManager.exists` method as before.
* TextureManager.remove will allow you to remove a texture from the manager. The texture is destroyed and it emits a `removetexture` event.
* TextureSource has a new property `renderer` as it's used a lot internally and is useful if you extend the class.
* TextureSource will now remove its respective WebGLTexture from the renderer when destroyed.
* TextureSource will now automatically create a glTexture from its canvas if using one.
* WebGLRenderer will now remove a GL texture from its local `nativeTextures` array when you call the `deleteTexture` method.
* The BaseCache has a new method `exists` that will return a boolean if an entry for the given key exists in the cache or not.
* ScenePlugin.getIndex will return the index of the given Scene in the Scene List.
* The Scene Systems will emit a `ready` event when it has fully finished starting up and all plugins are available. Re: #3636 (thanks @Yazir)
* All Game Object Creators now have an extra boolean argument `addToScene`. If you set this to `true` it will add the Game Object being created to the Scene automatically, while `false` will do the opposite, i.e.: `this.make.image(config, false)`. You can still specify the `add` property in the Config object too, but if the argument is provided it will override the property.
* We have removed the TextureManager.addAtlasPyxel method and related parser. It didn't work anyway and no-one seems to use Pyxel any more. If we get enough demand we can consider adding it back.
* When adding an Audio Sprite to the Sound Manager it will now respect the `loop` property, if set in the source JSON.
* The Texture class has a new method `getDataSourceImage` which will return the raw image data of the data source.
* The WebAudioSoundManager will now listen for 'click' events on the document body, as well as touch events, before resuming the AudioContext, in order to deal with the changes made in Chrome v66 not playing audio until a user gesture is received, even on desktop.

### Bug Fixes

* DataManagerPlugin would throw an error on Game.destroy if you had any Scenes in the Scene Manager had not been run. Fix #3596 (thanks @kuoruan)
* If you created a Game with no Scenes defined, and then added one via `Game.scene.add` and passed in a data object, the data would be ignored when starting the Scene.
* Adding a Group with an array of children in the constructor was broken since 3.5. Fix #3612 (thanks @fariazz @samme)
* Fix ParticleEmitter toJSON output, it was missing the `angle` property and the Emitter Ops were being cast wrong (thanks @samme)
* Fixed loading normals with multi image load (thanks @iamchristopher)
* Array.AddAt would fail if it branched to the fast-path within a Container due to an invalid property. Fix #3617 (thanks @poasher)
* Polygon.setTo would fail if given an array of arrays as a list of points. Fix #3619 (thanks @PaulTodd)
* Text objects with word wrapping enabled would gain an extra space at the end of the line. These are now only added when the word index is greater than the previous one. Fix #3626 (thanks @rexrainbow)
* Container.getBounds now checks if it can call `getBounds` on its children before doing so, as some do not have this method (such as Graphics objects) so they no longer cause the call to crash. Fix #3623 (thanks @poasher)
* The Animation Component `setProgress` method was setting the frame on the wrong object. Fix #3633 (thanks @benhhopkins)
* SceneManager.moveAbove wouldn't move the Scene if it was already above the target Scene. Now it moves to be directly above the target Scene no matter where in the Scene List it is.
* SceneManager.moveBelow wouldn't move the Scene if it was already below the target Scene. Now it moves to be directly below the target Scene no matter where in the Scene List it is.
* Emitter.setEmitZone was rejecting custom objects passed as the source argument because it was checking for the wrong methods (thanks @samme)
* ScenePlugin.setActive would only toggle the current Scene, not any given Scene.
* ScenePlugin.setVisible would only toggle the current Scene, not any given Scene.
* The Graphics Creator would automatically add the Graphics to the display list by mistake. The default should be to remain hidden. Fix #3637 (thanks @mikuso)
* BitmapText, both static and dynamic, can now take any data-type, including numbers, for the `text` argument in the constructor. Before they only worked via `setText` (thanks @Jelaw21)
* The Forward Diffuse Light Pipeline was hard coded to assume the normal map would be stored in the source index zero. It now correctly obtains the normal map from the frame source index, which means all Game Objects that used frames from multi-atlas textures will now work with lights properly.
* The Tiled Base64Decode function worked off the wrong array length, causing extra undefined values at the end (thanks @tamagokun)

### Examples, Documentation and TypeScript

My thanks to the following for helping with the Phaser 3 Examples, Docs and TypeScript definitions, either by reporting errors, fixing them or helping author the docs:

@wtravO @Fabadiculous @zilbuz @samme @iamchristopher @erd0s @PaNaVTEC @ksmai @snowbillr 

## Version 3.7.0 - Sinon - 4th May 2018

A beta release of the 3.7.0 version. See 3.7.1 for details.

## Version 3.6.0 - Asuna - 19th April 2018

### New Features

* Containers are now fully available! We have removed the beta warning and fixed the way in which they work with Cameras, input and scroll factors. They are also fully documented, so please see their docs and examples for use.
* Group.getLast will return the last member in the Group matching the search criteria.
* Group.getFirstNth will return the nth member in the Group, scanning from top to bottom, that matches the search criteria.
* Group.getLastNth will return the nth member in the Group, scanning in reverse, that matches the search criteria.
* Group.remove has a new optional argument `destroyChild` that will call `destroy` on the child after removing it.
* Group.clear has a new optional argument `destroyChild` that will call `destroy` on all children in the Group after removing them.

### Updates

* Impact Physics Game Objects have changed `setLite` to `setLiteCollision`.
* Impact Physics Game Objects have changed `setPassive` to `setPassiveCollision`.
* Impact Physics Game Objects have changed `setFixed` to `setFixedCollision`.
* Impact Physics Game Objects have changed `setActive` to `setActiveCollision`, previously the `setActive` collision method was overwriting the Game Objects `setActive` method, hence the renaming.
* The modifications made to the RTree class in Phaser 3.4.0 to avoid CSP policy violations caused a significant performance hit once a substantial number of bodies were involved. We have recoded how the class deals with its accessor formats and returned to 3.3 level performance while still maintaining CSP policy adherence. Fix #3594 (thanks @16patsle)
* The Retro Font namespace has changed to `Phaser.GameObjects.RetroFont`. Previously, you would access the parser and constants via `BitmapText`, i.e.: `Phaser.GameObjects.BitmapText.ParseRetroFont.TEXT_SET6`. This has now changed to its own namespace, so the same line would be: `Phaser.GameObjects.RetroFont.TEXT_SET6`. The Parser is available via `Phaser.GameObjects.RetroFont.Parse`. This keeps things cleaner and also unbinds RetroFont from BitmapText, allowing you to cleanly exclude it from your build should you wish. All examples have been updated to reflect this.
* If using the `removeFromScene` option in Group.remove or Group.clear it will remove the child/ren from the Scene to which they belong, not the Scene the Group belongs to.

### Bug Fixes

* Fixed a bug that caused data to not be passed to another Scene if you used a transition to start it. Fix #3586 (thanks @willywu)
* Group.getHandler would return any member of the Group, regardless of the state, causing pools to remain fixed at once member. Fix #3592 (thanks @samme)

### Examples, Documentation and TypeScript

My thanks to the following for helping with the Phaser 3 Examples, Docs and TypeScript definitions, either by reporting errors, fixing them or helping author the docs:

@Fabadiculous @Antriel

## Version 3.5.1 - Kirito - 17th April 2018

### Updates

* The change made in 3.5.0 with how the Scene systems lifecycle is handled has been tweaked. When a Scene is instantiated it will now emit a boot event, as before, and Systems that need it will listen for this event and set-up their internal properties as required. They'll also do the same under the 'start' event, allowing them to restart properly once shutdown. In 3.5 if a Scene was previously not launched or started you wouldn't be able to access all of its internal systems fully, but in 3.5.1 you can.

### Bug Fixes

* LoaderPlugin.destroy would try and remove an incorrect event listener.
* TileSprites would try to call `deleteTexture` on both renderers, but it's only available in WebGL (thanks @jmcriat)
* Using a geometry mask stopped working in WebGL. Fix #3582 (thanks @rafelsanso)
* The particle emitter incorrectly adjusted the vertex count, causing WebGL rendering issues. Fix #3583 (thanks @murteira)

### Examples, Documentation and TypeScript

My thanks to the following for helping with the Phaser 3 Examples, Docs and TypeScript definitions, either by reporting errors, fixing them or helping author the docs:

@NemoStein @gabegordon @gazpachu @samme @cristlee @melissaelopez @dazigemm @tgrajewski

## Version 3.5.0 - Kirito - 16th April 2018

### Changes to Cameras

* The Camera class and all Camera effects are now fully covered by 100% complete JS Docs.
* All Camera effects have been recoded from scratch. They now follow a unified effects structure and each effect is encapsulated in its own class found in the 'effects' folder. Currently there are Fade, Flash and Shake effects.
* The new effects classes are accessed via the Camera properties `fadeEffect`, `flashEffect` and `shakeEffect`. You can still use the friendly Camera level methods: `shake`, `fade` and `flash`.
* The new structure means you can replace the default effects with your own by simply overwriting the properties with your own class.
* The effects now work properly under any combination. For example, you can fade out then in, or in then out, and still flash or shake while a fade is happening. The renderers now properly stack the effects in order to allow this.
* All of the effect related Camera properties (like `_fadeAlpha`) have been removed. If you need access to these values you can get it much more cleanly via the camera effects classes themselves. They were always private anyway, but we know some of you needed to modify them, so have been doing so from your code. This code will now need updating.
* Removed Camera.clearBeforeRender property as it was never used internally. This setting can be enabled on a Game-wide basis.
* Camera now extends the Event Emitter, allowing it to emit events.
* Camera.cullHitTest has been removed. It was never used internally and duplicates the code in `Camera.cull`.
* The `callback` property of the Camera effects methods has changed purpose. It is no longer an `onComplete` callback, but is now an `onUpdate` callback. It is invoked every frame for the duration of the effect. See the docs for argument details.
* Camera effects now dispatch events. They dispatch 'start' and 'complete' events, which can be used to handle any actions you may previously have been doing in the callback. See the effects docs and examples for the event names and arguments.
* The Camera Shake effect now lets you specify a different intensities for the x and y dimensions.
* You can track the progress of all events via the `progress` property on the effect instance, allowing you to sync effect duration with other in-game events.

### New Feature: Scene Transitions

There is a new method available in the ScenePlugin, available via: `this.scene.transition` which allows you to transition from one Scene to another over the duration specified. The method takes a configuration object which lets you control various aspects of the transition, from moving the Scenes around the display list, to specifying an onUpdate callback.

The calling Scene can be sent to sleep, stopped or removed entirely from the Scene Manager at the end of the transition, and you can even lock down input events in both Scenes while the transition is happening, if required. There are various events dispatched from both the calling and target Scene, which combined with the onUpdate callback give you the flexibility to create some truly impressive transition effects both into and out of Scenes.

Please see the complete JSDocs for the ScenePlugin for more details, as well as the new examples in the Phaser 3 Labs.

### More New Features

* GameObject.ignoreDestroy allows you to control if a Game Object is destroyed or not. Setting the flag will tell it to ignore destroy requests from Groups, Containers and even the Scene itself. See the docs for more details.
* The Scene Input Plugin has a new property `enabled` which allows you to enable or disable input processing on per Scene basis.

### Bug Fixes

* MatterEvents.off() would cause a TypeError if you destroyed the Matter world. Fix #3562 (thanks @pixelscripter)
* DynamicBitmapText was missing the `letterSpacing` property, causing it to only render the first character in WebGL (thanks @Antriel)
* The Animation component didn't properly check for the animation state in its update, causing pause / resume to fail. Fix #3556 (thanks @Antriel @siolfyr)
* The Scene Manager would never reach an `isBooted` state if you didn't add any Scenes into the Game Config. Fix #3553 (thanks @rgk)
* Fixed issue in HTMLAudioSound where `mute` would get into a recursive loop.
* Every RenderTexture would draw the same content due to a mis-use of the CanvasPool (this also impacted TileSprites). Fix #3555 (thanks @kuoruan)
* Group.add and Group.addMultiple now respect the Group.maxSize property, stopping you from over-populating a Group (thanks @samme)
* When using HTML5 Audio, sound manager now tries to unlock audio after every scene loads, instead of only after first one. Fix #3309 (thanks @pavle-goloskokovic)
* Group.createMultiple would insert null entries if the Group became full during the operation, causing errors later. Now it stops creating objects if the Group becomes full (thanks @samme)
* Group.remove didn't check if the passed Game Object was already a member of the group and would call `removeCallback` and (if specified) `destroy` in any case. Now it does nothing if the Game Object isn't a member of the group (thanks @samme)
* If a Group size exceeded `maxSize` (which can happen if you reduce maxSize beneath the current size), `isFull` would return false and the group could continue to grow. Now `isFull` returns true in that case (thanks @samme)
* Camera.fadeIn following a fadeOut wouldn't work, but is now fixed as a result of the Camera effects rewrite. Fix #3527 (thanks @Jerenaux)
* Particle Emitters with large volumes of particles would throw the error `GL_INVALID_OPERATION: Vertex buffer is not big enough for the draw call` in WebGL.
* Fixed issue with Game.destroy not working correctly under WebGL since 3.4. Fix #3569 (thanks @Huararanga)

### Updates

* Removed the following properties from BaseSound as they are no longer required. Each class that extends BaseSound implements them directly as getters: `mute`, `loop`, `seek` and `volume`.
* The Device.OS test to see if Phaser is running under node.js has been strengthened to support node-like environments like Vue (thanks @Chumper)
* Every Plugin has been updated to correctly follow the same flow through the Scene lifecycle. Instead of listening for the Scene 'boot' event, which is only dispatched once (when the Scene is first created), they will now listen for the Scene 'start' event, which occurs every time the Scene is started. All plugins now consistently follow the same Shutdown and Destroy patterns too, meaning they tidy-up after themselves on a shutdown, not just a destroy. Overall, this change means that there should be less issues when returning to previously closed Scenes, as the plugins will restart themselves properly.
* When shutting down a Scene all Game Objects that belong to the scene will now automatically destroy themselves. They would previously be removed from the display and update lists, but the objects themselves didn't self-destruct. You can control this on a per-object basis with the `ignoreDestroy` property.
* A Matter Mouse Spring will disable debug draw of its constraint by default (you can override it by passing in your own config)
* The RandomDataGenerator class is now exposed under Phaser.Math should you wish to instantiate it yourself. Fix #3576 (thanks @wtravO)
* Refined the Game.destroy sequence, so it will now only destroy the game at the start of the next frame, not during processing.

### Examples, Documentation and TypeScript

My thanks to the following for helping with the Phaser 3 Examples, Docs and TypeScript definitions, either by reporting errors, fixing them or helping author the docs:

@samme @Antriel

## Version 3.4.0 - Miyako - 12th April 2018

### New Features

A beta release of the new Container Game Object arrives in this version. We've flagged it as beta because there are known issues in using Containers in Scenes that have multiple cameras or irregular camera viewports. However, in all other instances we've tested they are operating normally, so we felt it would be best to release them into this build to give developers a chance to get used to them. Using a Container will issue a single console warning as a reminder. We will remove this once they leave beta in a future release. In the meantime they are fully documented and you can find numerous examples in the Phaser 3 Examples repo too.

* A new property was added to Matter.World, `correction` which is used in the Engine.update call and allows you to adjust the time being passed to the simulation. The default value is 1 to remain consistent with previous releases.
* Matter Physics now has a new config property `getDelta` which allows you to specify your own function to calculate the delta value given to the Matter Engine when it updates.
* Matter Physics has two new methods: `set60Hz` and `set30Hz` which will set an Engine update rate of 60Hz and 30Hz respectively. 60Hz being the default.
* Matter Physics has a new config and run-time property `autoUpdate`, which defaults to `true`. When enabled the Matter Engine will update in sync with the game step (set by Request Animation Frame). The delta value given to Matter is now controlled by the `getDelta` function.
* Matter Physics has a new method `step` which manually advances the physics simulation by one iteration, using whatever delta and correction values you pass in to it. When used in combination with `autoUpdate=false` you can now explicitly control the update frequency of the physics simulation and unbind it from the game step.
* Matter Physics has two new debug properties: `debugShowJoint` and `debugJointColor`. If defined they will display joints in Matter bodies during the postUpdate debug phase (only if debug is enabled) (thanks @OmarShehata)
* Group.destroy has a new optional argument `destroyChildren` which will automatically call `destroy` on all children of a Group if set to true (the default is false, hence it doesn't change the public API). Fix #3246 (thanks @DouglasLapsley)
* WebAudioSound.setMute is a chainable way to mute a single Sound instance.
* WebAudioSound.setVolume is a chainable way to set the volume of a single Sound instance.
* WebAudioSound.setSeek is a chainable way to set seek to a point of a single Sound instance.
* WebAudioSound.setLoop is a chainable way to set the loop state of a single Sound instance.
* HTML5AudioSound.setMute is a chainable way to mute a single Sound instance.
* HTML5AudioSound.setVolume is a chainable way to set the volume of a single Sound instance.
* HTML5AudioSound.setSeek is a chainable way to set seek to a point of a single Sound instance.
* HTML5AudioSound.setLoop is a chainable way to set the loop state of a single Sound instance.
* BitmapText has a new property `letterSpacing` which accepts a positive or negative number to add / reduce spacing between characters (thanks @wtravO)
* You can now pass a Sprite Sheet or Canvas as the Texture key to `Tilemap.addTileset` and it will work in WebGL, where-as before it would display a corrupted tilemap. Fix #3407 (thanks @Zykino)
* Graphics.slice allows you to easily draw a Pacman, or slice of pie shape to a Graphics object.
* List.addCallback is a new optional callback that is invoked every time a new child is added to the List. You can use this to have a callback fire when children are added to the Display List.
* List.removeCallback is a new optional callback that is invoked every time a new child is removed from the List. You can use this to have a callback fire when children are removed from the Display List.
* ScenePlugin.restart allows you to restart the current Scene. It's the same result as calling `ScenePlugin.start` without any arguments, but is more clear.
* Utils.Array.Add allows you to add one or more items safely to an array, with optional limits and callbacks.
* Utils.Array.AddAt allows you to add one or more items safely to an array at a specified position, with optional limits and callbacks.
* Utils.Array.BringToTop allows you to bring an array element to the top of the array.
* Utils.Array.CountAllMatching will scan an array and count all elements with properties matching the given value.
* Utils.Array.Each will pass each element of an array to a given callback, with optional arguments.
* Utils.Array.EachInRange will pass each element of an array in a given range to a callback, with optional arguments.
* Utils.Array.GetAll will return all elements from an array, with optional property and value comparisons.
* Utils.Array.GetFirst will return the first element in an array, with optional property and value comparisons.
* Utils.Array.GetRandomElement has been renamed to GetRandom and will return a random element from an array.
* Utils.Array.MoveDown will move the given array element down one position in the array.
* Utils.Array.MoveTo will move the given array element to the given position in the array.
* Utils.Array.MoveUp will move the given array element up one position in the array.
* Utils.Array.Remove will remove the given element or array of elements from the array, with an optional callback.
* Utils.Array.RemoveAt will remove the element from the given position in the array, with an optional callback.
* Utils.Array.RemoveBetween will remove the elements between the given range in the array, with an optional callback.
* Utils.Array.Replace will replace an existing element in an array with a new one.
* Utils.Array.SendToBack allows you to send an array element to the bottom of the array.
* Utils.Array.SetAll will set a property on all elements of an array to the given value, with optional range limits.
* Utils.Array.Swap will swap the position of two elements in an array.
* TransformMatrix.destroy is a new method that will clear out the array and object used by a Matrix internally.
* BaseSound, and by extension WebAudioSound and HTMLAudioSound, will now emit a `destroy` event when they are destroyed (thanks @rexrainbow)
* A new property was added to the Scene config: `mapAdd` which is used to extend the default injection map of a scene instead of overwriting it (thanks @sebashwa)
* GetBounds `getTopLeft`, `getTopRight`, `getBottomLeft` and `getBottomRight` all have a new optional argument `includeParent` which will factor in all ancestor transforms to the returned point.

### Bug Fixes

* In the WebGL Render Texture the tint of the texture was always set to 0xffffff and therefore the alpha values were ignored. The tint is now calculated using the alpha value. Fix #3385 (thanks @ger1995)
* The RenderTexture now uses the ComputedSize component instead of Size (which requires a frame), allowing calls to getBounds to work. Fix #3451 (thanks @kuoruan)
* PathFollower.start has been renamed to `startFollow`, but PathFollower.setPath was still using `PathFollower.start` (thanks @samid737)
* BaseSoundManager.rate and BaseSoundManager.detune would incorrectly called `setRate` on its sounds, instead of `calculateRate`.
* The Gamepad Axis `getValue` method now correctly applies the threshold and zeroes out the returned value.
* The HueToComponent module was not correctly exporting itself. Fix #3482 (thanks @jdotrjs)
* Matter.World was using `setZ` instead of `setDepth` for the Debug Graphics Layer, causing it to appear behind objects in some display lists.
* Game.destroy now checks to see if the `renderer` exists before calling destroy on it. Fix #3498 (thanks @Huararanga)
* Keyboard.JustDown and Keyboard.JustUp were being reset too early, causing them to fail when called in `update` loops. Fix #3490 (thanks @belen-albeza)
* RenderTexture.destroy no longer throws an error when called. Fix #3475 (thanks @kuoruan)
* The WebGL TileSprite batch now modulates the tilePosition to avoid large values being passed into the UV data, fixing corruption when scrolling TileSprites over a long period of time. Fix #3402 (thanks @vinerz @FrancescoNegri)
* LineCurve.getResolution was missing the `divisions` argument and always returning 1, which made it fail when used as part of a Path. It now defaults to return 1 unless specified otherwise (thanks _ok)
* A Game Object enabled for drag would no longer fire over and out events after being dragged, now it does (thanks @jmcriat)
* Line.getPointA and Line.getPointB incorrectly set the values into the Vector2 (thanks @Tomas2h)
* DynamicTilemapLayer now uses the ComputedSize component, which stops it breaking if you call `setDisplaySize` (thanks Babsobar)
* StaticTilemapLayer now uses the ComputedSize component, which stops it breaking if you call `setDisplaySize` (thanks Babsobar)
* CanvasPool.first always returned `null`, and now returns the first available Canvas. Fix #3520 (thanks @mchiasson)
* When starting a new Scene with an optional `data` argument it wouldn't get passed through if the Scene was not yet available (i.e. the game had not fully booted). The data is now passed to the Scene `init` and `create` methods and stored in the Scene Settings `data` property. Fix #3363 (thanks @pixelhijack)
* Tween.restart handles removed tweens properly and reads them back into the active queue for the TweenManager (thanks @wtravO)
* Tween.resume will now call `Tween.play` on a tween that was paused due to its config object, not as a result of having its paused method called. Fix #3452 (thanks @jazen)
* LoaderPlugin.isReady referenced a constant that no longer exists. Fix #3503 (thanks @Twilrom)
* Tween Timeline.destroy was trying to call `destroy` on Tweens instead of `stop` (thanks @Antriel)
* Calling `setOffset` on a Static Arcade Physics Body would break because the method was missing. It has been added and now functions as expected. Fix #3465 (thanks @josephjaniga and @DouglasLapsley)
* Calling Impact.World.remove(body) during a Body.updateCallback would cause the internal loop to crash when trying to access a now missing body. Two extra checks are in place to avoid this (thanks @iamDecode)
* If `setInteractive` is called on a Game Object that fails to set a hit area, it will no longer try to assign `dropZone` to an undefined `input` property.
* The Matter SetBody Component will no longer try to call `setOrigin` unless the Game Object has the origin component (which not all do, like Graphics and Container)
* Matter Image and Matter Sprite didn't define a `destroy` method, causing an error when trying to destroy the parent Game Object. Fix #3516 (thanks @RollinSafary)

### Updates

* The RTree library (rbush) used by Phaser 3 suffered from violating CSP policies by dynamically creating Functions at run-time in an eval-like manner. These are now defined via generators. Fix #3441 (thanks @jamierocks @Colbydude @jdotrjs)
* BaseSound has had its `rate` and `detune` properties removed as they are always set in the overriding class.
* BaseSound `setRate` and `setDetune` from the 3.3.0 release have moved to the WebAudioSound and HTML5AudioSound classes respectively, as they each handle the values differently.
* The file `InteractiveObject.js` has been renamed to `CreateInteractiveObject.js` to more accurately reflect what it does and to avoid type errors in the docs.
* Renamed the Camera Controls module exports for `Fixed` to `FixedKeyControl` and `Smoothed` to `SmoothedKeyControl` to match the class names. Fix #3463 (thanks @seivan)
* The ComputedSize Component now has `setSize` and `setDisplaySize` methods. This component is used for Game Objects that have a non-texture based size.
* The GamepadManager now extends EventEmitter directly, just like the KeyboardManager does.
* The Gamepad Axis threshold has been increased from 0.05 to 0.1.
* Utils.Array.FindClosestInSorted has a new optional argument `key` which will allow you to scan a top-level property of any object in the given sorted array and get the closest match to it.
* Vector2.setTo is a method alias for Vector2.set allowing it to be used inter-changeably with Geom.Point.
* List.add can now take an array or a single child. If an array is given it's passed over to List.addMultiple.
* List.add has a new optional argument `skipCallback`.
* List.addAt has a new optional argument `skipCallback`.
* List.addMultiple has a new optional argument `skipCallback`.
* List.remove has a new optional argument `skipCallback`.
* List.removeAt has a new optional argument `skipCallback`.
* List.removeBetween has a new optional argument `skipCallback`.
* List.removeAll has a new optional argument `skipCallback`.
* When using the `extend` property of a Scene config object it will now block overwriting the Scene `sys` property.
* When using the `extend` property of a Scene config object, if you define a property called `data` that has an object set, it will populate the Scenes Data Manager with those values.
* SceneManager._processing has been renamed to `isProcessing` which is now a boolean, not an integer. It's also now public and read-only.
* SceneManager.isBooted is a new boolean read-only property that lets you know if the Scene Manager has performed its initial boot sequence.
* TransformMatrix has the following new getter and setters: `a`, `b`, `c`, `d`, `tx` and `ty`. It also has the following new getters: `scaleX`, `scaleY` and `rotation`.
* List.getByKey has been removed. Use `List.getFirst` instead which offers the exact same functionality.
* List.sortIndexHandler has been removed because it's no longer required.
* List.sort no longer takes an array as its argument, instead it only sorts the List contents by the defined property.
* List.addMultiple has been removed. Used `List.add` instead which offers the exact same functionality.
* List is now internally using all of the new Utils.Array functions.
* Rectangle.Union will now cache all vars internally so you can use one of the input rectangles as the output rectangle without corrupting it.
* When shutting down a Matter World it will now call MatterEvents.off, clearing all events, and also `removeAllListeners` for any local events.
* Removed InputPlugin.sortInteractiveObjects because the method isn't used anywhere internally.

### Animation System Updates

We have refactored the Animation API to make it more consistent with the rest of Phaser 3 and to fix some issues. All of the following changes apply to the Animation Component:

* Animation durations, delays and repeatDelays are all now specified in milliseconds, not seconds like before. This makes them consistent with Tweens, Sounds and other parts of v3. You can still use the `frameRate` property to set the speed of an animation in frames per second.
* All of the Animation callbacks have been removed, including `onStart`, `onRepeat`, `onUpdate` and `onComplete` and the corresponding params arrays like `onStartParams` and the property `callbackScope`. The reason for this is that they were all set on a global level, meaning that if you had 100 Sprites sharing the same animation, it was impossible to set the callbacks to fire for just one of those Sprites, but instead they would fire for all 100 and it was up to you to figure out which Sprite you wanted to update. Instead of callbacks animations now dispatch events on the Game Objects in which they are running. This means you can now do `sprite.on('animationstart')` and it will be invoked at the same point the old `onStart` callback would have been. The new events are: `animationstart`, `animtionrepeat`, `animationupdate` and `animationcomplete`. They're all dispatched from the Game Object that has the animation playing, not from the animation itself. This allows you far more control over what happens in the callbacks and we believe generally makes them more useful.
* The AnimationFrame.onUpdate callback has been removed. You can now use the `animationupdate` event dispatched from the Game Object itself and check the 2nd argument, which is the animation frame.
* Animation.stopAfterDelay is a new method that will stop a Sprites animation after the given time in ms.
* Animation.stopOnRepeat is a new method that will stop a Sprites animation when it goes to repeat.
* Animation.stopOnFrame is a new method that will stop a Sprites animation when it sets the given frame.
* Animation.stop no longer has the `dispatchCallbacks` argument, because it dispatches an event which you can choose to ignore.
* `delay` method has been removed.
* `setDelay` allows you to define the delay before playback begins.
* `getDelay` returns the animation playback delay value.
* `delayedPlay` now returns the parent Game Object instead of the component.
* `load` now returns the parent Game Object instead of the component.
* `pause` now returns the parent Game Object instead of the component.
* `resume` now returns the parent Game Object instead of the component.
* `isPaused` returns a boolean indicating the paused state of the animation.
* `paused` method has been removed.
* `play` now returns the parent Game Object instead of the component.
* `progress` method has been removed.
* `getProgress` returns the animation progress value.
* `setProgress` lets you jump the animation to a specific progress point.
* `repeat` method has been removed.
* `getRepeat` returns the animation repeat value.
* `setRepeat` sets the number of times the current animation will repeat.
* `repeatDelay` method has been removed.
* `getRepeatDelay` returns the animation repeat delay value.
* `setRepeatDelay` sets the delay time between each repeat.
* `restart` now returns the parent Game Object instead of the component.
* `stop` now returns the parent Game Object instead of the component.
* `timeScale` method has been removed.
* `getTimeScale` returns the animation time scale value.
* `setTimeScale` sets the time scale value.
* `totalFrames` method has been removed.
* `getTotalFrames` returns the total number of frames in the animation.
* `totalProgres` method has been removed as it did nothing and was mis-spelt.
* `yoyo` method has been removed.
* `getYoyo` returns if the animation will yoyo or not.
* `setYoyo` sets if the animation will yoyo or not.
* `updateFrame` will now call `setSizeToFrame` on the Game Object, which will adjust the Game Objects `width` and `height` properties to match the frame size. Fix #3473 (thanks @wtravO @jp-gc)
* `updateFrame` now supports animation frames with custom pivot points and injects these into the Game Object origin.
* `destroy` now removes events, references to the Animation Manager and parent Game Object, clears the current animation and frame and empties internal arrays.
* Changing the `yoyo` property on an Animation Component would have no effect as it only ever checked the global property, it now checks the local one properly allowing you to specify a `yoyo` on a per Game Object basis.
* Animation.destroy now properly clears the global animation object.
* Animation.getFrameByProgress will return the Animation Frame that is closest to the given progress value. For example, in a 5 frame animation calling this method with a value of 0.5 would return the middle frame.

### Examples, Documentation and TypeScript

My thanks to the following for helping with the Phaser 3 Examples, Docs and TypeScript definitions, either by reporting errors, fixing them or helping author the docs:

@gabegordon @melissaelopez @samid737 @nbs @tgrajewski @pagesrichie @hexus @mbrickn @erd0s @icbat @Matthew-Herman @ampled @mkimmet @PaNaVTEC

## Version 3.3.0 - Tetsuo - 22nd March 2018

A special mention must go to @orblazer for their outstanding assistance in helping to complete the JSDoc data-types, callbacks and type defs across the API.

### New Features

* TextStyle has two new properties: `baselineX` and `baselineY` which allow you to customize the 'magic' value used in calculating the text metrics.
* Game.Config.preserveDrawingBuffer is now passed to the WebGL Renderer (default `false`).
* Game.Config.failIfMajorPerformanceCaveat is now passed to the WebGL Renderer (default `false`).
* Game.Config.powerPreference is now passed to the WebGL Renderer (default `default`).
* Game.Config.antialias is now passed to the WebGL Renderer as the antialias context property (default `true`).
* Game.Config.pixelArt is now only used by the WebGL Renderer when creating new textures.
* Game.Config.premultipliedAlpha is now passed to the WebGL Renderer as the premultipliedAlpha context property (default `true`).
* You can now specify all of the renderer config options within a `render` object in the config. If no `render` object is found, it will scan the config object directly for the properties.
* Group.create has a new optional argument: `active` which will set the active state of the child being created (thanks @samme)
* Group.create has a new optional argument: `active` which will set the active state of the child being created (thanks @samme)
* Group.createMultiple now allows you to include the `active` property in the config object (thanks @samme)
* TileSprite has a new method: `setTilePosition` which allows you to set the tile position in a chained called (thanks @samme)
* Added the new Action - WrapInRectangle. This will wrap each items coordinates within a rectangles area (thanks @samme)
* Arcade Physics has the new methods `wrap`, `wrapArray` and `wrapObject` which allow you to wrap physics bodies around the world bounds (thanks @samme)
* The Tweens Timeline has a new method: `makeActive` which delegates control to the Tween Manager (thanks @allanbreyes)
* Actions.GetLast will return the last element in the items array matching the conditions.
* Actions.PropertyValueInc is a new action that will increment any property of an array of objects by the given amount, using an optional step value, index and iteration direction. Most Actions have been updated to use this internally.
* Actions.PropertyValueSet is a new action that will set any property of an array of objects to the given value, using an optional step value, index and iteration direction. Most Actions have been updated to use this internally.
* Camera.shake now has an optional `callback` argument that is invoked when the effect completes (thanks @pixelscripter)
* Camera.fade now has an optional `callback` argument that is invoked when the effect completes (thanks @pixelscripter)
* Camera.flash now has an optional `callback` argument that is invoked when the effect completes (thanks @pixelscripter)
* Camera.fadeIn is a new method that will fade the camera in from a given color (black by default) and then optionally invoke a callback. This is the same as using Camera.flash but with an easier to grok method name. Fix #3412 (thanks @Jerenaux)
* Camera.fadeOut is a new method that will fade the camera out to a given color (black by default) and then optionally invoke a callback. This is the same as using Camera.fade but with an easier to grok method name. Fix #3412 (thanks @Jerenaux)
* Groups will now listen for a `destroy` event from any Game Object added to them, and if received will automatically remove that GameObject from the Group. Fix #3418 (thanks @hadikcz)
* MatterGameObject is a new function, available via the Matter Factory in `this.matter.add.gameObject`, that will inject a Matter JS Body into any Game Object, such as a Text or TileSprite object.
* Matter.SetBody and SetExistingBody will now set the origin of the Game Object to be the Matter JS sprite.xOffset and yOffset values, which will auto-center the Game Object to the origin of the body, regardless of shape.
* SoundManager.setRate is a chainable method to allow you to set the global playback rate of all sounds in the SoundManager.
* SoundManager.setDetune is a chainable method to allow you to set the global detuning of all sounds in the SoundManager.
* SoundManager.setMute is a chainable method to allow you to set the global mute state of the SoundManager.
* SoundManager.setVolume is a chainable method to allow you to set the global volume of the SoundManager.
* BaseSound.setRate is a chainable method to allow you to set the playback rate of the BaseSound.
* BaseSound.setDetune is a chainable method to allow you to set the detuning value of the BaseSound.

### Bug Fixes

* Fixed the Debug draw of a scaled circle body in Arcade Physics (thanks @pixelpicosean)
* Fixed bug in `DataManager.merge` where it would copy the object reference instead of its value (thanks @rexrainbow)
* The SceneManager no longer copies over the `shutdown` and `destroy` callbacks in createSceneFromObject, as these are not called automatically and should be invoked via the Scene events (thanks @samme)
* The default Gamepad Button threshold has been changed from 0 to 1. Previously the value of 0 was making all gamepad buttons appear as if they were always pressed down (thanks @jmcriat)
* InputManager.hitTest will now factor the game resolution into account, stopping the tests from being offset if resolution didn't equal 1 (thanks @sftsk)
* CameraManager.getCamera now returns the Camera based on its name (thanks @bigbozo)
* Fixed Tile Culling for zoomed Cameras. When a Camera was zoomed the tiles would be aggressively culled as the dimensions didn't factor in the zoom level (thanks @bigbozo)
* When calling ScenePlugin.start any additional data passed to the method would be lost if the scene wasn't in an active running state (thanks @stuff)
* When calling Timeline.resetTweens, while the tweens are pending removal or completed, it would throw a TypeError about the undefined `makeActive` (thanks @allanbreyes)
* The WebGL Context would set `antialias` to `undefined` as it wasn't set in the Game Config. Fix #3386 (thanks @samme)
* The TweenManager will now check the state of a tween before playing it. If not in a pending state it will be skipped. This allows you to stop a tween immediately after creating it and not have it play through once anyway. Fix #3405 (thanks @Twilrom)
* The InputPlugin.processOverOutEvents method wasn't correctly working out the total of the number of objects interacted with, which caused input events to be disabled in Scenes further down the scene list if something was being dragged in an upper scene. Fix #3399 (thanks @Jerenaux)
* The InputPlugin.processDragEvents wasn't always returning an integer.
* LoaderPlugin.progress and the corresponding event now factor in both the list size and the inflight size when calculating the percentage complete. Fix #3384 (thanks @vinerz @rblopes @samme)
* Phaser.Utils.Array.Matrix.RotateLeft actually rotated to the right (thanks @Tomas2h)
* Phaser.Utils.Array.Matrix.RotateRight actually rotated to the left (thanks @Tomas2h)
* When deleting a Scene from the SceneManager it would set the key in the scenes has to `undefined`, preventing you from registering a new Scene with the same key. It's now properly removed from the hash(thanks @macbury)
* Graphics.alpha was being ignored in the WebGL renderer and is now applied properly to strokes and fills. Fix #3426 (thanks @Ziao)
* The font is now synced to the context in Text before running a word wrap, this ensures the wrapping result between updating the text and getting the wrapped text is the same. Fix #3389 (thanks @rexrainbow)
* Added the ComputedSize component to the Text Game Object, which allows Text.getBounds, and related methods, to work again instead of returning NaN.
* Group.remove now calls the `removeCallback` and passes it the child that was removed (thanks @orblazer)

### Updates

* The Text testString has changed from `|MÉqgy` to `|MÃ‰qgy`.
* The WebGLRenderer width and height values are now floored when multiplied by the resolution.
* The WebGL Context now sets `premultipliedAlpha` to `true` by default, this prevents the WebGL context from rendering as plain white under certain versions of macOS Safari.
* The Phaser.Display.Align constants are now exposed on the namespace. Fix #3387 (thanks @samme)
* The Phaser.Loader constants are now exposed on the namespace. Fix #3387 (thanks @samme)
* The Phaser.Physics.Arcade constants are now exposed on the namespace. Fix #3387 (thanks @samme)
* The Phaser.Scene constants are now exposed on the namespace. Fix #3387 (thanks @samme)
* The Phaser.Tweens constants are now exposed on the namespace. Fix #3387 (thanks @samme)
* The Array Matrix utils are now exposed and available via `Phaser.Utils.Array.Matrix`.
* Actions.Angle has 3 new arguments: `step`, `index` and `direction`.
* Actions.IncAlpha has 3 new arguments: `step`, `index` and `direction`.
* Actions.IncX has 3 new arguments: `step`, `index` and `direction`.
* Actions.IncY has 3 new arguments: `step`, `index` and `direction`.
* Actions.IncXY has 4 new arguments: `stepX`, `stepY`, `index` and `direction`.
* Actions.Rotate has 3 new arguments: `step`, `index` and `direction`.
* Actions.ScaleX has 3 new arguments: `step`, `index` and `direction`.
* Actions.ScaleXY has 4 new arguments: `stepX`, `stepY`, `index` and `direction`.
* Actions.ScaleY has 3 new arguments: `step`, `index` and `direction`.
* Actions.SetAlpha has 2 new arguments: `index` and `direction`.
* Actions.SetBlendMode has 2 new arguments: `index` and `direction`.
* Actions.SetDepth has 2 new arguments: `index` and `direction`.
* Actions.SetOrigin has 4 new arguments: `stepX`, `stepY`, `index` and `direction`.
* Actions.SetRotation has 2 new arguments: `index` and `direction`.
* Actions.SetScale has 2 new arguments: `index` and `direction`.
* Actions.SetScaleX has 2 new arguments: `index` and `direction`.
* Actions.SetScaleY has 2 new arguments: `index` and `direction`.
* Actions.SetVisible has 2 new arguments: `index` and `direction`.
* Actions.SetX has 2 new arguments: `index` and `direction`.
* Actions.SetXY has 2 new arguments: `index` and `direction`.
* Actions.SetY has 2 new arguments: `index` and `direction`.
* Line.getPointA now returns a Vector2 instead of an untyped object. It also now has an optional argument that allows you to pass a vec2 in to be populated, rather than creating a new one.
* Line.getPointB now returns a Vector2 instead of an untyped object. It also now has an optional argument that allows you to pass a vec2 in to be populated, rather than creating a new one.
* Rectangle.getLineA now returns a Line instead of an untyped object. It also now has an optional argument that allows you to pass a Line in to be populated, rather than creating a new one.
* Rectangle.getLineB now returns a Line instead of an untyped object. It also now has an optional argument that allows you to pass a Line in to be populated, rather than creating a new one.
* Rectangle.getLineC now returns a Line instead of an untyped object. It also now has an optional argument that allows you to pass a Line in to be populated, rather than creating a new one.
* Rectangle.getLineD now returns a Line instead of an untyped object. It also now has an optional argument that allows you to pass a Line in to be populated, rather than creating a new one.
* Triangle.getLineA now returns a Line instead of an untyped object. It also now has an optional argument that allows you to pass a Line in to be populated, rather than creating a new one.
* Triangle.getLineB now returns a Line instead of an untyped object. It also now has an optional argument that allows you to pass a Line in to be populated, rather than creating a new one.
* Triangle.getLineC now returns a Line instead of an untyped object. It also now has an optional argument that allows you to pass a Line in to be populated, rather than creating a new one.
* The GameObject `destroy` event is now emitted at the start of the destroy process, before things like the body or input managers have been removed, so you're able to use the event handler to extract any information you require from the GameObject before it's actually disposed of. Previously, the event was dispatched at the very end of the process.
* Phaser 3 is now built with Webpack v4.1.1 and all related packages have been updated (thanks @orblazer)
* On WebGL the currentScissor is now updated when the renderer `resize` method is called (thanks @jmcriat)
* PathFollower.start has been renamed to `startFollow` to avoid conflicting with the Animation component.
* PathFollower.pause has been renamed to `pauseFollow` to avoid conflicting with the Animation component.
* PathFollower.resume has been renamed to `resumeFollow` to avoid conflicting with the Animation component.
* PathFollower.stop has been renamed to `stopFollow` to avoid conflicting with the Animation component.
* BaseSound.setRate has been renamed to `calculateRate` to avoid confusion over the setting of the sounds rate.

## Version 3.2.1 - 12th March 2018

### Bug Fixes

* Fixed issue with Render Texture tinting. Fix #3336 (thanks @rexrainbow)
* Fixed Utils.String.Format (thanks @samme)
* The Matter Debug Layer wouldn't clear itself in canvas mode. Fix #3345 (thanks @samid737)
* TimerEvent.remove would dispatch the Timer event immediately based on the opposite of the method argument, making it behave the opposite of what was expected. It now only fires when requested (thanks @migiyubi)
* The TileSprite Canvas Renderer did not support rotation, scaling or flipping. Fix #3231 (thanks @TCatshoek)
* Fixed Group doesn't remove children from Scene when cleared with the `removeFromScene` argument set (thanks @iamchristopher)
* Fixed an error in the lights pipeline when no Light Manager has been defined (thanks @samme)
* The ForwardDiffuseLightPipeline now uses `sys.lights` instead of the Scene variable to avoid errors due to injection removal.
* Phaser.Display.Color.Interpolate would return NaN values because it was loading the wrong Linear function. Fix #3372 (thanks @samid737)
* RenderTexture.draw was only drawing the base frame of a Texture. Fix #3374 (thanks @samid737)
* TileSprite scaling differed between WebGL and Canvas. Fix #3338 (thanks @TCatshoek)
* Text.setFixedSize was incorrectly setting the `text` property instead of the `parent` property. Fix #3375 (thanks @rexrainbow)
* RenderTexture.clear on canvas was using the last transform state, instead of clearing the whole texture.

### Updates

* The SceneManager.render will now render a Scene as long as it's in a LOADING state or higher. Before it would only render RUNNING scenes, but this precluded those that were loading assets.
* A Scene can now be restarted by calling `scene.start()` and providing no arguments (thanks @migiyubi)
* The class GameObject has now been exposed, available via `Phaser.GameObjects.GameObject` (thanks @rexrainbow)
* A Camera following a Game Object will now take the zoom factor of the camera into consideration when scrolling. Fix #3353 (thanks @brandonvdongen)
* Calling `setText` on a BitmapText object will now recalculate its display origin values. Fix #3350 (thanks @migiyubi)
* You can now pass an object to Loader.atlas, like you you can with images. Fix #3268 (thanks @TCatshoek)
* The `onContextRestored` callback won't be defined any more unless the WebGL Renderer is in use in the following objects: BitmapMask, Static Tilemap, TileSprite and Text. This should allow those objects to now work in HEADLESS mode. Fix #3368 (thanks @16patsle)
* The SetFrame method now has two optional arguments: `updateSize` and `updateOrigin` (both true by default) which will update the size and origin of the Game Object respectively. Fix #3339 (thanks @Jerenaux)

## Version 3.2.0 - Kaori - 5th March 2018

### New Features

* The new Render Texture Game Object is now available. You can clear, fill and draw texture frames to it. The Render Texture itself can be displayed in-game with its own transform, or you can use it as a Bitmap Mask for another Game Object.
* Game.resize allows you to resize the game config, renderer and input system in one call.
* When Game.resize is called it causes all Scene.Systems to have their resize method called. This is turn emits a `resize` event which your Scene can respond to. It will be sent the new width and height of the canvas as the only two parameters.
* InputManager.resize allows you to update the bounds def and input scale in one call.
* Game.Config.roundPixels property added to prevent sub-pixel interpolation during rendering of Game Objects in WebGL and Canvas.
* Load.plugin now accepts a class as an argument as well as a URL string (thanks @nkholski)
* Tween.complete will allow you to flag a tween as being complete, no matter what stage it is at. If an onComplete callback has been defined it will be invoked. You can set an optional delay before this happens (thanks @Jerenaux for the idea)
* The Headless render mode has been implemented. You can now set HEADLESS as the `renderType` in the Game Config and it will run a special game step that skips rendering. It will still create a Canvas element, as lots of internal systems (like input) rely on it, but it will not draw anything to it. Fix #3256 (thanks @rgk)
* GameObject.setInteractive has a new boolean argument `dropZone` which will allow you to set the object as being a drop zone right from the method.
* Sprites can now be drop zones and have other Game Objects dragged onto them as targets.
* The SceneManager has a new method: `remove` which allows you to remove and destroy a Scene, freeing up the Scene key for use by future scenes and potentially clearing the Scene from active memory for gc.
* SceneManager.moveAbove will move a Scene to be directly above another Scene in the Scenes list. This is also exposed in the ScenePlugin.
* SceneManager.moveBelow will move a Scene to be directly below another Scene in the Scenes list. This is also exposed in the ScenePlugin.
* Quadratic Bezier Interpolation has been added to the Math.Interpolation functions (thanks @RiCoTeRoX)
* A new Quadratic Bezier Curve class has been added, expanding the available Curve types (thanks @RiCoTeRoX)
* Path.quadraticBezierTo allows you to add a Quadratic Bezier Curve into your Path.
* Loader.multiatlas now supports Texture Packers new JSON atlas format which exports one combined atlas for all image files. This is available if you use the new Phaser 3 Export from within Texture Packer (thanks @CodeAndWeb)
* Modified WebGLPipeline to make it easier to extend and easier to create custom rendering passes.

### Bug Fixes

* Arcade Physics Bodies didn't apply the results of `allowRotation` to the parent Game Object.
* InputManager.updateBounds wouldn't correctly get the bounds of the canvas if it had horizontal or vertical translation in the page, causing the scale factor to be off (and subsequently input values to mis-fire)
* TileSprite.setFrame now works and allows you to change the frame to any other in the texture. Fix #3232 (thanks @Jerenaux)
* Swapped the queue loop in the SceneManager to to use `_queue.length` rather than a cached length (thanks @srobertson421)
* When calling `ScenePlugin.launch` the `data` argument is now passed to the queued scenes (thanks @gaudeon)
* Rectangle.top wouldn't reset the `y` position if the value given never exceed the Rectangles bottom. Fix #3290 (thanks @chancezeus)
* The implementation of `topOnly` within the Input Manager had broken the way drop zones worked, as they were now filtered out of the display list before processing. Drop zones are now treated on their own in the Input Plugin meaning you can still have `topOnly` set and still drop an item into a drop zone. This indirectly fixed #3291 (thanks @rexrainbow)
* InputPlugin.clear now properly removes a Game Object from all internal arrays, not just the _list.
* InputPlugin.processOverOut no longer considers an item as being 'out' if it's in the internal `_drag` array.
* When a Game Object is scaled, its Arcade Physics body was still calculating its position based on its original size instead of scaled one (thanks @pixelpicosean)
* The RandomDataGenerator classes randomness has been improved thanks to the correct caching of a class property. Fix #3289 (thanks @migiyubi)
* The RandomDataGenerator `sign` property had a method collision. Fix #3323 (thanks @vinerz and @samme)
* In Arcade Physics World if you collided a group with itself it would call a missing method (`collideGroupVsSelf`), it now calls `collideGroupVsGroup` correctly (thanks @patrickgalbraith)
* The HTML5 Sound Manager would unlock the Sound API on a touch event but only if the audio files were loaded in the first Scene, if they were loaded in a subsequent Scene the audio system would never unlock. It now unlocks only if there are audio files in the cache. Fix #3311 (thanks @chancezeus)
* The Text.lineSpacing value was not taken into account when rendering the Text. Fix #3215 (thanks @sftsk)
* InputPlugin.update now takes the totals from the drag and pointerup events into consideration when deciding to fall through to the Scene below. Fix #3333 (thanks @chancezeus)

### Updates

* AnimationComponent.play now calls `setSizeToFrame()` and `updateDisplayOrigin()` on the parent Game Object in order to catch situations where you've started playing an animation on a Game Object that uses a different size to the previously set frame.
* Text.setText will check if the value given is falsey but not a zero and set to an empty string if so.
* BitmapText.setText will check if the value given is falsey but not a zero and set to an empty string if so.
* BitmapText.setText will now cast the given value to a string before setting.
* BitmapText.setText will not change the text via `setText` unless the new text is different to the old one.
* If you set `transparent` in the Game Config but didn't provide a `backgroundColor` then it would render as black. It will now be properly transparent. If you do provide a color value then it must include an alpha component.
* You can now pass normal Groups to Arcade Physics collide / overlap, as well as Physics Groups. Fix #3277 (thanks @nkholski)
* Texture.get has been optimized to fail first, then error, with a new falsey check. This allows you to skip out specifying animation frames in the animation config without generating a console warning.
* The `setFrame` method of the Texture component has been updated so that it will now automatically reset the `width` and `height` of a Game Object to match that of the new Frame. Related, it will also adjust the display origin values, because they are size based. If the Frame has a custom pivot it will set the origin to match the custom pivot instead.
* ScenePlugin.swapPosition now allows you to use it to swap the positions of any two Scenes. Before the change it only allowed you to swap the position of the calling Scene and another one, but a new optional `keyB` argument opens this up.
* The SceneManager no longer renders a Scene unless it is visible AND either running or paused. This now skips Scenes that are in an `init` state.
* The Keyboard Manager will now no longer emit `keydown` events if you keep holding a key down. Fix #3239 (thanks @squaresun)
* The SceneManager now employs a new queue for all pending Scenes, creating them and booting them in strict sequence. This should prevent errors where Scenes were unable to reference other Scenes further down the boot list in their create functions. Fix #3314 (thanks @max1701 @rblopes)
* Game.preBoot and Game.postBoot callbacks now pass an instance of the game to the callback (thanks @rblopes)
* Graphics.arc in WebGL mode now works more like arc does in Canvas (thanks @Twilrom)
* GameObjects now emit a 'destroy' event when they are destroyed, which you can use to perform any additional processing you require. Fix #3251 (thanks @rexrainbow)
* If an HTML5AudioSound sound fails to play it will now issue a console.warn (thanks @samme)
* Phaser is now running Travis CI build testing again (thanks @vpmedia)
* Documentation updates: thanks to @melissaelopez @samme @jblang94 

## Version 3.1.2 - 23rd February 2018

### Updates

* Hundreds of JSDoc fixes across the whole API.
* Tween.updateTweenData will now check to see if the Tween target still exists before trying to update its properties.
* If you try to use a local data URI in the Loader it now console warns instead of logs (thanks @samme)

### Bug Fixes

* The KeyCode `FORWAD_SLASH` had a typo and has been changed to `FORWARD_SLASH`. Fix #3271 (thanks @josedarioxyz)
* Fixed issue with vertex buffer creation on Static Tilemap Layer, causing tilemap layers to appear black. Fix #3266 (thanks @akleemans)
* Implemented Static Tilemap Layer scaling and Tile alpha support.
* Fixed issue with null texture on Particle Emitter batch generation. This would manifest if you had particles with blend modes on-top of other images not appearing.
* Added missing data parameter to ScenePlugin. Fixes #3810 (thanks @AleBles)

## Version 3.1.1 - 20th February 2018

### Updates

* The entire codebase now passes our eslint config (which helped highlight a few errors), if you're submitting a PR, please ensure your PR passes the config too.
* The Web Audio Context is now suspended instead of closed to allow for prevention of 'Failed to construct AudioContext: maximum number of hardware contexts reached' errors from Chrome in a hot reload environment. We still strongly recommend reusing the same context in a production environment. See [this example](http://labs.phaser.io/view.html?src=src%5Caudio%5CWeb%20Audio%5CReuse%20AudioContext.js) for details. Fixes #3238 (thanks @z0y1 @Ziao)
* The Webpack shell plugin now fires on `onBuildExit`, meaning it'll update the examples if you use `webpack watch` (thanks @rblopes)
* Added `root: true` flag to the eslint config to stop it scanning further-up the filesystem.

### Bug Fixes

* Math.Fuzzy.Floor had an incorrect method signature.
* Arcade Physics World didn't import GetOverlapX or GetOverlapY, causing `separateCircle` to break.
* TileSprite was missing a gl reference, causing it to fail during a context loss and restore.
* The Mesh Game Object Factory entry had incorrect arguments passed to Mesh constructor.
* Removed unused `_queue` property from `ScenePlugin` class (thanks @rblopes)
* The variable `static` is no longer used in Arcade Physics, fixing the 'static is a reserved word' in strict mode error (thanks @samme)
* Fixed `Set.union`, `Set.intersect` and `Set.difference` (thanks @yupaul)
* The corner tints were being applied in the wrong order. Fixes #3252 (thanks @Rybar)
* BitmapText objects would ignore calls to setOrigin. Fixes #3249 (thanks @amkazan)
* Fixed a 1px camera jitter and bleeding issue in the renderer. Fixes #3245 (thanks @bradharms)
* Fixed the error `WebGL: INVALID_ENUM: blendEquation: invalid mode.` that would arise on iOS. Fixes #3244 (thanks @Ziao)
* The `drawBlitter` function would crash if `roundPixels` was true. Fixes #3243 (thanks @Jerenaux and @vulcanoidlogic)

## Version 3.1.0 - Onishi - 16th February 2018

### Updates

* Vertex resource handling code updated, further optimizing the WebGL batching. You should now see less gl ops per frame across all batches.
* The `Blitter` game object has been updated to use the `List` structure instead of `DisplayList`.
* Arcade Physics World `disableBody` has been renamed `disableGameObjectBody` to more accurately reflect what it does.
* Lots of un-used properties were removed from the Arcade Physics Static Body object.
* Arcade Physics Static Body can now refresh itself from its parent via `refreshBody`.

### Bug Fixes

* A couple of accidental uses of `let` existed, which broke Image loading in Safari # (thanks Yat Hin Wong)
* Added the static property `Graphics.TargetCamera` was added back in which fixed `Graphics.generateTexture`.
* The SetHitArea Action now calls `setInteractive`, fixing `Group.createMultiple` when a hitArea has been set.
* Removed rogue Tween emit calls. Fix #3222 (thanks @ZaDarkSide)
* Fixed incorrect call to TweenManager.makeActive. Fix #3219 (thanks @ZaDarkSide)
* The Depth component was missing from the Zone Game Object. Fix #3213 (thanks @Twilrom)
* Fixed issue with `Blitter` overwriting previous objects vertex data.
* The `Tile` game object tinting was fixed, so tiles now honor alpha values correctly.
* The `BitmapMask` would sometimes incorrectly bind its resources.
* Fixed the wrong Extend target in MergeXHRSettings (thanks @samme)

### New Features

* Destroying a Game Object will now call destroy on its physics body, if it has one set.
* Arcade Physics Colliders have a new `name` property and corresponding `setName` method.
* Matter.js bodies now have an inlined destroy method that removes them from the World.
* Impact bodies now remove themselves from the World when destroyed.
* Added Vector2.ZERO static property.
