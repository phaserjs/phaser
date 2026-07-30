# Phaser 3 Change Log

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
