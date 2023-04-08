# Phaser 3 Change Log

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
