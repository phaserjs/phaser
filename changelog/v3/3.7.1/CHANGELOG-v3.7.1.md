# Phaser 3 Change Log

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
