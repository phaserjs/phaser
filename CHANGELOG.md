# Change Log

## Version 3.16.0 - Ishikawa - in development

### New Features

### Updates

### Bug Fixes

### Examples and TypeScript

Thanks to the following for helping with the Phaser 3 Examples and TypeScript definitions, either by reporting errors, or even better, fixing them:

@guilhermehto

### Phaser Doc Jam

The [Phaser Doc Jam](http://docjam.phaser.io) is an on-going effort to ensure that the Phaser 3 API has 100% documentation coverage. Thanks to the monumental effort of myself and the following people we're now really close to that goal! My thanks to:

-

If you'd like to help finish off the last parts of documentation then take a look at the [Doc Jam site](http://docjam.phaser.io).

## Version 3.15.1 - Batou - 16th October 2018

* Re-enabled Input Manager resizing, which had been left disabled by mistake.

## Version 3.15.0 - Batou - 16th October 2018

Note: We are releasing this version ahead of schedule in order to make some very important iOS performance and input related fixes available. It does not contain the new Scale Manager or Spine support, both of which have been moved to 3.16 as they require a few more weeks of development.

### New Features

* You can now set the `maxLights` value in the Game Config, which controls the total number of lights the Light2D shader can render in a single pass. The default is 10. Be careful about pushing this too far. More lights = less performance. Close #4081 (thanks @FrancescoNegri)
* `Rectangle.SameDimensions` determines if the two objects (either Rectangles or Rectangle-like) have the same width and height values under strict equality.
* An ArcadePhysics Group can now pass `{ enable: false }`` in its config to disable all the member bodies (thanks @samme)
* `Body.setEnable` is a new chainable method that allows you to toggle the enable state of an Arcade Physics Body (thanks @samme)
* `KeyboardPlugin.resetKeys` is a new method that will reset the state of any Key object created by a Scene's Keyboard Plugin.
* `Pointer.wasCanceled` is a new boolean property that allows you to tell if a Pointer was cleared due to a `touchcancel` event. This flag is reset during the next `touchstart` event for the Pointer.
* `Pointer.touchcancel` is a new internal method specifically for handling touch cancel events. It has the same result as `touchend` without setting any of the up properties, to avoid triggering up event handlers. It will also set the `wasCanceled` property to `true`.

### Updates

* `WebGLRenderer.deleteTexture` will check to see if the texture it is being asked to delete is the currently bound texture or not. If it is, it'll set the blank texture to be bound after deletion. This should stop `RENDER WARNING: there is no texture bound to the unit 0` errors if you destroy a Game Object, such as Text or TileSprite, from an async or timed process (thanks jamespierce)
* The `RequestAnimationFrame.step` and `stepTimeout` functions have been updated so that the new Frame is requested from raf before the main game step is called. This allows you to now stop the raf callback from within the game update or render loop. Fix #3952 (thanks @tolimeh)
* If you pass zero as the width or height when creating a TileSprite it will now use the dimensions of the texture frame as the size of the TileSprite. Fix #4073 (thanks @jcyuan)
* `TileSprite.setFrame` has had both the `updateSize` and `updateOrigin` arguments removed as they didn't do anything for TileSprites and were misleading.
* `CameraManager.remove` has a new argument `runDestroy` which, if set, will automatically call `Camera.destroy` on the Cameras removed from the Camera Manager. You should nearly always allow this to happen (thanks jamespierce)
* Device.OS has been restructured to allow fake UAs from Chrome dev tools to register iOS devices.
* Texture batching during the batch flush has been implemented in the TextureTintPipeline which resolves the issues of very low frame rates, especially on iOS devices, when using non-batched textures such as those used by Text or TileSprites. Fix #4110 #4086 (thanks @ivanpopelyshev @sachinhosmani   @maximtsai @alexeymolchan)
* The WebGLRenderer method `canvasToTexture` has a new optional argument `noRepeat` which will stop it from using `gl.REPEAT` entirely. This is now used by the Text object to avoid it potentially switching between a REPEAT and CLAMP texture, causing texture black-outs (thanks @ivanpopelyshev)
* `KeyboardPlugin.resetKeys` is now called automatically as part of the Keyboard Plugin `shutdown` method. This means, when the plugin shuts down, such as when stopping a Scene, it will reset the state of any key held in the plugin. It will also clear the queue of any pending events.
* The `Touch Manager` has been rewritten to use declared functions for all touch event handlers, rather than bound functions. This means they will now clear properly when the TouchManager is shut down.
* There is a new Input constant `TOUCH_CANCEL` which represents canceled touch events.

### Bug Fixes

* Fixed a bug in the canvas rendering of both the Static and Dynamic Tilemap Layers where the camera matrix was being multiplied twice with the layer, causing the scale and placement to be off (thanks galerijanamar)
* If you set `pixelArt` to true in your game config (or `antialias` to false) then TileSprites will now respect this when using the Canvas Renderer and disable smoothing on the internal fill canvas.
* TileSprites that were set to be interactive before they had rendered once wouldn't receive a valid input hit area, causing input to fail. They now define their size immediately, allowing them to be made interactive without having rendered. Fix #4085 (thanks @DotTheGreat)
* The Particle Emitter Manager has been given a NOOP method called `setBlendMode` to stop warnings from being thrown if you added an emitter to a Container in the Canvas renderer. Fix #4083 (thanks @maximtsai)
* The `game.context` property would be incorrectly set to `null` after the WebGLRenderer instance was created (thanks @samme)
* The Touch Manager, Input Manager and Pointer classes all now handle the `touchcancel` event, such as triggered on iOS when activating an out of browser UI gesture, or in Facebook Instant Games when displaying an overlay ad. This should prevent issues with touch input becoming locked on iOS specifically. Fix #3756 (thanks @sftsk @sachinhosmani @kooappsdevs)

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

## Version 3.13.0 - Yuuki - 20th September 2018

### Facebook Instant Games Plugin

Phaser 3.13 introduces the new Facebook Instant Games Plugin. The plugin provides a seamless bridge between Phaser and version 6.2 of the Facebook Instant Games SDK. Every single SDK function is available via the plugin and we will keep track of the official SDK to make sure they stay in sync.

The plugin offers the following features:

* Easy integration with the Phaser Loader so load events update the Facebook progress circle.
* Events for every plugin method, allowing the async calls of the SDK to be correctly inserted into the Phaser game flow. When SDK calls resolve they will surface naturally as a Phaser event and you'll know you can safely act upon them without potentially doing something mid-way through the game step.
* All Plugin methods check if the call is part of the supported APIs available in the SDK, without needing to launch an async request first.
* Instant access to platform, player and locale data.
* Easily load player photos directly into the Texture Manager, ready for use with a Game Object.
* Subscribe to game bots.
* The plugin has a built-in Data Manager which makes dealing with data stored on Facebook seamless. Just create whatever data properties you need and they are automatically synced.
* Support for FB stats, to retrieve, store and increment stats into cloud storage.
* Save Session data with built-in session length validation.
* Easy context switching, to swap between game instances and session data retrieval.
* Easily open a Facebook share, invite, request or game challenge window and populate the text and image content using any image stored in the Texture cache.
* Full Leaderboard support. Retrieve, scan and update leaderboard entries, as well as player matching.
* Support for in-app purchases, with product catalogs, the ability to handle purchases, get past purchases and consume previously unlocked purchases.
* Easily preload a set of interstitial ads, in both banner and video form, then display the ad at any point in your game, with in-built tracking of ads displayed and inventory available.
* Plus other features, such as logging to FB Analytics, creating short cuts, switching games, etc.

The plugin is fully documented and official tutorials and project templates will follow shortly.

### New Shape Game Objects

Phaser 3.13 has a new Game Object called `Shape`, which by itself isn't much use because it's a base class. However, extending that class are 11 different types of Shape (with more to come) and you can use it to create your own custom Shapes as well. Shapes are added to the display list in the exact same way as any other Game Object. For example:

```
this.add.rectangle(400, 300, 500, 120, 0x00ff00);
```

Here we're creating a new Rectangle shape. It's positioned at 400 x 300 in the Scene and has a size of 500 x 120 pixels. The final value is the fill color.

The thing to remember is that you can treat this Shape just like you'd treat any other Game Object. You can scale it, rotate it, alpha it, blend mode it, change its origin, give it a Camera scroll factor, put it inside a Container or Group, give it input abilities or even give it a physics body. It is, to all intents and purposes, a normal Game Object. The only difference is that when rendering it uses its own special bit of display code.

The shapes available are as follows:

* `GameObject.Arc` - The arc allows you to draw either a circle, or part of a circle. You can set the start and end angle, if the rotation is clockwise or not, and even set the number of iterations the arc will use during rendering.
* `GameObject.Curve` - The Curve Shape can take any Phaser Curve object, such as a Spline or Bezier Curve, and add it to the display list.
* `GameObject.Ellipse` - An ellipse shape, which is essentially a circle with a differing width and height. It can be filled or stroked (or both!) and as with the arc you can set the 'smoothness' of it, allowing you to decrease the number of points used when creating its polygon data.
* `GameObject.Grid` - The Grid Shape object allows you to generate them. You can set the width and height of the grid itself, as well as for the grid cells. The grid can either have a single color, or alternating cell colors and even have outline spacing between the cells, or not.
* `GameObject.Line` - Create a Line Shape drawn between any two points, with a color and thickness. In WebGL you can also specify a different thickness for the start and end of the line.
* `GameObject.Polygon` - A Polygon is effectively a list of points that is drawn between. The points can be provided in a number of different ways (as Vec2 objects, as an array, etc) and then you can either fill or stroke the resulting shape, or both.
* `GameObject.Rectangle` - Simple, but powerful and endlessly useful. Set a width and height and it'll display a Rectangle, with control over the size, fill color and stroke color.
* `GameObject.Star` - The Star shape does as its name suggests: it displays a star. You can control the number of points in the star as well as the inner and outer radius of it.
* `GameObject.Triangle` - A Triangular shape with full control over the points used to make it and its fill and stroke colors. Internally it uses the `batchFillTriangle` method in WebGL, making it actually faster to draw than a Quad! Use them happily for bullets or abstract space ships, or anything else you feel like.
* `GameObject.IsoTriangle` - This draws an isometric triangle, like a pyramid. You can control the colors of each face, if the pyramid is upside down or not and the width and height of it.
* `GameObject.IsoBox` - This draws an isometric box. You can set the colors for each face of the box, as well as the projection angle and also which of the 3 faces are drawn.

All of the Shape objects render in both Canvas and WebGL and are available via the Game Object Factory.

### Pointer and Input Event Updates

The specificity if the input events has been changed to allow you more control over event handling. Previously, the InputPlugin would emit the global `pointerdown` event first, and then the Game Object itself would emit the `pointerdown` event and finally the InputPlugin would emit the `gameobjectdown` event.

The order has now changed. The Game Object will dispatch its `pointerdown` event first. The InputPlugin will then dispatch `gameobjectdown` and finally the less specific of them all, `pointerdown` will be dispatched.

New in 3.13 is the ability to cancel this at any stage. All events are now sent an event object which you can call `event.stopPropagation()` on. This will immediately stop any further listeners from being invoked. If you call `stopPropagation()` after the first Game Object `pointerdown` event, then no more Game Object's will receive their callbacks and the InputPlugin will not dispatch either of its events.

This change has been introduced for `pointerdown`, `pointerup`, `pointermove`, `pointerover` and `pointerout`. No other data is included in the `event` object in this release.

* The Game Object `pointerdown` callback signature has changed. It used to send `pointer, x, y, camera` to the listener. It now sends `pointer, x, y, event` to the listener. If you still need the `camera` property you can get it from `pointer.camera`.
* The Game Object `gameobjectdown` callback signature has a new argument. It now sends `event` as the 3rd argument.
* The `pointerdown` event, as dispatched by the InputPlugin, is now sent _after_ the Game Object specific events (`GameObject.pointerdown` and `gameobjectdown`). This gives you the chance to cancel the event before the global listener receives it.
* The Game Object `pointerup` callback signature has a new argument. It now sends the `event` as the 4th argument.
* The Game Object `gameobjectup` callback signature has a new argument. It now sends `event` as the 3rd argument.
* The `pointerup` event, as dispatched by the InputPlugin, is now sent _after_ the Game Object specific events (`GameObject.pointerup` and `gameobjectup`). This gives you the chance to cancel the event before the global listener receives it.
* The Game Object `pointermove` callback signature has a new argument. It now sends the `event` as the 4th argument.
* The Game Object `gameobjectmove` callback signature has a new argument. It now sends `event` as the 3rd argument.
* The `pointermove` event, as dispatched by the InputPlugin, is now sent _after_ the Game Object specific events (`GameObject.pointermove` and `gameobjectmove`). This gives you the chance to cancel the event before the global listener receives it.
* The Game Object `pointerover` callback signature has a new argument. It now sends the `event` as the 4th argument.
* The Game Object `gameobjectover` callback signature has a new argument. It now sends `event` as the 3rd argument.
* The `pointerover` event, as dispatched by the InputPlugin, is now sent _after_ the Game Object specific events (`GameObject.pointerover` and `gameobjectover`). This gives you the chance to cancel the event before the global listener receives it.
* The Game Object `pointerout` callback signature has a new argument. It now sends the `event` as the 2nd argument.
* The Game Object `gameobjectout` callback signature has a new argument. It now sends `event` as the 3rd argument.
* The `pointerout` event, as dispatched by the InputPlugin, is now sent _after_ the Game Object specific events (`GameObject.pointerout` and `gameobjectout`). This gives you the chance to cancel the event before the global listener receives it.

### Game Object List Updates

When Sprite's are created they are added to two lists within the Scene - the Display List and the Update List. Under 3.12 when a Scene was shut down it would emit a `shutdown` event, which Sprites listened out for. When they received it, they would destroy themselves.

After [profiling and testing](https://github.com/photonstorm/phaser/issues/4028) this process has changed slightly. Game Object's no longer listen for the Scene `shutdown` event. Instead, the Display List and Update List will iterate their children and call `destroy` on them in turn. If being destroyed by a Scene in this way, the child will skip several expensive operations in its destroy function. More importantly, in busy Scenes you no longer need thousands of event listeners registered. The result is that changing Scene is now up to 100% faster than before. You need not change your code to benefit from this, however, if you were relying on custom Game Objects listening for the Scene `shutdown` event natively, then this is no longer the case and you'll have to manually add that listener to your classes.

* The UpdateList will now clear out its internal `_list`, `_pendingRemoval` and `_pendingInsertion` lists on shutdown. Before, it would only clear `_list`.
* `GameObject.destroy` has a new optional boolean argument `fromScene`, which controls how the destroy process flows.

### Camera Render to Texture

In 3.12 a new Camera method called `setRenderToTexture` was introduced. However, it had known issues so was placed under the experimental flag and you were advised not to use it unless in testing.

Thanks to several fixes in this release the experimental flag has been dropped and it's now safe to try using this new feature in production.

The method sets the Camera to render to a texture instead of to the main canvas. The Camera will redirect all Game Objects it's asked to render to this texture. During the render sequence, the texture itself will then be rendered to the main canvas.

Doing this gives you the ability to modify the texture before this happens, allowing for special effects such as Camera specific shaders, or post-processing on the texture.

* `Camera.setRenderToTexture` is a new method that enables the Camera to render to a target texture instead of the main canvas, allowing for application of special effects at run-time.
* `Camera.clearRenderToTexture` is a new method that stops a Camera from rendering to a texture and frees-up all associated resources.
* `Camera.setPipeline` allows you to change the WebGL pipeline being used if the Camera is rendering to a texture, effectively swapping the active shader. Call with no arguments to clear the pipeline.
* `Camera.renderToTexture` is a boolean property that controls where the Camera renders. It can be toggled on the fly.
* `Camera.canvas` is a Canvas Element that the Camera will render to if running under the Canvas Renderer and rendering to a texture.
* `Camera.context` is a Rendering Context that the Camera will render to if running under the Canvas Renderer and rendering to a texture.
* `Camera.glTexture` is a WebGL Texture that the Camera will render to if running under the WebGL Renderer and rendering to a texture.
* `Camera.framebuffer` is a WebGL Frame Buffer that the Camera will render to if running under the WebGL Renderer and rendering to a texture.
* `Camera.pipeline` is the Pipeline that the Camera will render with if running under the WebGL Renderer and rendering to a texture with a pipeline set.
* If you set a Camera to render to a texture then it will emit 2 events during the render loop. First, it will emit the event `prerender`. This happens right before any Game Object's are drawn to the Camera texture. Then, it will emit the event `postrender`. This happens after all Game Object's have been drawn, but right before the Camera texture is rendered to the main game canvas. It's the final point at which you can manipulate the texture before it appears in-game.

### New Features

* The `Color` object has a new property `h` which represents the hue of the color. You can tween or adjust this property in real-time and it will automatically update the internal RGB values with it.
* The `Color` object has a new property `s` which represents the saturation of the color. You can tween or adjust this property in real-time and it will automatically update the internal RGB values with it.
* The `Color` object has a new property `v` which represents the lightness value of the color. You can tween or adjust this property in real-time and it will automatically update the internal RGB values with it.
* `Color.setFromHSV` is a new method that will set the color values based on the HSV values given.
* `Color.gray` is a new method that will set the color to be a shade of gray based on the amount given.
* `Color.random` is a new method that will set the color to be a random hue based on the min and max values given.
* `Color.randomGray` is a new method that will set the color to be a random grayscale based on the min and max values given.
* `Color.saturate` is a new method that will saturate the color based on the amount given. This is a chainable version of adjusting the saturation property directly.
* `Color.desaturate` is a new method that will desaturate the color based on the amount given. This is a chainable version of adjusting the saturation property directly.
* `Color.lighten` is a new method that will lighten the color based on the amount given. This is a chainable version of adjusting the value property directly.
* `Color.darken` is a new method that will darken the color based on the amount given. This is a chainable version of adjusting the value property directly.
* `Color.brighten` is a new method that will brighten the color based on the amount given.
* The `CanvasTexture` class has a new property `imageData` which contains the ImageData of the texture.
* The `CanvasTexture` class has a new property `data` which is a Uint8ClampedArray view into the `buffer`.
* The `CanvasTexture` class has a new property `pixels` which is a Uint32Array view into the `buffer`.
* The `CanvasTexture` class has a new property `buffer` which is an ArrayBuffer the same size as the context ImageData.
* The `CanvasTexture` class has a new method `update` which refreshes the ImageData and ArrayBuffer based on the texture contents.
* The `CanvasTexture` class has a new method `draw` which draws the given Image or Canvas element to the CanvasTexture, then updates the internal ImageData buffer and arrays.
* The `CanvasTexture` class has a new method `getPixel` which will get the color of a specific pixel from the Canvas Texture and store it in the returned Color object. It uses the ArrayBuffer to do this, which is extremely fast, allowing for quick iteration across the canvas data.
* The WebGLPipeline and WebGLRenderer have new a method `setFloat1v` which allows you to set a `uniform1fv` uniform value (thanks @Mattykins)
* The WebGLPipeline and WebGLRenderer have new a method `setFloat2v` which allows you to set a `uniform2fv` uniform value (thanks @Mattykins)
* The WebGLPipeline and WebGLRenderer have new a method `setFloat3v` which allows you to set a `uniform3fv` uniform value (thanks @Mattykins)
* The WebGLPipeline and WebGLRenderer have new a method `setFloat4v` which allows you to set a `uniform4fv` uniform value (thanks @Mattykins)
* `Text.setLineSpacing` is a new method that allows you to easily set the line spacing value of a Text object in a chainable call (thanks @RafelSanso)

### Updates

* The Graphics Canvas Renderer will now automatically call `beginPath` on the target context before processing the command stack. This has the effect of clearing off any sub-paths that may have persisted on the stack from previous Graphics objects or frames. This makes it more in-line with WebGL re: expectations when calling `Graphics.clear`.
* `initPipeline` now defaults to the Texture Tint Pipeline if nothing else is specified. This allowed me to remove explicit strings from 11 different Game Objects, saving some bytes in the process.
* The `RGBToHSV` function can now take an optional `out` argument, which is either a `HSVColorObject` or a `Color` object, and the results will be set into that object instead of creating a new one.
* The `HSVToRGB` function can now take an optional `out` argument, which is either a `HSVColorObject` or a `Color` object, and the results will be set into that object instead of creating a new one.
* `Color.setTo` has a new argument `updateHSV` which allows you to control if the internal HSV values are updated during the same call or not.
* The `Text._lineSpacing` property has been renamed to `lineSpacing` and made public, not private. You still set it in the same way, by passing a `lineSpacing` property to the Text configuration object, but internally it's now clearer.
* If a Scene is already active (i.e. running) and you call `start` on it (such as from another Scene) then it will shutdown the Scene first, before starting it again.

### Bug Fixes

* TileSprite.setTileScale would set the tile position by mistake, instead of the scale. Using the properties directly worked, but the method was incorrect (thanks @alexeymolchan)
* Calling `Text.setStyle` would make the Text vanish if you didn't provide a `resolution` property in the style configuration object. Calling `setStyle` now only changes the properties given in the object, leaving any previously changed properties as-is. Fix #4011 (thanks @okcompewter)
* In Matter.js if a body had its debug `render.visible` property set to `false` it wouldn't then render any other debug body beyond it. Now it will just skip bodies with hidden debug graphics (thanks @jf908)
* If you flagged a Tween as `paused` in its config, never started it, and then called `Tween.stop` it wouldn't ever be removed from the `_pending` array. It's now moved to the Tween Manager's destroy list, ready for removal on the next frame. Fix #4023 (thanks @goldfire)
* Game Objects would not remove themselves from the Scene's `shutdown` event handler when destroyed, leading to a build-up over time (thanks @goldfire)
* The WebGL Renderer will no longer try and just resize a canvas backed texture, instead it will properly delete it then re-create it. Fix #4016 (thanks @alexeymolchan)
* The Camera background for mini-Cameras (those positioned deep inside another Camera) would be offset incorrectly in WebGL, causing the background fills to be displaced (thanks @aaronfc)
* The WebGL Renderer now always enables the `SCISSOR_TEST`, this allows Game Objects that use the scissor (such as custom objects, or Bitmap Text) to render properly again.
* The Cameras `setScene` method, which is called automatically when a new Camera is created, will now call `updateSystem` which correctly increases the custom viewport counter. This fixes an issue with mini-cams inside of larger cameras not clipping their contents properly. If a Camera is moved to another Scene it also now correctly shrinks the total custom viewport counter.
* Due to the two fixes above another bug was fixed: The ability for you to swap between Cameras with and without `setRenderToTexture` enabled with custom shaders. Previously if you used this with a custom shader then only the first Camera using the shader would render, the rest would appear black. Now, all Cameras using the custom shader work correctly. As a result all of the 'experimental' Camera rendering properties from 3.12 have been moved to stable.
* If you destroyed a Game Object that had a custom cursor set during one of its input events the cursor didn't correctly reset. Fix #4033 (thanks @pantoninho)
* `RenderTexture.resize` wouldn't correctly resize the texture under WebGL. Fix #4034 (thanks @jbpuryear)
* Calling `setFrame` on a TileSprite wouldn't change the frame, it would just change the frame size. Fix #4039 (thanks @Jerenaux)
* `Zone.setRectangleDropZone` used the wrong `x` and `y` coordinates for the hit area, causing it to be offset from the zone itself after the changes made for issue #3865 in the 3.12 release.

### Examples, Documentation and TypeScript

My thanks to the following for helping with the Phaser 3 Examples, Docs and TypeScript definitions, either by reporting errors, fixing them or helping author the docs:

@johanlindfors @Arthur3DLHC @JamesSkemp

## Version 3.12.0 - Silica - 4th September 2018

### FlatTintPipeline Updates

In 3.11 I overhauled the TextureTintPipeline, the WebGL batch used to render all texture based Game Objects, such as Sprites. In this release I did the same to the FlatTintPipeline. This pipeline was used exclusively by the Graphics Game Object to draw filled and stroked primitives in WebGL. It was also used by classes such as the Camera in order to draw their colored backgrounds and flash / fade effects.

When I looked closely at the shaders being used by the texture and graphics pipelines I noticed they were virtually identical. Yet if you were to mix Graphics objects and Sprites in your game, it would cause a complete batch flush as it switched between the them as it rebound the shaders, adding to both the draw calls and gl ops per frame.

The more I looked through the graphics pipeline, the more I saw the same kind of things the texture one previously had: duplicate vars, in-line matrix operations and so on. So I worked through the process of refactoring it, boiling it down to just a handful of core methods and re-using methods the texture pipeline already had. The end result is that I've been able to remove the FlatTintPipeline entirely. This saves 42.3KB (unminifed) and removes 1000 lines of code from the build. Of course, lots of the methods were added to the texture pipeline, but that only increased from 730 sloc to 1087 sloc, a fraction of the amount before! And the benefits don't end there.

If you had any custom pipelines that extended the FlatTintPipeline please update them to extend the TextureTintPipeline instead. You'll likely need to remap a few methods, but most of them remain the same. Double-check the method signatures though.

The same pipeline can now draw both graphics and sprites, with the same shader and no texture swapping either. This means you can happily mix Graphics objects alongside Sprites and it won't cost any extra overhead at all. There are more benefits too, which are outlined in the list below.

* The TextureTintPipeline now has 100% jsdoc coverage.
* The removal of the FlatTintPipeline shaves 42.3KB and 1000 sloc from the bundle size.
* The Graphics fill and line styles are now cached in the pipeline, rather than being re-calculated for every primitive drawn.
* The new `batchTri` method will add a triangle to the vertex batch, either textured or filled.
* `drawFillRect` is a new method that will add an untransformed rectangle to the batch. These are used by things like Cameras to fill in background colors.
* `batchFillRect` has been moved to the TextureTintPipeline and has a new much more concise method signature.
* `batchFillTriangle` has been moved to the TextureTintPipeline and has a new much more concise method signature.
* `batchFillPath` has been moved to the TextureTintPipeline and has a new much more concise method signature.
* `batchLine` has been moved to the TextureTintPipeline.
* When drawing Graphics paths with a line width of 1 it will no longer spend any time drawing the line joins, speeding-up the rendering of 1px lines.

### WebGL Scissor Update

The process of managing scissors in the WebGLRenderer has been completely rewritten. Previously, the gl scissor was being constantly enabled and disabled for every Camera in your game, leading to pointless gl operations.

* Cameras have a new internal method `updateSystem` which is automatically called if you change any Camera viewport values. This in turn tells the Scene Manager if there are any cameras with custom viewports, in any Scene of your game. If there are not then the scissor is never even enabled or set, meaning zero gl ops! If your game uses full sized Cameras it now doesn't cost anything at all with regard to scissoring.
* If a new scissor is set it will now check to see if it's the same size and position as the current scissor, and if so, it'll skip setting it at all.

### Render Texture New Features and Updates

The Render Texture class has been rewritten from scratch and all Game Objects have been updated to support it. Previously it was very restricted in what you could do with it. It used to have a matrix stack for internal transforms, but this has been replaced with a Camera instead. This means you have the full power of a Camera system (scrolling, zooming, rotation) but it only impacts the contents of the Render Texture.

* The biggest update is the change in what the `draw` method can accept. Previously you had to pass in a texture and frame reference. This has changed, as has the method signature. It can now accept any of the following:

    - Any renderable Game Object, such as a Sprite, Text, Graphics or TileSprite.
    - Dynamic and Static Tilemap Layers.
    - A Group. The contents of which will be iterated and drawn in turn.
    - A Container. The contents of which will be iterated fully, and drawn in turn.
    - A Scene. Pass in `Scene.children` to draw the whole display list.
    - Another Render Texture.
    - A Texture Frame instance.
    - A string. This is used to look-up a texture from the Texture Manager.

* There is a new method `drawFrame` which allows you to pass in a string-based texture and frame key and have it drawn to the Render Texture.
* The new method `saveTexture` allows you to save the Render Texture into the Texture Manager using your own key. You can then use the Render Texture for any Game Object that accepts textures as a source, such as Sprites or even Tilemap Layers. You can add frame data to a Render Texture using the `RenderTexture.texture.add` method.
* The new `camera` property is an instance of a complete 2D Camera. You can use it to change the view into your Render Texture. Scroll, rotate, zoom, just like you would with a normal Camera, except it will only influence the objects being drawn to the Render Texture.
* All of the matrix-style methods have been removed: `save`, `translate`, `restore`, `scale`, `rotate`. You can now achieve the same thing by either transforming the object you want to draw to the Render Texture, or using the built-in Camera.
* You can now crop a Render Texture. Use the `setCrop` method to define the crop region.

See the fully complete documentation for more details and the extensive examples and tests created.

### Text Game Object New Features and Updates

The Text Game Object has been given an internal overhaul to make it more flexible. Some properties have been renamed or moved and new features added:

* Text can now be cropped in WebGL and Canvas! Use the `setCrop` method to crop the text.
* Text now keeps a reference to the renderer in the `renderer` property.
* The `canvasTexture` property has been removed.
* Text now has internal `texture` and `frame` properties. These replace the old `canvasTexture` but perform the same task, while allowing for texture cropping and much smaller renderer code.
* Previously, changing a Text object by setting its `text` property directly wouldn't change the text being rendered as using `setText` was the expected way to change what was being displayed. Internally the `text` property has been renamed to `_text` and flagged as private, and a new getter / setter for `text` has been added, which hands over to the `setText` method, meaning you can now use both ways of setting the text. Fix #3919 (thanks @hackhat @samid737)

### Tile Sprite Object New Features and Updates

The Tile Sprite Game Object has been given an internal overhaul to make it more flexible. Some properties have been renamed or moved and new features added:

* Tile Sprites can now be cropped in WebGL and Canvas! Use the `setCrop` method to crop the tile sprite.
* There is a new method `setTileScale` which will set the tile scale in a chainable call.
* There is a new internal `canvas` property. Tile Sprites work differently than before in Canvas mode: Previously they would use the `fillRect` command on the game canvas to draw themselves every frame, even if they hadn't changed. They now draw to an internal canvas only when their position or scale changes. This canvas is then drawn to the game canvas instead. It's faster, as it doesn't fillRect every frame and also allows you to draw them to other contexts, such as Render Textures.
* There are two new internal properties `_tilePosition` and `_tileScale` which are Vector 2s that hold the position and scale. Getters have been added, so use the same properties as before in your code.
* There are two new properties `displayTexture` and `displayFrame`. These replace the previous `texture` and `frame` properties and hold references to the source texture the Tile Sprite is using.
* The `canvasPattern` property has been renamed to `fillPattern`.
* The `oldFrame` property has been removed.
* The `canvasBuffer` property has been renamed to `fillCanvas`.
* The `canvasBufferCtx` property has been renamed to `fillContext`.

### Tilemap New Features and Updates

The Tilemap and Dynamic and Static Tilemap Layer classes now all support 4 different modes of render order for drawing the tiles. This allows you to control the z-order of the tiles during render. This feature was requested by @etienne (who provided the test maps too) - see the new examples in the Labs for better understand the impact this has.

The default is 'right-down', meaning it will order the tiles starting from the top-left, drawing to the right and then moving down to the next row.

The four draw orders are:

0 = right-down
1 = left-down
2 = right-up
3 = left-up

* Tilemap has a new property `renderOrder` which is a string based version of the render order, as used when new layers are created via the map. If the map is created from Tiled JSON data, it will use whatever render order has been specified in the map data.
* Tilemap has a new method `setRenderOrder`. This takes either an integer or a string-based version of the render order and stores it locally. It's then used during the creation of any layers from that point on.
* The DynamicTilemapLayer has a new method `setRenderOrder`. This takes either an integer or a string-based version of the render order and stores it locally. It's then used during rendering of the layer. You can change the value on the fly.
* The StaticTilemapLayer has a new method `setRenderOrder`. This takes either an integer or a string-based version of the render order and stores it locally. Under WebGL it will re-create the whole vertex buffer, using the new draw order. Under Canvas it uses it at run-time during rendering. You can change it on the fly.
* ParseJSONTiled now extracts the `renderorder` property from the Tiled JSON.
* MapData has a new `renderOrder` property, which is populated by the Tiled Parser.

### Matter.js Updates

The version of Matter.js used by Phaser has been updated from 0.13.1 to 0.14.2. To clarify why we don't include Matter via npm, it's because we use a customized version of Matter that includes extra features and optimizations not yet found in the official library.

Most of the updates were about documentation and module namespacing, however those relevant to Phaser are listed below. You can also view the full [Matter Change Log](https://github.com/liabru/matter-js/blob/master/CHANGELOG.md).

* fix Composite.bounds global issue, closes #627, closes #544 ([f7f77b4](https://github.com/liabru/matter-js/commit/f7f77b4)), closes [#627](https://github.com/liabru/matter-js/issues/627) [#544](https://github.com/liabru/matter-js/issues/544)
* updated pathseg library, closes #548, closes #602, closes #424 ([1e5758f](https://github.com/liabru/matter-js/commit/1e5758f)), closes [#548](https://github.com/liabru/matter-js/issues/548) [#602](https://github.com/liabru/matter-js/issues/602) [#424](https://github.com/liabru/matter-js/issues/424)
* fix Common.isElement on node, closes #535 ([ec38eeb](https://github.com/liabru/matter-js/commit/ec38eeb)), closes [#535](https://github.com/liabru/matter-js/issues/535)
* added Query.collides, closes #478 ([6593a72](https://github.com/liabru/matter-js/commit/6593a72)), closes [#478](https://github.com/liabru/matter-js/issues/478)
* fix `point` argument of Body.scale, closes #428 ([894c1ef](https://github.com/liabru/matter-js/commit/894c1ef)), closes [#428](https://github.com/liabru/matter-js/issues/428)
* fix Body.scale for compound bodies ([50a89d0](https://github.com/liabru/matter-js/commit/50a89d0))
* fix centroid for static compound bodies, closes #483 ([ece66e6](https://github.com/liabru/matter-js/commit/ece66e6)), closes [#483](https://github.com/liabru/matter-js/issues/483)
* fix Common.isElement, closes #501, closes #507, closes #459, closes #468, closes #517 ([18a0845](https://github.com/liabru/matter-js/commit/18a0845)), closes [#501](https://github.com/liabru/matter-js/issues/501) [#507](https://github.com/liabru/matter-js/issues/507) [#459](https://github.com/liabru/matter-js/issues/459) [#468](https://github.com/liabru/matter-js/issues/468) [#517](https://github.com/liabru/matter-js/issues/517)
* fix inertia change in Body.setMass, closes #378 ([f7d1877](https://github.com/liabru/matter-js/commit/f7d1877)), closes [#378](https://github.com/liabru/matter-js/issues/378)
* fix Vertices.chamfer radius argument, closes #467 ([3bceef4](https://github.com/liabru/matter-js/commit/3bceef4)), closes [#467](https://github.com/liabru/matter-js/issues/467)

### Camera 3D Plugin

Support for Camera 3D and Sprite 3D Game Objects have been removed from the core Phaser bundle and moved to an optional plugin.

You can find the source for Camera 3D in the new `plugins/camera3d` folder, along with a README file explaining how to now use the plugin in your games.

* When a Sprite3D object is added to a Camera via `Camera.add` it is now added to the Display and Update Lists. Fix #3945 (thanks @vvega)

### New Features

* `Camera.resolution` is a new read-only property that holds the current game config resolution that the camera is using. This is used internally for viewport calculations.
* `Text.resolution` and the method `Text.setResolution` allows you to control the resolution of a Static Text Game Object. By default it will be set to match the resolution set in the Game Config, but you can override it yourself via the TextStyle. It allows for much clearer text on High DPI devices, at the cost of larger internal Canvas textures for the Text - so please use with caution, as the more high res Text you have, the more memory it uses up. Fix #3528 (thanks @kirillbunin)
* `TransformMatrix.getCSSMatrix` will return a CSS transform matrix formatted string from the current matrix values.
* `CacheManager` now creates a new cache called `html` which is used to store all loaded HTML snippets.
* `FileType.HTML` is a new file type loader that will load an HTML snippet and store it in the new `html` cache. Access it via `load.html` (this method was previously used to load html to textures, please see `load.htmlTexture` for this feature now)
* `TransformMatrix.getX` is a new method that return the x component from the given x and y values based on the current matrix. This is used heavily in the pipelines.
* `TransformMatrix.getY` is a new method that return the y component from the given x and y values based on the current matrix. This is used heavily in the pipelines.
* `TransformMatrix.copyToArray` is a new method that will copy the matrix values to the given array. It's the counter-part of `copyFromArray`.
* `Graphics.setTexture` is a new WebGL only method that allows you to set a texture to be used when drawing the shapes on the Graphics object. You can also specify how the texture should be blended with the current fill or gradient colors. Note that the texture is not tiled, it is stretched to fit the shape being drawn.
* `Graphics.fillGradientStyle` is a new WebGL only method that allows you to set a gradient for the shapes being filled. You can control the colors at the 4 corners of a rectangle. The colors are then blended automatically in the shader. Use of this feature is limited. For example, you cannot gradient fill a whole path or an arc, as it's made up of lots of triangles. But for quick gradient backgrounds or buttons it's perfect.
* `Graphics.lineGradientStyle` is a new WebGL only method that allows you to set a gradient for the shapes being stroked. You can control the colors at the 4 corners of a rectangle. The colors are then blended automatically in the shader. Use of this feature is limited. For example, you cannot gradient stroke a whole path or an arc, as it's made up of lots of triangles. But for quick gradient lines it's perfect.
* `TextureManager.getBase64` is a new method that will take a texture frame key and return a base64 encoded version of the frame. You can also provide the image type and encoder options.
* Global Plugins now have a new optional `data` object, the contents of which are passed to the plugins `init` method. This allows users to pass data directly into a plugin when added in the config: `{ key: 'BankPlugin', plugin: BankPluginV3, start: true, data: { gold: 5000 } }` or when adding a plugin via the `install` method (thanks @samme)
* You can now play animations in reverse! Use the new `Sprite.anims.playReverse` method to play a pre-defined animation in reverse from its starting frame. Or call `Sprite.anims.reverse` to immediately reverse the flow of an already running animation. Animations running in reverse still count towards the repeat total and respect the yoyo flag (thanks @khaleb85 @Ben-Millions)
* The `ParticleEmitterManager` now has the Transform component. This means you can now set the position, rotation or scale of the Emitter Manager, and it will influence every Emitter it is rendering. The Managers transform is mixed with that of the Camera. This works in both Canvas and WebGL.
* `TextureManager.addRenderTexture` is a new method that will add a Render Texture into the Texture Manager, allowing you to use it as the texture for Game Objects just by using the texture key. Modifying the source Render Texture will immediately modify any Game Objects using it.
* TextureSource has a new boolean property `isRenderTexture` which is set automatically when it's created.
* The Canvas Renderer has a new method `setContext` which allows it to swap the context being drawn to by all draw operations. Call the method with no arguments to reset it to the default game canvas.
* If you set `window.FORCE_WEBGL` or `window.FORCE_CANVAS` in the window in which the Phaser game is loaded it will over-ride the renderer type setting in your game config, and force either WebGL or Canvas. This is handy for quickly testing the differences between renderers without having to do a new build each time.
* `TextureSource.source` is a new property that contains the original source of the Texture image. It is cleared when the source is destroyed.
* `TransformMatrix.copyToContext` is a new method that will copy the values from the Matrix to the given Canvas Rendering Context.
* `Phaser.Utils.String.UUID` will return an RFC4122 complaint UUID as a string. This is used internally to avoid cache key conflicts, but is exposed for your own use as well.
* There is a new `Crop` Component which is used by non-texture based Game Objects, such as Text and TileSprite. You either use `TextureCrop` or `Crop`, not both together on the same object.
* `TransformMatrix.setToContext` is a new method that will set the values from the Matrix to the given Canvas Rendering Context using setTransform rather than transform.
* `SetTransform` is a new Canvas Renderer function that consolidates the process of preparing a Game Object for rendering, without actually rendering it. This is used internally by the Graphics and Bitmap Text classes.
* The Texture Manager has a new method called `renameTexture` which will let you rename a texture, changing the key to the new one given. All existing Game Objects will still maintain their reference, even after a rename.
* When loading an SVG file you can now change the size of the SVG during the load process, before it is rendered to a texture. This is really helpful if you wish to increase SVGs that have small viewBoxes set, or want to try and reduce memory consumption from SVGs with extra large dimensions. You can either pass in a fixed width and height: `this.load.svg('morty', 'file.svg', { width: 300, height: 600 })` or you can provide a scale factor instead: `this.load.svg('morty', 'file.svg', { scale: 4 })` (thanks @ysraelJMM)
* `Polygon.Perimeter` will return the perimeter for the given Polygon (thanks @iamchristopher)
* `Polygon.GetPoints` will return an array of Point objects containing the coordinates of the points around the perimeter of the Polygon, based on the given quantity or stepRate values. This is available as a static function and as the `getPoints` method on a Polygon (thanks @iamchristopher)

### Updates

* The Camera class has been split into two: `BaseCamera` which contains all of the core Camera functions and properties, and would serve as a great base for you to extend for your own custom Cameras, and `Camera` which is the same class name as previously. `Camera` extends the Base Camera and adds in follower support and the Special Effects. You don't need to update your code, even if currently extending a Camera, as they work the same as before.
* `Camera.x` and `Camera.y` have been turned into getters / setters, mapped to the internal private values `_x` and `_y` respectively. This is so that setting the Camera viewport position directly will now update the new internal resolution calculation vars too.
* `Camera.setScene` will now set the Cameras `resolution` property at the same time and update the internal viewport vars.
* The `Cull Tiles` method used by the Dynamic Tilemap Layer has had a nice and significant optimization. It will now use the cull area dimensions to restrict the amount of tile iteration that takes place per layer, resulting in dramatic reductions in processing time on large layers, or multiple layers (thanks @tarsupin)
* `GameObject.willRender` now takes a Camera as its only argument and uses it within the check. This has allowed me to remove 23 duplicate checks spread across the various Game Objects, all of which did the same thing, saving both KB and CPU time as the flags were being checked twice in most cases.
* The file type loader `HTML` has been renamed to `HTMLTexture`. If you were using this then please change your calls from `load.html` to `load.htmlTexture`. The arguments remain the same.
* The `setBlendMode` method in the WebGL Renderer now returns a boolean. True if a new blend mode was set, otherwise false. Previously it returned a reference to the renderer instance.
* The method `batchVertices` in the TextureTintPipeline has been renamed to `batchQuad` which more accurately describes what it does.
* In ArcadePhysics `Body.setSize` you can now choose to not pass width and height values to the method. If you do this it will check to see if the parent Game Object has a texture frame, and if so, it will use the frame sizes for the Body dimensions (thanks @tarsupin)
* `PluginCache.destroyCorePlugins` will remove all core plugins from the cache. Be very careful calling this as Phaser cannot restart or create any new Scenes once this has been called.
* `PluginCache.destroyCustomPlugins` will remove all custom plugins from the cache.
* `PluginManager.destroy` will now clear all custom plugins from the Plugin Cache. This fixes an issue with not being able to destroy a Phaser game instance and restart it if it used a custom plugin (thanks jd.joshuadavison)
* `Game.destroy` has a new boolean argument `noReturn`. If set it will remove all Core plugins when the game instance is destroyed. You cannot restart Phaser on the same web page after doing this, so only set it if you know you're done and don't need to run Phaser again.
* The `MouseManager` will no longer process its native events if the manager reference has been removed (i.e. you move the pointer as the game is destroying itself)
* The `TouchManager` will no longer process its native events if the manager reference has been removed (i.e. you move the pointer as the game is destroying itself)
* `Particle.color` has been removed as it's now calculated during rendering to allow for Camera alpha support.
* The Game boot event flow has changed slightly. The Game will now listen for a `texturesready` event, which is dispatched by the Texture Manager when the default textures have finished processing. Upon receiving this, the Game will emit the `ready` event, which all the other systems listen for and respond to. The difference is that the Renderer uses the `texturesready` event to ensure that it is the first thing to be activated, before any other system.
* The WebGLRenderer has a new property `blankTexture` which is a reference to an empty 32x32 transparent WebGL Texture. This is used internally for things like rendering Graphics with no texture fills and where no other texture has been set.
* The WebGLRenderer has a new method `setBlankTexture` which forces it to set the blank texture as the current texture. This is used after drawing a Render Texture to ensure no other object tries to draw to itself.
* The StaticTilemapLayer has had the following properties and methods added to it: `skipCull`, `tilesDrawn`, `tilesTotal`, `cullPaddingX`, `cullPaddingY`, `cullCallback`, `setSkipCull` and `setCullPadding` as these are all used by the Canvas Static Layer renderer. Static Layers in 3.11 didn't render in Canvas because the cull values were missing, but now render correctly and can also be rendered to other targets, like a Render Texture.
* The Math.Snap methods `Snap.Floor`, `Snap.Ceil` and `Snap.To` have all gained a new optional boolean argument `divide`. If set the resulting snapped value will be divided by the gap amount before returning. This is handy if you're trying to quickly snap a value into a grid or array location.
* The `currentBlendMode` property has been removed from the Canvas Renderer and is no longer checked by any class. Blend modes are now set directly on the context to avoid state saving invalidation.
* The `currentAlpha` property has been removed from the Canvas Renderer and is no longer checked by any class. Alpha values are now set directly on the context to avoid state saving invalidation.
* `TextureCrop` and `Crop` have a new method `resetCropObject` which generates the crop data object required by Game Objects that support cropping. This allows us to remove duplicate code from a number of Game Objects and replace it with a single function call.
* The Canvas Renderer has a new `batchSprite` method that consolidates the process of drawing a texture-based Game Object to the canvas. It processes the alpha, blend mode and matrix calculations in a single function and now is used by nearly all Game Object canvas renderers.
* The `batchTexture` method in the Texture Tint Pipeline now supports cropped Game Objects and will adjust the drawn texture frame accordingly.
* The `Matrix Stack` Component has been removed. It's no longer used internally and was just wasting space.
* You can now specify the `lineHeight` of a Retro Font in the Retro Font Config object (thanks @FelixNemis)
* When a Static Tilemap Layer is generated in WebGL it will use the Cameras `roundPixels` value to clamp the tile coordinates.
* The `CanvasRenderer.DrawImage` function has been removed, as has the associated `drawImage` property from the Canvas Renderer as they're no longer used.
* The `CanvasRenderer.BlitImage` function has been removed, as has the associated `blitImage` property from the Canvas Renderer as they're no longer used.
* You can now access the Game instance directly from a Scene using `this.game` as long as it exists in the Scene's Injection Map, which it does by default. Be very careful what you do here: there's next to nothing you should actually use this for.
* `Camera.ignore` can now take nested-arrays of Game Objects and also supports both Groups and Containers.
* The `changedata` event dispatched by the Data Manager now includes the previous value as the 4th argument to the callback, so the event signature is now: `parent, key, value, previousValue` (thanks @iamchristopher)
* The call to `gl.clearColor` is now skipped when `clearBeforeRender` is set to `false` (thanks @goldfire)
* The calls to `DistanceBetween` have been replaced with `DistanceSquared` in the `closest` and `furthest` functions within Arcade Physics (thanks @Mursaat)
* The RandomDataGenerator will now create a default random seed if you instantiate your own version of the class (instead of using `Phaser.Math.RND`) and don't provide a seed for it (thanks michaeld)
* The Tilemap `createFromObjects` method will now add custom properties to the Game Objects. It works by checking if the property exists or not, and if not, it sets it in the Game Objects Data Manager (thanks @scalemailted @samme)
* In Matter.js if you scaled a Body it would only scale correctly once, due to the way Matter handles scaling internally. We now automatically reset the Matter scale before applying the new value, which allows you to keep the Phaser and Matter object scales in sync. Fix #3785 #3951 (thanks @bergben)
* The default Container Blend Mode is now `SKIP_TEST`. This allows you to either set a blend mode for a Container, in which case all children use that blend mode. Or, you can set a blend mode on the children and the children will render using their own blend modes, as the Container doesn't have one set. The WebGL and Canvas Renderer functions have also been updated to support this change. Fix #3684 (thanks @TadejZupancic)
* Previously the Input Manager would create a Touch handler unless the Game Config had `input.touch` set to `false` (the default was true). If no such property is set, it no longer defaults to `true` and instead is set to whatever `Device.input.touch` returns. On non-touchscreen desktops this means it will now only create one single Pointer, rather than two.
* The Arcade Physics Body `_tempMatrix` property has been removed. It was only used if the Body's Game Object had a parent. The matrix has been moved to the World instance instead, shared by all bodies.
* Arcade Physics World has gained two new private properties `_tempMatrix` and `_tempMatrix2`. These are used by all bodies in the simulation that need a temporal matrix for calculations, rather than having their own instances.
* The Input Manager has gained a new private property `_tempMatrix2`. This is used internally in the hitTest checks to avoid constant matrix creation.
* The Transform Matrix has a new method `applyInverse` which will take an x/y position and inverse translate it through the current matrix.
* Using `keyboard.addKeys("W, A, S, D")` would fail because of the spacing between the characters. `addKeys` will now trim the input allowing you to space characters out if you prefer (thanks @dhruvyad)
* Calling `setTimeScale` on the Sprite's Animation component will now set the time scale value and keep it set until you change it again. Previously it would be reset to 1 when a new animation was loaded into the component, but this no longer happens - once the time scale is set it remains in effect, regardless of which animations are played on the Sprite.

### Game Config Resolution Specific Bug Fixes

Setting the `resolution` property in the Game Config to a value other than 1 would cause various errors in the API. The following have been fixed:

* The game canvas would be sized incorrectly, unless you had enabled auto resizing. It now scales the canvas to the size given, maintaining the resolution. Fix #3468 (thanks @Legomite)
* Cameras with background colors set would display the filled color area at the wrong size. Camera fills now respect the resolution.
* The Camera Fade Effect would display the fade fill rectangle at the wrong size. Camera fades now respect the resolution.
* The Camera Flash Effect would display the fade fill rectangle at the wrong size. Camera flashes now respect the resolution.
* The Camera Shake Effect would shake the Camera using the wrong width values. Camera Shakes now respect the resolution.
* Input calculations would not factor in the Game Resolution correctly. If a Camera viewport was not at 0x0 or not the full size, or the Camera was rotated or zoomed, the input areas would be wrong if `resolution` was > 1. These are now factored in correctly and changing the resolution no longer breaks input. Fix #3606 (thanks @Secretmapper @thanh-taro)

### Bug Fixes

* The `setCrop` method stored its crop object on the prototype chain by mistake, causing all Images or Sprites that were cropped to display the same frame. The crop data has been moved to the Game Object instance, where it should be, fixing this issue (thanks NoxBrutalis)
* If an AudioFile failed to load and throw an incomplete error, it would cause the console.log to crash JavaScript when trying to log the error. It now only logs the message if it exists. Fix #3830 (thanks @kelostrada)
* Particles using a blend mode wouldn't render correctly after the updates in 3.11. If the blend mode changes during the processing of an emitter manager it'll now correctly rebind the texture, stopping the particles from vanishing. Fix #3851 (thanks @maxailloud)
* Adding an array of children to a Group would cause it to mistakenly think you were passing a config object. Fix #3854 (thanks @pedro-w)
* Graphics paths in WebGL would not render the line join between the final and the first path if the path was closed, leaving a noticeable gap if you used particularly thick strokes. If the path is closed it will now render the final line join properly.
* If a Mesh caused a batch flush it would fail to render as its texture was lost. It's now rebound correctly after the flush.
* `ArcadePhysics.closest` and `ArcadePhysics.furthest` used the wrong tree reference, causing them to throw errors (thanks @samme)
* `BlitterCanvasRenderer` would fail to render a Bob in Canvas mode if it was flipped (thanks @SBCGames)
* `RenderTexture.draw` would fail to draw the frame in Canvas mode (thanks @SBCGames)
* `ParticleEmitter` would fail to draw a textured particle in Canvas mode (thanks @SBCGames)
* `RenderTexture.preDestroy` will now release the canvas back to the CanvasPool if running in canvas mode (thanks @SBCGames)
* The `alpha` value is now always set for Render Textures in canvas mode, regardless of the previous alpha value in the renderer (thanks @SBCGames)
* Zone now calls `updateDisplayOrigin` in its constructor, causing the `displayOriginX` and `displayOriginY` values to now be correct if you create a Zone and then don't resize it. Fix #3865 (thanks @rexrainbow)
* The `CameraManager` was accidentally adding extra destroy event calls when a Scene was restarted, causing an `Uncaught TypeError: Cannot read property 'events' of null` when trying to destroy a game instance having swapped from a Scene to another, and back again. Fix #3878 (thanks @mbunby)
* RenderTextures in WebGL will now set the viewport size, stopping the console warning in Firefox. Fix #3823 (thanks @SBCGames)
* Particles now take the Cameras alpha value into consideration when calculating their final alpha values in WebGL. They previously ignored it. If you now alpha a Camera out all particles will change accordingly.
* The `CullTiles` updates from 3.11 didn't factor in the position of the Tilemap Layer to its bounds calculations, causing Static layers displayed out of the Camera viewport to never render in Canvas mode. The method has also been optimized further, with less divisions and less checks if culling is disabled.
* The Particle Emitter when running in Canvas wouldn't allow more than 1 emitter to use a blend mode (as seen in the Electric examples). The blend mode is properly set for each emitter now.
* The Blend Mode is now set directly in all Canvas Renderers without comparing it to what's stored in the Canvas Renderer. This fixes problems where the blend mode would be lost between two different Game Objects because they restored the context, but didn't update the renderer flag. Game Objects in Canvas can now mix and match blend modes across the display list.
* Matter.js has received a tiny update that prevents `collisionEnd` from triggering many times when it should only trigger once (thanks @mikewesthad)
* Graphics objects couldn't be set to be ignored by Cameras. Now every renderable Game Object can be ignored by a Camera, either directly or via a Container. The exception are Groups because they don't render and are non-exclusive parents.
* The Tilemap Culling function now uses the Tilemap tile dimensions for its bounds calculations, instead of the layer tile sizes, as they two don't have to match and it's the underlying grid size that takes precedence when calculating visible tiles. Fix #3893 (thanks @Zax37)
* The Arcade Physics `Body.speed` property is now set whenever you set the velocity via `setVelocity` or `setVelocityX` or `setVelocityY` which stops the body velocity being reset to zero if `useDamping` is enabled. Fix #3888 (thanks @samme)
* The `getPixelAlpha` method in the Texture Manager wasn't using the correct frame name. This is now passed in correctly. Fix #3937 (thanks @goldfire)
* The `getPixelAlpha` and `getPixel` methods in the Texture Manager would allow x/y coordinates from outside the cut area of a frame. It now tests to ensure they're within the frame. Fix #3937 (thanks @goldfire)
* A Game Object couldn't have a blend mode of `SKIP_TEST` set by using the getter or the `setBlendMode` method.
* In Arcade Physics the `World.disable` call was passing the wrong argument, so never disabling the actual body (thanks @samme)
* There was a visual bug with Rounded Rectangles in Canvas mode, due to the addition of the `overshoot` argument in the Graphics arc call. This has been fixed, so arcs will now render correctly and consistently in WebGL and Canvas and Rounded Rectangles are back to normal again too. Fix #3912 (thanks @valse)
* The `InputManager.inputCandidate` method, which determines if a Game Object can be interacted with by a given Pointer and Camera combination, now takes the full camera status into consideration. This means if a Camera is set to ignore a Game Object you can now no longer interact with it, or if the Camera is ignoring a Container with an interactive Game Object inside it, you cannot interact with the Container children anymore. Previously they would interact regardless of the Camera state. Fix #3984 (thanks @NemoStein @samid737)
* `Transform.getWorldTransformMatrix` has been recoded to iterate the transform parents correctly, applying the matrix multiplications as it goes. This (along with some changes in the Input Manager) fix the issue with Game Objects inside of Containers failing hit tests between certain angles. Fix #3920 (thanks @chaping @hackhat)
* Calling Arcade Physics `collide` during an `update` method wouldn't inject the results back into the Body parent, causing the bodies to carry on moving. Using Colliders worked, but manually checking did not. Now, both methods work. Fix #3777 (thanks @samme)
* The `setTintFill` method would ignore the `alpha` value of the Game Object in the shader. The alpha value is now blended with the tint fill, allowing you to properly alpha out tint-filled Game Objects. Fix #3992 (thanks @trl-bsd)
* Arcade Physics World `collideSpriteVsTilemapLayer` now syncs the collision results back to the body, allowing you to call `collide` from within an update loop once again. Fix #3999 (thanks @nkholski @mikewesthad)
* Arcade Physics Body `deltaX` and `deltaY` methods will now return the previous steps delta values, rather than zero. Fix #3987 (thanks @HaoboZ)

### Examples, Documentation and TypeScript

My thanks to the following for helping with the Phaser 3 Examples, Docs and TypeScript definitions, either by reporting errors, fixing them or helping author the docs:

@SBCGames @rgk @rook2pawn @robbintt @bguyl @halilcakarr @PhaserEditor2D @Edwin222 @tfelix @Yudikubota @hexus @guzmonne @ampled @thanh-taro @dcbriccetti @Dreaded-Gnu @padme-amidala @rootasjey @ampled @thejonanshow @polarstoat @jdjoshuadavison @alexeymolchan @samme @PBird @spontoreau @hypertrifle @kid-wumeng

Thanks to @khaleb85 for fixing the super-annoying lag on the API Docs pages when it hung the browser while indexing the search field.


## Version 3.11.0 - Leafa - 13th July 2018

### Camera - New Features, Updates and Fixes

* All of the 2D Camera classes are now 100% covered by JSDocs!
* All of the 3D Camera classes are now deprecated and will be removed in the next version. They will be moved to a stand-alone plugin.
* `Camera.alpha` (and its related method `Camera.setAlpha`) allows you to set an alpha level for the entire camera. This impacts everything it is rendering, even if those objects also have their own alpha values too. You can tween the property to make the camera contents fade in / out, or otherwise set it as needed in your game.
* `Camera.deadzone` (and its related method `Camera.setDeadzone`) allows you to specify the deadzone for a camera. The deadzone is a rectangular region used when a camera is following a target. If the target is within the deadzone then the camera will not scroll. As soon as the target leaves the deadzone, the camera will begin tracking it (applying lerp if needed.) It allows you to set a region of the camera in which a player can move freely before tracking begins. The deadzone is re-centered on the camera mid point every frame, meaning you can also use the rectangle for other in-game checks as needed.
* `Camera.pan` is a new Camera Effect that allows you to control automatic camera pans between points in your game world. You can specify a duration and ease type for the pan, and it'll emit events just like all other camera effects, so you can hook into the start, update and completion of the pan. See the examples and docs for more details.
* `Camera.zoom` is a new Camera Effect that allows you to control automatic camera zooming. You can specify a duration and ease type for the zoom, as well as the zoom factor of course, and it'll emit events just like all other camera effects, so you can hook into the start, update and completion of the zoom. Used in combination with the new Pan effect you can zoom and pan around with ease. See the examples and docs for more details.
* `Camera.midPoint` is a new Vec2 property that is updated every frame. Use it to obtain exactly where in the world the center of the camera is currently looking.
* `Camera.displayWidth` is a new property that returns the display width of the camera, factoring in the current zoom level.
* `Camera.displayHeight` is a new property that returns the display height of the camera, factoring in the current zoom level.
* `Camera.worldView` is a new property, an instance of a Rectangle, that contains the dimensions of the area of the world currently visible by the camera. You can use it for intersection or culling tests that don't need to factor in camera rotation.
* `Camera.dirty` is a new boolean property. A dirty Camera has had either its viewport size, bounds, scroll, rotation or zoom levels changed since the last frame. The flag is reset in the `postCameraRender` method, but until that point can be checked and used.
* `Camera.centerOn` is a new method that will move the camera so its viewport is centered on the given coordinates. A handy way of jumping to different points around a map without needing to calculate the scroll offsets.
* The Camera bounds didn't factor in the camera zoom properly, meaning you would often not be able to reach the corners of a camera bound world at a zoom level other than 1. The bounds are now calculated each frame to ensure they match the zoom level and it will no longer allow you to scroll off the edge of the bounds. Fix #3547 (thanks @nkholski)
* `Camera.centerToBounds` didn't take the bounds offset into account, so bounds at non-zero positions wouldn't center properly. All bounds now center correctly. Fix #3706 (thanks @cyantree)
* `Camera.setBounds` has a new optional argument `centerOn`. If specified it will automatically center the camera on the new bounds given.
* The Camera will no longer stutter when following Game Objects at high zoom levels.
* `Camera._id` has been renamed to `Camera.id`, a read-only bitmask used for camera exclusion from Game Objects.
* The Camera Manager `cameraPool` has been removed entirely. It was mostly pointless in practice as Cameras are not regenerated frequently enough to need pooling. It also didn't maintain the bitmask list correctly before.
* `CameraManager.resetAll` now destroys all current Cameras, resets the camera ID marker to 1 and adds a single new Camera.
* `CameraManager.currentCameraId` has been removed. IDs are assigned more intelligently now, via the `getNextID` internal method.
* `CameraManager.addExisting` no longer needs to be passed a Camera that already exists in the pool (as the pool has been removed), meaning you can now create your own Cameras and pass them to `addExisting` and have them treated as normal cameras and not be ignored by the manager. They are also assigned a proper ID when added.
* `CameraManager.addExisting` has a new boolean argument `makeMain` which will make the new camera the main one.
* `CameraManager.getTotal` is a new method that will return the total number of Cameras being managed, with an optional `isVisible` argument, that only counts visible cameras if set.
* `CameraManager.remove` can now take an array of cameras to be removed from the manager, as well as a single camera.
* `CameraManager.remove` would previously not allow you to remove a camera if it meant there would be no cameras left in the Camera Manager. This restriction has been removed. A Camera Manager can now run even with zero cameras. Your game obviously won't display anything, but it's still now possible.
* `CameraManager.remove` will now return the total number of Cameras removed.

### Round Pixels Changes

Before explaining the changes it's worth covering what the three different game config properties do:

`roundPixels` - this will cause the renderer to draw most Game Objects at whole integer positions. Their actual positions can be anything, but the renderer will floor the values to ensure they are integers immediately before drawing. It only works on texture based Game Objects. Graphics objects, for instance, ignore this property.

`antialias` - when set to `true` WebGL textures are created using `gl.LINEAR`, which allows WebGL to try its best to interpolate the texture when rendered at non-texture frame sizes. This can happen if you scale a Game Object, or zoom a Camera. In both cases it will need to interpolate the pixel values to accommodate the new size. If this property is set to `false` then it will use `gl.NEAREST` instead. This uses a nearest neighbor method of interpolation, and is nearly always the better option if you need to keep the textures crisp, such as when using scaled pixel art. Disabling `antialias` invokes nearest-neighbor interpolation on the game canvas itself as well. If you need a mixture of aliased and anti-aliased textures in your game, then you can change them on a per-texture basis by using `Texture.setFilter`.

There is a third game config property called `pixelArt`. If set to `true` it's the same thing as enabling `roundPixels` and disabling `antialias`. This is the optimum setting for pixel art games.

* Both renderers will now check for `pixelArt` OR `antialias` before setting the canvas scale mode. Both values are checked during texture creation as well.
* If in your game config you have enabled either pixel art mode or roundPixels, then all Cameras will have their `roundPixels` values set to `true` by default. You can toggle this by changing the `CameraManager.roundPixels` property, or change it on a camera-by-camera basis, as needed.
* `Camera.roundPixels` is now used across all rendering code for both Canvas and WebGL. Previously, it would check the renderer config value, but now all renderer code uses the camera value to decide if it should floor the drawing position or not.

### Texture Tint Pipeline - New Features, Updates and Fixes

The Texture Tint Pipeline has been rewritten to tidy up hundreds of lines of duplicate code and to move the responsibility of drawing to the Game Objects themselves. Previously, had you excluded say Tilemaps from your build of Phaser, the renderer would still include masses of code dealing with the drawing of them. This task has been moved to the Game Objects and the pipeline just provides a set of clean utility functions for batching, flushing and drawing.

The decision to make this change was not taken lightly. However, I felt that none of the pipelines actually lived up to their name. You could never actually pass objects through one pipeline to another as they didn't have entry and exit points and were instead just glorified singular batches. Although you could change the pipeline being used on a Game Object this action meant that every pipeline had to be responsible for every single type of Game Object, both now and in the future, and they were full of redundant stub functions as a result. The payload size was also considerable. It has now gone from 1,961 lines of code at 76 KB down to 729 lines of code and 27 KB. It's not the only file to benefit either. The `ForwardDiffuseLightPipeline` also reduced from 402 lines (15.7 KB) down to 159 lines and 6 KB. Sizes include comments and are un-minified. In a production bundle the difference will be even greater. This is work we will continue in the next release as we do the same updates to the FlatTintPipeline, responsible for rendering Graphics objects, and look at consolidating the shaders allowing you to use Graphics and Sprites mixed in the display list with no shader swapping cost.

* You can now set the WebGL batch size in the Game Config via the property `batchSize`. The default is 2000 before the batch will flush, which is a happy average between desktop and mobile. If targeting desktop specifically, you may wish to increase this value to reduce draw calls.
* There is a new method `batchVertices` which will add a vertices block to the current batch. This is now used internally by nearly all render functions.
* The shader has a new attribute: `tintEffect`. This is a single FLOAT.
* The vertex size has increased by 1 FLOAT to account for the extra shader attribute.
* All of the rendering functions now use the `TransformMatrix` class far more than before. This allows the matrix operations to be run-time compiled and cut down on masses of code.
* The `drawTexture` method has been removed. It has been replaced by `drawTextureFrame` which has a new and more concise signature. See the API docs for details.
* The `batchTileSprite` method has been removed. It is now handled in the TileSprite WebGL Render function.
* The `drawStaticTilemapLayer` method has been removed. It is now handled in the Static Tilemap Layer WebGL Render function.
* The `drawEmitterManager` method has been removed. It is now handled in the Particle Manager WebGL Render function.
* The `batchText` method has been removed. It is now handled in the Static Text WebGL Render function.
* The `batchDynamicTilemapLayer` method has been removed. It is now handled in the Dynamic Tilemap Layer WebGL Render function.
* The `batchMesh` method has been removed. It is now handled in the Mesh WebGL Render function.
* The `batchBitmapText` method has been removed. It is now handled in the BitmapText WebGL Render function.
* The `batchDynamicBitmapText` method has been removed. It is now handled in the DynamicBitmapText WebGL Render function.
* The `batchBlitter` method has been removed. It is now handled in the Blitter WebGL Render function.

Due to the changes in the Texture Tint Pipeline the `Textures.Frame` class has also been updated. The following changes concern the Frame UV data:

* Previously, the UV data spanned 8 properties: `x0`, `y0`, `x1`, `y1`, `x2`, `y2`, `x3` and `y3` and was stored in the `data.uvs` object. These have been replaced with directly accessible properties: `u0`, `v0`, `u1` and `v1`. These 4 properties are used directly in all renderer code now. Although it was clearer having 8 properties, 4 of them were just duplicates, so we've traded a little clarity for a smaller overall object and less dictionary look-ups.
* `Frame.uvs` (and the corresponding `Frame.data.uvs`) object has been removed.

### New Tint Effects

As well as tidying the Texture Tint Pipeline, I also updated the shader. It now has a new attribute 'tintEffect' which allows you to control how a tint is applied to a Game Object. The default way tinting worked was for the tint color values to be multiplied with the texture pixel values. This meant you were unable to do things like tint a Game Object white, because multiplying a color by white doesn't change it. The new tint mode allows you to literally replace the pixel color values.

* `setTintFill` is a new method available to all Game Objects that have the Tint component. It differs from `setTint` in that the colors literally replace the pixel values from the texture (while still respecting the alpha). This means you can now create effects such as flashing a sprite white if it gets hit, or red for damage, etc. You can still use different colors per corner of the Game Object, allowing you to create nice seamless gradient effects.
* `tintFill` is a new boolean property that allows you to toggle between the two different tint types: multiply or replace.
* `isTinted` is a new read-only boolean indicating if a Game Object is tinted or not. Handy for knowing if you need to clear a tint after an effect.
* `Mesh.tintFill` allows you to control the tint effect applied to the Mesh vertices when color blending.

The Tint component documentation has been overhauled to explain these differences in more detail, and you can find lots of new examples as well.

### New Texture Crop Component

There is a new Game Object Component called `TextureCrop`. It replaces the Texture Component (which still exists) and adds in the ability to crop the texture being used. This component is now being used by the `Sprite` and `Image` Game Objects.

* You can crop the frame being used via the new `setCrop` method. The crop is a rectangle that limits the area of the texture frame that is visible during rendering. Cropping a Game Object does not change its size, dimensions, physics body or hit area, it just changes what is shown when rendered. This is ideal for hiding part of a Sprite without using a mask, or for effects like displaying a progress or loading bar. Cropping works even when the Game Object is flipped, or is a trimmed frame from an atlas.
* You can toggle the crop on a Game Object by changing the `isCropped` boolean at any point.
* The crop is automatically re-applied when the texture or frame of a Game Object is changed. If you wish to disable this, turn off the crop before changing the frame.

### BitmapText New Features, Updates and Bug Fixes

* Multi-line BitmapText objects can now be aligned. The constructor has a new argument `align` which can accept either left-aligned (the default), center aligned, or right-aligned. Alignment works by calculating the longest line of text in the object and then offsetting the other lines to match it.
* `BitmapText.setCenterAlign` is a new chainable method to center-align the text.
* `BitmapText.setLeftAlign` is a new chainable method to left-align the text.
* `BitmapText.setRightAlign` is a new chainable method to right-align the text.
* `BitmapText.align` is a new property that holds the alignment of the text.
* `BitmapText.setFont` is a new method that allows you to change the font it is rendering with.
* Internally all of the BitmapText properties have been renamed with an underscore (i.e. `letterSpacing` is now `_letterSpacing`), so as to not change the API, getters and setters for them all have been added.
* Internally there is a new `dirty` flag that tracks if any part of the BitmapText has changed. This is used when getting the BitmapText's bounds object, as used in the renderer for line alignment, and in properties like `width` and `height`. The dirty flag ensures the bounds are only recalculated if something has changed, cutting down on un-necessary calculations.
* `GetBitmapTextSize`, which is used internally in the BitmapText Game Objects, will now produce different bounds from the previous version. Previously, the bounds were tight against the letters in the text. However, this meant the bounds were not properly aligned with the origin of the BitmapText, and consequently you'd get different bounds if the text consisted of different characters. The bounds are now calculated purely based on the glyph data and letter spacing values. This will give a far more consistent overall experience, but it does mean if you were using the bounds to position text previously, you'll need to revisit that code again. See issue #3799 for more details (and to discuss this further if you wish) (thanks @SBCGames)
* `GetBitmapTextSize` and its exposed method `BitmapText.getTextBounds` now factor in the display origin of the BitmapText into the `global` position returned.
* The `BitmapText` WebGL Renderer incorrectly calculated the font scale at very small sizes, causing characters to overlap when they shouldn't. Scale is now applied to the correct component parts in the render code.
* Under WebGL `BitmapText` would be cut off if you specified a resolution value > 1. Fix #3642 (thanks @kanthi0802)
* Under WebGL, `DynamicBitmapText` that had a crop set on it would fail to render if anything was above it on the display list. It now crops properly, no matter what is above or below it on the display list.
* The `DynamicBitmapText` class now extends the `BitmapText` class. This saves on lots of space in the bundle and consolidates functionality between the two. Please be aware of it if you have classes that extend either of them.
* If you were using the `displayCallback` in the `DynamicBitmapText` class it would generate a brand new object containing all the glyph data, every frame, for every glyph, and send it to the callback. This has been changed so it now uses a new cached local object: `callbackData`. This object is recycled for every glyph, stopping un-needed gc from building up.

### Dynamic Tilemap Layer New Features, Updates and Bug Fixes

* `DynamicTilemapLayer.tilesDrawn` is a read-only property that contains the number of tiles sent to the renderer in the previous frame.
* `DynamicTilemapLayer.tilesTotal` is a read-only property that contains the total number of tiles in the layer, updated every frame.
* `DynamicTilemapLayer.skipCull` and its associated chainable method `setSkipCull` allows you to control if the cameras should cull the layer tiles before rendering them or not. By default they will cull, to avoid over-rendering, but in some circumstances you may wish to disable this and can now do so by toggling this property.
* The `CullTiles` component, as used by the Dynamic Tilemap, has been recoded from scratch to take advantage of updates in the Camera system. It will now properly cull tiles, irrespective of the layer scale, or camera zoom. It also now supports the layers `skipCull` property, allowing you to override the culling. The Dungeon Generator labs demo now works again as a result of this fix, and has been updated with a debug mode and camera control UI. You can edit the example source to swap between 4 different dungeon layouts, from 2500 tiles up to 1 million tiles. There are limitations to the way the culling works though. If you rotate the camera you may find you see the cull edge. You can disable this using the new `skipCull` property. Fixing this also fixed #3818 (thanks @Mursaat)
* `DynamicTilemapLayer.cullPaddingX`, `cullPaddingY` and the associated chainable method `setCullPadding` allows you to control how many additional tiles are added into the cull rectangle when it is calculated. If you find that your camera size and zoom settings are causing tiles to get prematurely culled, resulting in clipping during scrolling, then set the `cullPadding` values to add extra layers of tiles to the calculations in both directions without needing to disable culling entirely.
* `DynamicTilemapLayer.cullCallback` allows you to change the function that is used to perform the tile culling. By default it will call `TilemapComponents.CullTiles` but you can override this to call any function you like. It is sent 3 arguments: the layer data, the camera and the array to store the tiles in. Using this feature you can now create whatever culling system you require, should the default one prove to not be suitable for your game. Fix #3811 (thanks @georgzoeller)
* Dynamic Tilemap Layers now properly support the Lights2D Pipeline. This means you can provide a normal map for the layer tileset and it'll illuminate with the Lights shader properly. See the new `light map` example in the labs for a demonstration. Note that there are limits on the number of tiles that can be rendered with lighting enabled. Fix #3544 (thanks @FrancescoNegri)

### New Features

* `Graphics.fillRoundedRect` will draw a stroked rounded rectangle to a Graphics object. The radius of the corners can be either a number, or an object, allowing you to specify different radius per corner (thanks @TadejZupancic)
* `Graphics.strokeRoundedRect` will draw a filled rounded rectangle to a Graphics object. The radius of the corners can be either a number, or an object, allowing you to specify different radius per corner (thanks @TadejZupancic)
* `ParticleEmitter.stop` is a new chainable method to stop a particle emitter. It's the same as setting `on` to `false` but means you don't have to break the method flow to do so (thanks @samme)
* `ScenePlugin.pause` (and the corresponding methods in Scene Systems and the Scene Manager) now has a new optional `data` argument, which is passed to the target Scene and emitted in its 'pause' event.
* `ScenePlugin.resume` (and the corresponding methods in Scene Systems and the Scene Manager) now has a new optional `data` argument, which is passed to the target Scene and emitted in its 'resume' event.
* `ScenePlugin.sleep` (and the corresponding methods in Scene Systems and the Scene Manager) now has a new optional `data` argument, which is passed to the target Scene and emitted in its 'sleep' event.
* `ScenePlugin.wake` (and the corresponding methods in Scene Systems and the Scene Manager) now has a new optional `data` argument, which is passed to the target Scene and emitted in its 'wake' event.
* `ScenePlugin.setActive` now has a new optional `data` argument, which is passed to the target Scene and emitted in its 'pause' or 'resume' events.
* `TileSprite.tileScaleX` and `tileScaleY` are two new properties that allow you to control the scale of the texture within the Tile Sprite. This impacts the way the repeating texture is scaled, and is independent to scaling the Tile Sprite itself. It works in both Canvas and WebGL mode.
* `TransformMatrix.copyFrom` is a new method that will copy the given matrix into the values of the current one.
* `TransformMatrix.multiplyWithOffset` is a new method that will multiply the given matrix with the current one, factoring in an additional offset to the results. This is used internally by the renderer code in various places.
* `Rectangle.Intersection` will take two Rectangle objects and return the area of intersection between them. If there is no intersection, an empty Rectangle is returned.
* `Pointer.prevPosition` is a new Vector2 that stores the previous position of the Pointer, prior to the most recent DOM event. You can use this when performing calculations between the old and current positions, such as for tracking the pointer speed.
* `Pointer.getInterpolatedPosition` is a new method that will return an array of smoothly interpolated values between the old and previous position of the Pointer. You can configure how many interpolation steps should take place (the default is 10) and provide an output array to store them in. This method is handy if you've got an object tracking a pointer and you want to ensure it has smooth movement (as the DOM will often process pointer events at a faster rate than the game loop can update).
* `TransformMatrix.copyFromArray` will populate a matrix from the given array of values. Where 0, 1, 2, 3, 4 and 5 map to a, b, c, d, e and f.
* `WebGLPipeline` has a new over-rideable method called `boot` which is called when the renderer and all core game systems have finished being set-up.
* `KeyboardPlugin.checkDown` is a new method that allows you to check if a Key is being pressed down or not in an update loop. The difference between this method and checking the `Key.isDown` property directly is that you can provide a duration to this method. For example, if you wanted a key press to fire a bullet, but you only wanted it to be able to fire every 100ms, then you can call this method with a `duration` of 100 and it will only return `true` every 100ms.

### Updates

* DataManager.removeValue (and by extension the `remove` method too) will not emit the parent of the DataManager as the 2nd argument in the `removedata` event, to keep it consistent with the set events (thanks @rexrainbow)
* The docs for the Loader `filecomplete` event said that you could listen for a specific file using its type and key, i.e.: `filecomplete-image-monster`, however, the code used an underscore instead of a hyphen. We feel the hyphen looks cleaner, so the Loader code has been updated, meaning you can now use the hyphen version of the event properly (thanks @NokFrt)
* If a Game Object is already being dragged, it cannot be dragged by another pointer (in multi-touch mode) until the original pointer has released it (thanks @rexrainbow)
* Calling `Tween.play` on a tween created via `TweenManager.create` wouldn't actually start playback until the tween was first added to the Tween Manager. Now, calling `play` will have it automatically add itself to the Tween Manager if it's not already in there. Fix #3763 (thanks @pantoninho)
* If the Blitter object has no Bobs to render it will now abort immediately, avoiding several context calls in Canvas mode.
* `Scene.run` will now pass the optional `data` object in all cases, no matter if it's waking, resuming or starting a Scene (thanks @rook2pawn)
* `ScenePlugin.start` and `ScenePlugin.restart` will now always queue the op with the Scene Manager, regardless of the state of the Scene, in order to avoid issues where plugins carry on running for a frame before closing down. Fix #3776 (thanks @jjalonso)
* `Tileset.glTexture` is a new property that maps to the WebGL Texture for the Tileset image. It's used internally by the renderer to avoid expensive object look-ups and is set automatically in the `Tileset.setImage` method.
* `Frame.glTexture` is a new property that maps to the WebGL Texture for the Frames Texture Source image. It's used internally by the renderer to avoid expensive object look-ups and is set automatically in the `Frame` constructor.
* `TransformMatrix.e` and `TransformMatrix.f` are two new properties that are an alias for the `tx` and `ty` values.
* `Graphics.arc` has a new optional argument `overshoot`. This is a small value that is added onto the end of the `endAngle` and allows you to extend the arc further than the default 360 degrees. You may wish to do this if you're trying to draw an arc with an especially thick line stroke, to ensure there are no gaps. Fix #3798 (thanks @jjalonso)
* The TextureManager Sprite Sheet Parser will now throw a concise console warning if you specify invalid frame sizes that would result in no frames being generated (thanks @andygroff)
* The `Quad` Game Object now has a new `setFrame` method that allows you to change the frame being rendered by the Quad, including using frames that are part of a texture atlas. Fix #3161 (thanks @halgorithm)
* The `ScenePlugin` will now queue all of the following ops with the Scene Manager: `start`, `run`, `pause`, `resume`, `sleep`, `wake`, `switch` and `stop`. This means for all of these calls the Scene Manager will add the call into its queue and process it at the start of the next frame. This fixes #3812 and keeps things more predictable (thanks @Waclaw-I)
* `TransformMatrix.multiply` has a new optional argument `out` which is a matrix to store the multiplication results in. If not given it will act as before, multiplying the current matrix.
* `Zones` now have a NOOP `setAlpha` method, which allows them to be added into Containers (thanks @TadejZupancic)
* The `setPipeline` method now returns the instance of the Game Object on which it was called. It used to return the pipeline that was set, but this made it non-chainable which broke with the conventions set in all the other `set` methods. If you use `setPipeline` in your code anywhere to retrieve the pipeline reference, please use the `pipeline` property of the Game Object instead.

### Bug Fixes

* The DataManager `changedata` event was emitting the original value of the data instead of new value (thanks @iamchristopher) 
* The LoaderPlugin didn't emit the `filecomplete` event if any of files failed to load, causing it to fail to run the Scene `create` function as well. Fix #3750 (thanks @NokFrt)
* Fix setter calls in BuildGameObjectAnimation so it will now properly set the delay, repeat, repeat delay and yoyo of a config based animation (thanks @DannyT)
* The Arcade Body `blocked.none` property is now set to `false` after separation with static bodies or tiles. Previously, the blocked direction was set correctly, but the `none` remained `true` (thanks @samme)
* `Bob.setFrame` didn't actually set the frame on the Bob, now it does. Fix #3774 (thanks @NokFrt)
* `Bob.alpha` was ignored by the canvas renderer, only working in WebGL. This has now been fixed.
* Although the Blitter object had the Alpha component, setting it made no difference. Setting Blitter alpha now impacts the rendering of all children, in both Canvas and WebGL, and you can also specify an alpha per Bob as well.
* `SceneManager.run` would ignore scenes that are currently in the queue of scenes pending to be added. This has now been fixed so that the scene is queued to be started once it's ready (thanks @rook2pawn)
* `GameObject.disableInteractive` was toggling input. Every second call would turn the input back on (thanks @TadejZupancic)
* The position of the TilemapLayer wasn't taken into account when culling tiles for the Camera. It's now calculated as part of the cull flow (thanks @Upperfoot)
* Fix extra argument passing in Array.Each (thanks @samme)
* TileSprite was using the Size component instead of ComputedSize, meaning its `getBounds` and `displayWidth` and `displayHeight` results were incorrect. Fix #3789 (thanks @jjalonso)
* `ArrayUtils.AddAt` didn't calculate the array offset correctly if you passed an array in to be merged with an existing array. This also caused Container.addAt to fail if an array was passed to it. Fix #3788 (thanks @jjalonso)
* The `Pointer.camera` property would only be set if there was a viable Game Object in the camera view. Now it is set regardless, to always be the Camera the Pointer interacted with.
* Added the Mask component to Container. It worked without it, but this brings it in-line with the documentation and other Game Objects. Fix #3797 (thanks @zilbuz)
* The DataManager couldn't redefine previously removed properties. Fix #3803 (thanks @AleBles @oo7ph)
* The Canvas DrawImage function has been recoded entirely so it now correctly supports parent matrix and camera matrix calculations. This fixes an issue where children inside Containers would lose their rotation, and other issues, when in the Canvas Renderer. Fix #3728 (thanks @samid737)
* `clearMask(true)` would throw an exception if the Game Object didn't have a mask. Now it checks first before destroying the mask. Fix #3809 (thanks @NokFrt)
* In the WebGL `GeometryMask` the stencil has been changed from `INVERT` to `KEEP` in order to fix issues when masking Graphics objects and other complex objects. Fix #3807. This also fixes the issue where children in Containers would display incorrectly outside of a Geometry mask. Fix #3746 (thanks @zilbuz @oklar)
* `BitmapMask.destroy` will now remove the textures and framebuffers that it created from the WebGL Renderer as part of the destroy process. Fix #3771 (thanks @nunof07)

### Examples, Documentation and TypeScript

My thanks to the following for helping with the Phaser 3 Examples, Docs and TypeScript definitions, either by reporting errors, fixing them or helping author the docs:

@DannyT @squilibob @dvdbrink @t1gu1 @cyantree @DrevanTonder @mikewesthad @tarsupin @shadowofsoul

Also, a special mention to @andygroff for his excellent work enhancing the search box on the examples site, and @hexus for his assistance completing the documentation for the Game Objects.

## Version 3.10.1 - Hayashi - 13th June 2018

### Bug Fixes

* The InputManager would only create 1 Pointer, even if Touch input was enabled in the config, which meant you couldn't use touch events unless you first called `addPointer` or specified one in the config. Now, it Touch is enabled in the config, it'll always create 2 pointers by default.

## Version 3.10.0 - Hayashi - 13th June 2018

### Input System New Features + Updates

* All Input classes are now covered 100% by JSDocs.
* The Input Manager and Input Plugin have been updated to support multiple simultaneous Pointers. Before, only one active pointer (mouse or touch) was supported. Now, you can have as many active pointers as you need, allowing for complex multi-touch games. These are stored in the Input Manager `pointers` array.
* `addPointer` allows you to add one, or more, new pointers to the Input Manager. There is no hard-coded limit to the amount you can have, although realistically you should never need more than 10. This method is available on both the Input Manager and Plugin, allowing you to use `this.input.addPointer` from within your game code.
* InputManager `pointersTotal` contains the total number of active pointers, which can be set in the Game Config using the `input.activePointers` property. Phaser will create 2 pointers on start unless a different value is given in the config, or you can add them at run-time.
* `mousePointer` is a new property that is specifically allocated for mouse use only. This is perfect for desktop only games but should be ignored if you're creating a mouse + touch game (use activePointer instead).
* `activePointer` will now reflect the most recently active pointer on the game, which is considered as being the pointer to have interacted with the game canvas most recently.
* The InputManager and InputPlugin have three new methods: `addUpCallback`, `addDownCallback` and `addMoveCallback`. These methods allow you to add callbacks to be invoked whenever native DOM mouse or touch events are received. Callbacks passed to this method are invoked _immediately_ when the DOM event happens, within the scope of the DOM event handler. Therefore, they are considered as 'native' from the perspective of the browser. This means they can be used for tasks such as opening new browser windows, or anything which explicitly requires user input to activate. However, as a result of this, they come with their own risks, and as such should not be used for general game input, but instead be reserved for special circumstances. The callbacks can be set as `isOnce` so you can control if the callback is called once then removed, or every time the DOM event occurs.
* Pointer has two new properties `worldX` and `worldY` which contain the  position of the Pointer, translated into the coordinate space of the most recent Camera it interacted with.
* When checking to see if a Pointer has interacted with any objects it will now iterate through the Camera list. Previously, it would only check against the top-most Camera in the list, but now if the top-most camera doesn't return anything, it will move to the next camera and so on. This also addresses #3631 (thanks @samid737)
* `InputManager.dirty` is a new internal property that reflects if any of the Pointers have updated this frame.
* `InputManager.update` now uses constants internally for the event type checking, rather than string-based like before.
* `InputManager.startPointer` is a new internal method, called automatically by the update loop, that handles touch start events.
* `InputManager.updatePointer` is a new internal method, called automatically by the update loop, that handles touch move events.
* `InputManager.stopPointer` is a new internal method, called automatically by the update loop, that handles touch end events.
* `InputManager.hitTest` has had its arguments changed. It no longer takes x/y properties as the first two arguments, but instead takes a Pointer object (from which the x/y coordinates are extracted).
* `TouchManager.handler` has been removed as it's no longer used internally.
* `TouchManager.onTouchStart`, `onTouchMove` and `onTouchEnd` are the new DOM Touch Event handlers. They pass the events on to the InputManagers `queueTouchStart`, `queueTouchMove` and `queueTouchEnd` methods respectively.
* `MouseManager.handler` has been removed as it's no longer used internally.
* `MouseManager.onMouseDown`, `onMouseMove` and `onMouseUp` are the new DOM Mouse Event handlers. They pass the events on to the InputManagers `queueMouseDown`, `queueMouseMove` and `queueMouseUp` methods respectively.
* Setting `enabled` to false on either the TouchManager, MouseManager or KeyboardManager will prevent it from handling any native DOM events until you set it back again.
* InputPlugin has the following new read-only properties: `mousePointer`, `pointer1`, `pointer2`, `pointer3`, `pointer4`, `pointer5`, `pointer6`, `pointer7`, `pointer8`, `pointer9` and `pointer10`. Most of these will be undefined unless you call `addPointer` first, or set the active pointers quantity in your Game Config.
* InputManager has a new method `transformPointer` which will set the transformed x and y properties of a Pointer in one call, rather than the 2 calls it took before. This is now used by all Pointer event handlers.
* InputPlugin has a new method `makePixelPerfect` which allows you to specify a texture-based Game Object as being pixel perfect when performing all input checks against it. You use it like this: `this.add.sprite(x, y, key).setInteractive(this.input.makePixelPerfect())`, or the easier: `setInteractive({ pixelPerfect: true })` - you can also pass or set an optional alpha tolerance level. See the method docs for full details and the new examples to see it in action. Note that as a pointer interacts with the Game Object it will constantly poll the texture, extracting a single pixel from the given coordinates and checking its color values. This is an expensive process, so should only be enabled on Game Objects that really need it.

### Input - Custom Cursors

* You can now set a custom cursor for your game via `this.input.setDefaultCursor()`. This will take any valid CSS cursor string, including URLs to cursor image files.
* You can now set a custom cursor for specific Game Objects. This will take any valid CSS cursor string, including URLs to cursor image files, and is used when-ever a pointer is over that Game Object. For example, to have a hand cursor appear when over a button Sprite, you can do: `button.input.cursor = 'pointer'`, or to have a help cursor appear: `button.input.cursor = 'help'`, or to have a custom image: `button.input.cursor = 'url(assets/cursors/sword.cur), pointer'`.
* You can also set a custom cursor in the new Input Configuration Object. To use the `pointer` (hand cursor) there is a new short-cut: `setInteractive({ useHandCursor: true })`. To use anything else: `setInteractive({ cursor: CSSString })` where `CSSString` is any valid CSS for setting a cursor.
* Please be aware of limitations when it comes to image based cursors between browsers. It's up to you to find a suitable format and size that fits the browsers you wish to support (note: virtually all modern browsers no longer support animated CSS cursors.)

### Input - Configuration Objects

* The `setInteractive` method can now take an Input Configuration object as its only argument. This allows you to set multiple input related properties in a single call, i.e.: `setInteractive({ draggable: true, pixelPerfect: true })`. The available properties are:
* `hitArea` - The object / shape to use as the Hit Area. If not given it will try to create a Rectangle based on the texture frame.
* `hitAreaCallback` - The callback that determines if the pointer is within the Hit Area shape or not.
* `draggable` - If `true` the Interactive Object will be set to be draggable and emit drag events.
* `dropZone` - If `true` the Interactive Object will be set to be a drop zone for draggable objects.
* `useHandCursor` - If `true` the Interactive Object will set the `pointer` hand cursor when a pointer is over it. This is a short-cut for setting `cursor: 'pointer'`.
* `cursor` - The CSS string to be used when the cursor is over this Interactive Object.
* `pixelPerfect` - If `true` the a pixel perfect function will be set for the hit area callback. Only works with texture based Game Objects.
* `alphaTolerance` - If `pixelPerfect` is set, this is the alpha tolerance threshold value used in the callback.

### Input - Keyboard Manager Updates

* The `KeyboardManager` class has been removed. It has been replaced with `KeyboardPlugin` which is now an Input level plugin, that registers itself with the new `InputPluginCache`. The Input Plugin class (which belongs to a Scene) will now automatically inject registered plugins into itself on boot. Every Scene has its own instance of the Input Plugin (if enabled in the scene plugins), which in turn has its own instance of the KeyboardPlugin. The `InputManager` no longer has any reference to the Keyboard class at all. The benefits of this are two-fold: First, it allows you to now entirely exclude all of the keyboard classes from a custom build, saving a lot of space if not required. Secondly, it means that the Scenes themselves are now responsible for keyboard events, where-as before they were entirely global. This means a Scene can be paused and stop processing keyboard events, and stop having its Key objects updated, while another Scene can still carry on doing this. It also prevents key related callbacks in sleeping Scenes from being fired (which resolves issue #3733, thanks @JoeMoov2)
* `KeyboardManager.handler` has been renamed to `onKeyHandler`.
* The `KeyboardManager.captures` property has been removed as it can be more effectively handled by polling the `keys` object instead.
* The Keyboard Manager will no longer process key down or up events if its `enabled` property is set to false, or if the Scene to which it belongs is not active.
* The Keyboard Manager will now call `event.preventDefault` on the native DOM event as long as the Key exists in the keys array and has its `preventDefault` property set to `true` (which is the default). This means you can now control specifically which key prevents default on the browser, where-as before every key added did so.
* KeyboardManager `addKeyCapture` and `removeKeyCapture` have been removed as you now control which keys prevent capture by using the `addKey` or `addKeys` methods (see entry above). The act of creating a Key is now enough to enable capture of it and can be toggled (at run-time) on a per-Key basis.
* `KeyboardManager.addKeys` can now take either an object, or key codes, or a comma-separated string as its input. This means you can now do: `keyboard.addKeys('W,S,A,D')` and get an object back with the properties WSAD mapped to the relevant Key objects.
* `KeyboardManager.addKey` can now take either a Key object, a string, such as `A` or `SPACE`, or a key code value.
* `KeyboardManager.removeKey` can now take either a Key object, a string, such as `A` or `SPACE`, or a key code value.

### Input - Gamepad Manager Updates

* The `GamepadManager` class has been removed. It has been replaced with `GamepadPlugin` which is now an Input level plugin, that registers itself with the new `InputPluginCache`. The Input Plugin class (which belongs to a Scene) will now automatically inject the registered plugins into itself on boot. Every Scene has its own instance of the Input Plugin (if enabled in the scene plugins), which in turn has its own instance of the GamepadPlugin. The `InputManager` no longer has any reference to the Gamepad class at all. The benefits of this are two-fold: First, it allows you to now entirely exclude all of the gamepad classes from a custom build, saving a lot of space if not required. Secondly, it means that the Scenes themselves are now responsible for gamepad events, where-as before they were entirely global. This means a Scene can be paused and stop processing gamepad events, and stop having its Gamepad objects updated, while another Scene can still carry on doing this. It also prevents gamepad related callbacks in sleeping Scenes from being fired.
* The Gamepad Plugin has been rewritten from scratch. It now offers a lot more features and far easier access to the Gamepads and their properties. You can now access the first 4 gamepads connected to the browser via the `pad1` to `pad4` properties, meaning you can do: `this.input.gamepad.pad1` for direct access to a pad once it's connected.
* The Gamepad class has also been rewritten from scratch. It will no longer create Buttons or Axes dynamically, instead doing so on instantiation.
* The Gamepad class now has a bunch of new properties for easy access to the various standard mapping buttons. These include `left`, `right`, `up`, `down` for directions, `A`, `Y`, `X` and `B` for buttons, `L1`, `L2`, `R1` and `R2` for shoulder buttons, and `leftStick` and `rightStick` for the axis sticks. You can still use `Gamepad.getButtonValue()` to get the value from a button and `Gamepad.getButtonTotal()` to get the total number of buttons available on the pad.
* `Gamepad.getAxisTotal` and `Gamepad.getAxisValue` will return the total number of axis, and an axis value, accordingly.
* `Gamepad.setAxisThreshold` will now let you set the threshold across all axis of a Gamepad in one call.
* The Gamepad `Button` objects will now emit 2 events, one from the button itself and another from the Gamepad. This means you can listen for button events in 3 ways: 1) By directly polling the button value in an update loop, 2) Listening for events on the Gamepad Plugin: `this.input.gamepad.on('down')`, or 3) By listening for events on the Gamepad itself: `gamepadReference.on('down')`.

### Arcade Physics New Features + Updates

* Arcade Physics now uses a fixed time-step for all internal calculations. There is a new `fps` config value and property (defaults to 60fps), which you can change at run-time using the `setFPS` method. The core update loop has been recoded so that it steps based entirely on the given frame rate, and not the wall-clock or game step delta. This fixed time step allows for a straightforward implementation of a deterministic game state. Meaning you can now set the fps rate to a high value such as 240, regardless of the browser update speed (it will simply perform more physics steps per game step). This is handy if you want to increase the accuracy of the simulation in certain cases.
* You can also optionally call the `step` function directly, to manually advance the simulation.
* There is a new property `timeScale` which will scale all time-step calculations at run-time, allowing you to speed-up or slow-down your simulation at will, without adjusting the frame rate.
* You can now disable the use of the RTree for dynamic bodies via the config property `useTree`. In certain situations, i.e. densely packed worlds, this may give better performance. Static bodies will always use an RTree.
* `collideSpriteVsGroup` has been rewritten. If you are using an RTree it now uses the results directly from the tree search, instead of iterating all children in the Group, which dramatically reduces the work it does. If you have disabled the RTree it performs a brute-force O(N2) Sprite vs. Group iteration sweep. We tested multiple axis sorting variants but the cost of the array allocation and/or sorting, with large amounts of bodies (10,000+), far outweighed the simple math involved in the separation logic.
* `Body.useDamping` is a new boolean property that allows you to use a damping effect for drag, rather than the default linear deceleration. This gives much better results if you need smooth deceleration across both axis, such as the way the ship slows down in the game Asteroids, without the tell-tale axis drift associated with linear drag.
* `GetOverlapX` and `GetOverlapY` now use the calculated delta values, not the deltaX/Y methods.
* `collideSpriteVsGroup` aborts early if the Sprite body has been disabled.
* `updateMotion` has a new argument `delta` which should typically be a fixed-time delta value.
* `intersects` has been restructured to prioritize rect vs. rect checks.
* Body `update` and `postUpdate` have been recoded to handle the new fixed time-step system in place. `update` now takes a new argument, delta, which is used internally for calculations.
* `Body.dirty` has been removed as a property as it's no longer used internally.
* `Body.deltaAbsX` and `deltaAbsY` now return the cached absolute delta value from the previous update, and no longer calculate it during the actual call.
* `World.enable` has been recoded to remove all the `hasOwnProperty` checks and streamline the internal flow.
* `World.disable` has been recoded to remove all the `hasOwnProperty` checks and streamline the internal flow.
* `World.add` is a new method that adds an existing body to the simulation and `enableBody` now passes its newly created bodies to this method.
* `World.disableGameObjectBody` has been removed as it duplicated what the `disable` method did.
* There is a new internal flow with regard to the creation and disabling of bodies. Calling `World.enable` will pass the objects to `enableBody`, which will create a new Body object, if required, and finally pass it to `add`. `World.disable` does the same, but removes the bodies from the simulation. It passes the bodies to `disableBody`, which in turn passes it to `remove`. Both of these work for single objects, an array of objects, Groups or even arrays of Groups.
* `World.computeAngularVelocity` is a new method that specifically calculates the angular velocity of a Body.
* `World.computeVelocity` has had its signature changed. Rather than taking a bunch of arguments all it now takes is a Body and a delta value. Internally it now calculates both the x and y velocity components together in the same single call, where-as before it was split into two calls and multiple assignments.
* `World.computeVelocity` no longer returns the new velocities, they are now set directly on the body within the method.
* `World.computeVelocity` has been recoded to use Fuzzy Greater Than and Less Than calls when applying drag to a previously accelerated body. Using a fuzzy epsilon allows us to mitigate the ping-pong issue, where a decelerating body would constantly flip between a small negative and positive velocity value and never come to an actual rest.
* `World.computeVelocity` now checks the `Body.useDamping` property to perform either linear deceleration or damping on the Body.
* `World.updateMotion` has changed to call the new `computeAngularVelocity` and `computeVelocity` methods.
* Bodies set to bounce would eventually run out of velocity and stop. This has been fixed as part of the refactoring of the time step and compute velocity updates. Fix #3593 (thanks @helmi77)
* If a Body collides with a Static Body it will now set the `blocked` properties accordingly (before it only set the `touching` properties.) This means you can now use checks like `Body.onFloor()` when traversing static bodies (thanks @fariazz)

### Data Manager New Features and Updates

* You can now access anything set in the DataManager using the new `values` property. For example, if you set a new value such as this: `data.set('gold', 50)` you can now access it via: `data.values.gold`, where it is treated as a normal property, allowing you to use it in conditional evaluations `if (data.values.level === 2)`, or modify it: `data.values.gold += 50`.
* Each time a value is updated it emits a `changedata` event, regardless if it is changed via the `set` method, or the new `values` approach.
* Each time a value is updated it emits a new event named after the value. For example, if the value was called `PlayerLives`, it will emit the event `changedata_PlayerLives`. This happens regardless if it is changed via the `set` method, or the new `values` approach.
* The `set` method can now take an object containing key value pairs as the first argument. This means you can now set a bunch of values all at once, i.e: `data.set({ name: 'Red Gem Stone', level: 2, owner: 'Link', gold: 50 })`.
* The `get` method can now take an array of keys, and will return an array of matching values. This is handy for array destructuring in ES6.
* The `remove` method can now take an array of keys, and will remove all matching values, emitting the `removedata` event for each.
* The order of events has been updated. When a value is first set, and doesn't already exist in the Data Manager, it will emit a `setdata` event. If a value is set that already exists, it instead emits a `changedata` and related `changedata_key` event. Setting a new value no longer emits both events.
* The `resetFunction` function has been removed from the `changedata` event arguments. Previously this was used to allow you to stop a value being updated by calling the reset function instead. However, it created brand new anonymous functions every single time a value was updated. As you can now access stored data via the `values` property you can use this for much easier conditional checks and sets.
* The `blockSet` property has been removed as it's no longer used internally.

### Loader and Scene Updates

* Internally, the Loader has changed slightly. Rather than have each file cause the new batch to load, an `update` method is polled every frame, which does the same job instead. This avoids load-time race conditions where pre-populated files would trigger loads part way during an existing load, fixing #3705 in the process (thanks @the-simian)
* The Scene Manager has been updated so that it will call Scene.Systems.step during the `init`, `preload` and `create` phase of your Scene. This means that any plugins, or custom code, written to use the Scene Systems `preupdate`, `update` or `postupdate` events will need to be aware that these are now fired from `init` onwards, not just once `create` has finished.
* As a result of these two changes, there is a new Systems property called `sceneUpdate`, which is a reference that maps to your `Scene.update` function. During `init`, `preload` and `create` this is always mapped to NOOP. Once `create` has finished it gets re-mapped to your Scene's update function. If your Scene doesn't have one, it remains mapped to NOOP. In practise, this means nothing has changed from before. `Scene.update` never ran until `create` was completed, and it still doesn't. However, because the internal Scene systems are now updating right from `init`, it means that things like the update list and physics systems are fully operational _during_ your Preloader. This allows you to create far more elaborate preloaders than ever before. Although, with great power comes great responsibility, as the onus is now on you to be careful which events you consume (especially input events) during your preloader.
* Another side-effect of these changes is that Scenes no longer need an 'update' function at all. Previously, if they were missing one, the Scene Manager would inject one into them automatically. It no longer does this.

### New Features

* `RenderTexture.resize` will allow you to resize the underlying Render Texture to the new dimensions given. Doing this also clears the Render Texture at the same time (thanks @saqsun).
* `Rectangle.RandomOutside` is a new function that takes two Rectangles, `outer` and `inner`, and returns a random point that falls within the outer rectangle but is always outside of the inner rectangle.
* The Update List has a new read-only property `length`, making it consistent with the Display List (thanks @samme)
* The 2D Camera class has two new read-only properties `centerX` and `centerY` which return the coordinates of the center of the viewport, relative to the canvas (thanks @samme)
* Camera has a new property `visible`. An invisible Camera will skip rendering and input tests of everything it can see. This allows you to create say a mini-cam and then toggle it on and off without needing to re-create it each time.
* Camera has a new method `setVisible` which toggles its visible property.
* `CameraManager.fromJSON` will now set the visible property is defined in the config.
* `ScenePlugin.run` is a new method that will run the given Scene and not change the state of the current Scene at all. If the scene is asleep, it will be woken. If it's paused, it will be resumed. If not running at all, it will be started.
* `TextureManager.getPixelAlpha` is a new method that will return the alpha value of a pixel from the given texture and frame. It will return `null` if the coordinates were out of bounds, otherwise a value between 0 and 255.
* `Game.isOver` is a new read-only boolean property that indicates if the mouse pointer is currently over the game canvas or not. It is set by the VisibilityHandler and is only reliable on desktop systems.
* A new event `Game.mouseout` is dispatched if the mouse leaves the game canvas. You can listen to it from `this.sys.game.events.on('mouseout')` from within a Scene.
* A new event `Game.mouseover` is dispatched if the mouse enters the game canvas, having previously been outside of it. You can listen to it from `this.sys.game.events.on('mouseover')` from within a Scene.
* You can now use PhysicsEditor (https://www.codeandweb.com/physicseditor) to create complex Matter.js bodies. Load them as normal JSON and then just pass it to the Matter Sprite as a shape property: `this.matter.add.sprite(x, y, texture, frame, { shape: shapes.banana })` (where `shapes.banana` is one of the exported PhysicsEditor shapes in the JSON you loaded). See the 'physics/matterjs/advanced shape creation.js' example for more details.

### Updates

* The `ForwardDiffuseLightPipeline`, used by the Lights system, now sets a flag if the Scene doesn't contain any lights. All of the Game Objects now check this flag and don't even bother adding themselves to the batch if there are no lights in the Scene, as they'd never render anyway. This also avoids the ghost-image problem if you swap Scenes to a new Scene with the Light Manager enabled, but no actual lights defined. Fix #3707 (thanks @samvieten).
* `CameraManager.getCameraBelowPointer` has been renamed to `getCamerasBelowPointer` and it now returns an array of all the cameras below the given pointer, not just the top-most one. The array is sorted so that the top-most camera is at the start of the array.
* In `TimeStep.step` the `rawDelta` and `delta` values are checked to make sure they are non-negative, which can happen in Chrome when the delta is reset and out of sync with the value passed to Request Animation Frame. Fix #3088 (thanks @Antriel)
* `Cameras.Controls.Fixed` has been removed. It's was deprecated a few versions ago. Please use `FixedKeyControl` instead.
* `Cameras.Controls.Smoothed` has been removed. It's was deprecated a few versions ago. Please use `SmoothedKeyControl` instead.

### Bug Fixes

* The Canvas `RenderTexture.drawImage` method incorrectly set the values of the frame, causing them to appear wrongly scaled in the canvas renderer. Fix #3710 (thanks @saqsun).
* Fixed `Math.Matrix4.makeRotationAxis()` (thanks @hexus)
* Fixed an incorrect usage of `Math.abs()` in `Math.Quaternion.calculateW()` (thanks @qxzkjp).
* Particle Emitter Managers can now be added to Containers (thanks @TadejZupancic)
* Fixed a method signature issue with the Animation component's `remove()` handler when `Animation`s are removed from the `AnimationManager`. This prevented removed animations from stopping correctly.
* If you set Phaser to use a pre-existing Canvas element it is no longer re-added to the DOM (thanks @NQNStudios)
* The `TweenManager.getTweensOf` method has been fixed to remove a potential endless loop should multiple targets be passed in to it (thanks @cyantree)
* Interactive Objects inside of Containers would still fire their input events even if the Container (or any ancestor) was set to be invisible. Objects now check their ancestor tree during the input cull and now properly skip input events if not visible. Fix #3620 (thanks @NemoStein)
* Fixed Device.os incorrectly reporting Linux as OS on Android devices (thanks @AleBles)

### Examples, Documentation and TypeScript

Thanks to the work of @hexus we have now documented all of the Math namespace and made good progress on the Game Objects.

I personally have also documented the entire Input system, which was 328 classes, properties and methods to describe, as well as lots of other areas.

## Version 3.9.0 - Yui - 24th May 2018

### New Features

* The command `npm run help` will display a friendly list of all the scripts available (run `npm install` first)
* Game has a new property `hasFocus` which is a read-only boolean that lets you know if the window the game is embedded in (including in an iframe) currently has focus or not.
* Game.Config has a new property `autoFocus`, which is `true` by default, and will automatically call `window.focus()` when the game starts.
* Clicking on the canvas will automatically call `window.focus`. This means in games that use keyboard controls if you tab or click away from the game, then click back on it again, the keys will carry on working (where-as before they would remain unfocused)
* Arcade Physics Body has a new method `setAllowDrag` which toggles the `allowDrag` property (thanks @samme)
* Arcade Physics Body has a new method `setAllowGravity` which toggles the `allowGravity` property (thanks @samme)
* Arcade Physics Body has a new method `setAllowRotation` which toggles the `allowRotation` property (thanks @samme)
* Arcade Physics Group Config has 3 new properties you can use: `allowDrag`, `allowGravity` and `allowRotation` (thanks @samme)
* PluginManager.registerFileType has a new property `addToScene` which allows you to inject the new file type into the LoaderPlugin of the given Scene. You could use this to add the file type into the Scene in which it was loaded.
* PluginManager.install has a new property `mapping`. This allows you to give a Global Plugin a property key, so that it is automatically injected into any Scenes as a Scene level instance. This allows you to have a single global plugin running in the PluginManager, that is injected into every Scene automatically.
* Camera.lerp has been implemented and allows you to specify the linear interpolation value used when following a target, to provide for smoothed camera tracking.
* Camera.setLerp is a chainable method to set the Camera.lerp property.
* Camera.followOffset is a new property that allows you to specify an offset from the target position that the camera is following (thanks @hermbit)
* Camera.setFollowOffset is a chainable method to set the Camera.followOffset property.
* Camera.startFollow has 4 new arguments: `lerpX` and `lerpY` which allow you to set the interpolation value used when following the target. The default is 1 (no interpolation) and `offsetX` and `offsetY` which allow you to set the follow offset values.
* Camera.startFollow will now immediately set the camera `scrollX` and `scrollY` values to be that of the target position to avoid a large initial lerps during the first few preUpdates.
* Math.Interpolation.SmoothStep is a new method that will return the smooth step interpolated value based on the given percentage and left and right edges.
* Math.Interpolation.SmootherStep is a new method that will return the smoother step interpolated value based on the given percentage and left and right edges.

### Updates

* Container.setInteractive can now be called without any arguments as long as you have called Container.setSize first (thanks rex)
* Bob.reset will now reset the position, frame, flip, visible and alpha values of the Bob.
* VisibilityHandler now takes a game instance as its sole argument, instead of an event emitter.
* PluginManager.createEntry is a new private method to create a plugin entry and return it. This avoids code duplication in several other methods, which now use this instead.
* The Plugin File Type has a new optional argument `mapping`, which allows a global plugin to be injected into a Scene as a reference.
* TileSprite.destroy has been renamed to `preDestroy` to take advantage of the preDestroy callback system.
* RenderTexture.destroy has been renamed to `preDestroy` to take advantage of the preDestroy callback system.
* Group.destroy now respects the `ignoreDestroy` property.
* Graphics.preDestroy now clears the command buffer array.
* Container addHandler will now remove a child's Scene shutdown listener and only listens to `destroy` once.
* Container removeHandler will re-instate a child's Scene shutdown listener.
* Container preDestroy now handles the pre-destroy calls, such as clearing the container.
* Blitter preDestroy will now clear the children List and renderList.
* The AudioContextMonkeyPatch has been updated to use an iife. Fix #3437 (thanks @NebSehemvi)

### Bug Fixes

* PluginManager.destroy didn't reference the plugin correctly, throwing an Uncaught TypeError if you tried to destroy a game instance. Fix #3668 (thanks @Telokis)
* If a Container and its child were both input enabled they will now be sorted correctly in the InputPlugin (thanks rex)
* Fix TypeError when colliding a Group as the only argument in Arcade Physics. Fix #3665 (thanks @samme)
* The Particle tint value was incorrectly calculated, causing the color channels to be inversed. Fix #3643 (thanks @rgk)
* All Game Objects that were in Containers were being destroyed twice when a Scene was shutdown. Although not required it still worked in most cases, except with TileSprites. TileSprites specifically have been hardened against this now but all Game Objects inside Containers now have a different event flow, stopping them from being destroyed twice (thanks @laptou @PaNaVTEC)
* Camera.cull will now accurately return only the Game Objects in the camera view, instead of them all. Fix #3646 (thanks @KingCosmic @Yora)
* The `dragend` event would be broadcast even if the drag distance or drag time thresholds were not met. Fix #3686 (thanks @RollinSafary)
* Restarting a Tween immediately after creating it, without it having first started, would cause it to get stuck permanently in the Tween Managers add queue (thanks @Antriel @zacharysarette)
* Setting an existing Game Object as a static Arcade Physics body would sometimes incorrectly pick-up the dimensions of the object, such as with TileSprites. Fix #3690 (thanks @fariazz)
* Interactive Objects were not fully removed from the Input Plugin when cleared, causing the internal list array to grow. Fix #3645 (thanks @tjb295 for the fix and @rexrainbow for the issue)
* Camera.shake would not effect dynamic tilemap layers. Fix #3669 (thanks @kainage)

### Examples, Documentation and TypeScript

Thanks to the work of @hexus we have now documented nearly all of the Math namespace. This is hundreds of functions now covered by full docs and is work we'll continue in the coming weeks.

My thanks to the following for helping with the Phaser 3 Examples, Docs and TypeScript definitions, either by reporting errors, fixing them or helping author the docs:

@mikez @wtravO @thomastanck

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
