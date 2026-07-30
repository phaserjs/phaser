# Phaser 3.60.0 Change Log

Return to the [Change Log index](CHANGELOG-v3.60.md).

## Texture Manager New Features

* `TextureManager.silentWarnings` is a new boolean property that, when set, will prevent the Texture Manager from emiting any warnings or errors to the console in the case of missing texture keys or invalid texture access. The default is to display these warnings, this flag toggles that.
* `TextureManager.parseFrame` is a new method that will return a Texture Frame instance from the given argument, which can be a string, array, object or Texture instance.
* All of the following Texture Manager methods will now allow you to pass in a Phaser Texture as the `source` parameter: `addSpriteSheet`, `addAtlas`, `addAtlasJSONArray`, `addAtlasJSONHash`, `addAtlasXML` and `addAtlasUnity`. This allows you to add sprite sheet or atlas data to existing textures, or textures that came from external sources, such as SVG files, canvas elements or Dynamic Textures.
* `Textures.Events.ADD_KEY` is a new event dispatched by the Texture Manager when a texture with the given key is added, allowing you to listen for the addition of a specific texture (thanks @samme)
* `Textures.Events.REMOVE_KEY` is a new event dispatched by the Texture Manager when a texture with the given key is removed, allowing you to listen for the removal of a specific texture (thanks @samme)

## Texture Manager Updates

* `Texture.has` will now return a strict boolean, rather than an object that can be cooerced into a boolean (thanks @samme)
* The `CanvasTexture.draw` method has a new optional parameter `update` which allows you to control if the internal ImageData is recalculated, or not (thanks @samme)
* The `CanvasTexture.drawFrame` method has a new optional parameter `update` which allows you to control if the internal ImageData is recalculated, or not (thanks @samme)
* The `CanvasTexture.clear` method has a new optional parameter `update` which allows you to control if the internal ImageData is recalculated, or not (thanks @samme)
* The `TextureManager.get` method can now accept a `Frame` instance as its parameter, which will return the frames parent Texture.
* The `GameObject.setFrame` method can now accept a `Frame` instance as its parameter, which will also automatically update the Texture the Game Object is using.
* When you try to use a frame that is missing on the Texture, it will now give the key of the Texture in the console warning (thanks @samme)
* The JSON Hash and Array Texture Parsers will now throw a console.warn if the JSON is invalid and contains identically named frames.
* A Texture `ScaleMode` will now override the Game Config `antialias` setting under the Canvas Renderer, where-as before if `antialias` was `true` then it would ignore the scale mode of the texture (thanks @Cirras)
* The temporary canvas created in `CanvasFeatures` for the `checkInverseAlpha` test is now removed from the CanvasPool after use.
* The `CanvasFeatures` tests and the TextureManager `_tempContext` now specify the `{ willReadFrequently: true }` hint to inform the browser the canvas is to be read from, not composited.
* When calling `TextureManager.getTextureKeys` it will now exclude the default `__WHITE` texture from the results (thanks @samme)
* The `Texture.destroy` method will only destroy sources, dataSources and frames if they exist, protecting against previously destroyed instances.

## Texture Manager Bug Fixes

* The `SpriteSheetFromAtlas` parser was using the incorrect `sourceIndex` to grab frames from a given texture. This caused a crash whenever a trimmed spritesheet was added from any multiatlas image other than the first (thanks @Bambosh)
* The `endFrame` and `startFrame` properties of the `SpriteSheet` parser wouldn't correctly apply themselves, the Texture would still end up with all of the frames. It will now start at the given `startFrame` so that is frame zero and end at `endFrame`, regardless how many other frames are in the sheet.

---------------------------------------

Return to the [Change Log index](CHANGELOG-v3.60.md).

📖 Read the [Phaser 3 API Docs](https://newdocs.phaser.io/) 💻 Browse 2000+ [Code Examples](https://labs.phaser.io) 🤝 Join the awesome [Phaser Discord](https://discord.gg/phaser)
