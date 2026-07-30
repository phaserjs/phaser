# Phaser 3 Change Log

## Version 3.14.0 - Tachikoma - 1st October 2018

### Tilemap New Features, Updates and Fixes

* Both Static and Dynamic Tilemap layers now support rendering multiple tilesets per layer in both Canvas and WebGL. To use multiple tilesets pass in an array of Tileset objects, or strings, to the `createStaticLayer` and `createDynamicLayer` methods respectively.
* `Tilemap.createStaticLayer` now supports passing either a Tileset reference, or a string, or an array of them as the 2nd argument. If strings, the string should be the Tileset name (usually defined in Tiled).
* `Tilemap.createDynamicLayer` now supports passing either a Tileset reference, or a string, or an array of them as the 2nd argument. If strings, the string should be the Tileset name (usually defined in Tiled).
* `Tilemap.createBlankDynamicLayer` now supports passing either a Tileset reference, or a string, or an array of them as the 2nd argument. If strings, the string should be the Tileset name (usually defined in Tiled).
* Static Tilemap Layers now support tile rotation and flipping. Previously this was a feature only for Dynamic Tilemap Layers, but now both have it. Close #4037 (thanks @thisredone)
* `Tilemap.getTileset` is a new method that will return a Tileset based on its name.
* `ParseTilesets` has been rewritten so it will convert the new data structures of Tiled 1.2 into the format expected by Phaser, allowing you to use either Tiled 1.2.x or Tiled 1.1 JSON exports. Fix #3998 (thanks @martin-pabst @halgorithm)
* `Tilemap.setBaseTileSize` now sets the size into the LayerData `baseTileWidth` and `baseTileHeight` properties accordingly. Fix #4057 (thanks @imilo)
* Calling `Tilemap.renderDebug` ignored the layer world position when drawing to the Graphics object. It will now translate to the layer position before drawing. Fix #4061 (thanks @Zax37)
* Calling `Tilemap.renderDebug` ignored the layer scale when drawing to the Graphics object. It will now scale the layer before drawing. Fix #4026 (thanks @JasonHK)
* The Static Tilemap Layer would stop drawing all tiles from that point on, if it encountered a tile which had invalid texture coordinates (such as a tile from another tileset). It now skips invalid tiles properly again. Fix #4002 (thanks @jdotrjs)
* If you used a RenderTexture as a tileset then Dynamic Tilemap Layers would render the tiles inversed on the y-axis in WebGL. Fix #4017 (thanks @s-s)
* If you used a scaled Dynamic Tilemap Layer and rotated or flipped tiles, the tiles that were rotated or flipped would be positioned incorrectly in WebGL. Fix #3778 (thanks @nkholski)
* `StaticTilemapLayer.tileset` is now an array of Tileset objects, where-as before it was a single reference.
* `StaticTilemapLayer.vertexBuffer` is now an array of WebGLBuffer objects, where-as before it was a single instance.
* `StaticTilemapLayer.bufferData` is now an array of ArrayBuffer objects, where-as before it was a single instance.
* `StaticTilemapLayer.vertexViewF32` is now an array of Float3Array objects, where-as before it was a single instance.
* `StaticTilemapLayer.vertexViewU32` is now an array of Uint32Array objects, where-as before it was a single instance.
* `StaticTilemapLayer.dirty` is now an array of booleans, where-as before it was a single boolean.
* `StaticTilemapLayer.vertextCount` is now an array of integers, where-as before it was a single integer.
* `StaticTilemapLayer.updateVBOData()` is a new private method that creates the internal VBO data arrays for the WebGL renderer.
* The `StaticTilemapLayer.upload()` method has a new parameter `tilesetIndex` which controls which tileset to prepare the VBO data for.
* The `StaticTilemapLayer.batchTile()` method has a new parameter `tilesetIndex` which controls which tileset to batch the tile for.
* `StaticTilemapLayer.setTilesets()` is a new private method that creates the internal tileset references array.
* `DynamicTilemapLayer.tileset` is now an array of Tileset objects, where-as before it was a single reference.
* `DynamicTilemapLayer.setTilesets()` is a new private method that creates the internal tileset references array.

### New Features

* `bodyDebugFillColor` is a new Matter Physics debug option that allows you to set a color used when drawing filled bodies to the debug Graphic.
* `debugWireframes` is a new Matter Physics debug option that allows you to control if the wireframes of the bodies are used when drawing to the debug Graphic. The default is `true`. If enabled bodies are not filled.
* `debugShowInternalEdges` is a new Matter Physics debug option that allows you to set if the internal edges of a body are rendered to the debug Graphic.
* `debugShowConvexHulls` is a new Matter Physics debug option that allows you to control if the convex hull of a body is drawn to the debug Graphic. The default is `false`.
* `debugConvexHullColor` is a new Matter Physics debug option that lets you set the color of the convex hull, if being drawn to the debug Graphic.
* `debugShowSleeping` is a new Matter Physics debug option that lets you draw sleeping bodies at 50% opacity.
* `Curves.Ellipse.angle` is a new getter / setter that handles the rotation of the curve in degrees instead of radians.

### Updates

* The Loader has been updated to handle the impact of you destroying the game instance while still processing files. It will no longer throw cache and texture related errors. Fix #4049 (thanks @pantoninho)
* `Polygon.setTo` can now take a string of space separated numbers when creating the polygon data, i.e.: `'40 0 40 20 100 20 100 80 40 80 40 100 0 50'`. This update also impacts the Polygon Shape object, which can now also take this format as well.
* The `poly-decomp` library, as used by Matter.js, has been updated to 0.3.0.
* `Matter.verts`, available via `this.matter.verts` from within a Scene, is a quick way of accessing the Matter Vertices functions.
* You can now specify the vertices for a Matter `fromVerts` body as a string.
* `TextureTintPipeline.batchTexture` has a new optional argument `skipFlip` which allows you to control the internal render texture flip Y check.
* The Device.OS check for `node` will now do a `typeof` first to avoid issues with rollup packaged builds needing to shim the variable out. Fix #4058 (thanks @hollowdoor)
* Arcade Physics Bodies will now sync the display origin of the parent Game Object to the body properties as part of the `updateBounds` call. This means if you change the origin of an AP enabled Game Object, after creation of the body, it will be reflected in the body position. This may or may not be a breaking change for your game. Previously it was expected that the origin should always be 0.5 and you adjust the body using `setOffset`, but this change makes a bit more sense logically. If you find that your bodies are offset after upgrading to this version then this is likely why. Close #4052 (thanks @SolarOmni)
* The `Texture.getFramesFromTextureSource` method has a new boolean argument `includeBase`, which defaults to `false` and allows you to set if the base frame should be returned into the array or not.
* There is a new Animation Event that is dispatched when an animation restarts. Listen for it via `Sprite.on('animationrestart')`.
* All of the Animation Events now pass the Game Object as the final argument, this includes `animationstart`, `animationrestart`, `animationrepeat`, `animationupdate` and `animationcomplete`.
* `Curves.Ellipse.rotation` is a getter / setter that holds the rotation of the curve. Previously it expected the value in degrees and when getting it returned the value in radians. It now expects the value in radians and returns radians to keep it logical.
* `Set.size` will now only set the new size if the value is smaller than the current size, truncating the Set in the process. Values larger than the current size are ignored.
* Arcade Physics `shutdown` will check to see if the world instance still exists and only try removing it if so. This prevents errors when stopping a world and then destroying it at a later date.
* `Text.setFont`, `Text.setFontFamily`, `Text.setFontStyle` and `Text.setStroke` will no longer re-measure the parent Text object if their values have not changed.

### Bug Fixes

* GameObjects added to and removed from Containers no longer listen for the `shutdown` event at all (thanks Vitali)
* Sprites now have `preDestroy` method, which is called automatically by `destroy`. The method destroys the Animation component, unregistering the `remove` event in the process and freeing-up resources. Fix #4051 (thanks @Aveyder)
* `UpdateList.shutdown` wasn't correctly iterating over the pending lists (thanks @felipeprov)
* Input detection was known to be broken when the game resolution was !== 1 and the Camera zoom level was !== 1. Fix #4010 (thanks @s-s)
* The `Shape.Line` object was missing a `lineWidth` property unless you called the `setLineWidth` method, causing the line to not render in Canvas only. Fix #4068 (thanks @netgfx)
* All parts of Matter Body now have the `gameObject` property set correctly. Previously only the first part of the Body did.
* When using `MatterGameObject` and `fromVerts` as the shape type it wouldn't pass the values to `Bodies.fromVertices` because of a previous conditional. It now passes them over correctly and the body is only set if the result is valid.
* The `Texture.getFramesFromTextureSource` method was returning an array of Frame names by mistake, instead of Frame references. It now returns the Frames themselves.
* When using `CanvasTexture.refresh` or `Graphics.generateTexture` it would throw WebGL warnings like 'bindTexture: Attempt to bind a deleted texture'. This was due to the Frames losing sync with the glTexture reference used by their TextureSource. Fix #4050 (thanks @kanthi0802)
* Fixed an error in the `batchSprite` methods in the Canvas and WebGL Renderers that would incorrectly set the frame dimensions on Sprites with the crop component. This was particularly noticeable on Sprites with trimmed animation frames (thanks @sergeod9)
* Fixed a bug where the gl scissor wasn't being reset during a renderer resize, causing it to appear as if the canvas didn't resize properly when `autoResize` was set to `true` in the game config. Fix #4066 (thanks @Quinten @hsan999)
* If a Game instance is destroyed without using the `removeCanvas` argument, it would throw exceptions in the `MouseManager` after the destroy process has run, as the event listeners were not unbound. They're not unbound, regardless of if the parent canvas is removed or not. Fix #4015 (thanks @garethwhittaker)

### Examples and TypeScript

A huge thanks to @presidenten for his work on the Phaser 3 Examples. You'll notice they now have a lovely screen shots for every example and the scripts generate them automatically :)

Also, thanks to the following for helping with the Phaser 3 Examples and TypeScript definitions, either by reporting errors, or even better, fixing them:

@madanus @truncs @samme

### Phaser Doc Jam

The [Phaser Doc Jam](http://docjam.phaser.io) is an on-going effort to ensure that the Phaser 3 API has 100% documentation coverage. Thanks to the monumental effort of myself and the following people we're now really close to that goal! My thanks to:

31826615 - @16patsle - @bobonthenet - @rgk - @samme - @shaneMLK - @wemyss - ajmetal - andiCR - Arian Fornaris - bsparks - Carl - cyantree - DannyT - Elliott Wallace - felixnemis - griga - Hardylr - henriacle - Hsaka - icbat - Kanthi - Kyle - Lee - Nathaniel Foldan - Peter Pedersen - rootasjey - Sam Frantz - SBCGames - snowbillr - Stephen Hamilton - STuFF - TadejZupancic - telinc1

If you'd like to help finish off the last parts of documentation then take a look at the [Doc Jam site](http://docjam.phaser.io).
