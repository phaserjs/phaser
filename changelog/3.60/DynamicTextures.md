# Phaser 3.60.0 Change Log

Return to the [Change Log index](CHANGELOG-v3.60.md).

## New Feature - Dynamic Textures and Render Textures

![Dynamic Textures](images/dynamictextures.png)

A Dynamic Texture is a special texture that allows you to draw textures, frames and most kind of Game Objects directly to it.

You can take many complex objects and draw them to this one texture, which can then be used as the base texture for other Game Objects, such as Sprites. Should you then update this texture, all Game Objects using it will instantly be updated as well, reflecting the changes immediately.

It's a powerful way to generate dynamic textures at run-time that are WebGL friendly and don't invoke expensive GPU uploads on each change.

Before Phaser 3.60 this was known as a Render Texture. Dynamic Textures have been optimized and also offer the following new features and updates. All of these are also available to the new Render Texture, via the `texture` property:

* `DynamicTexture.getWebGLTexture` is a new method that will return the WebGL Texture that the Dynamic Texture is using. This is the same as the old `RenderTexture.glTexture` property.
* `TextureManager.addDynamicTexture(key, width, height)` is a new method that will create a Dynamic Texture and store it in the Texture Manager, available globally for use by any Game Object.
* Unlike the old Render Texture, Dynamic Texture extends the native `Phaser.Texture` class, meaning you can use it for any texture based object and also call all of the native Texture methods, such as the ability to add frames to it, use it as the backing source for a sprite sheet or atlas, and more.
* Dynamic Textures no longer create both Render Targets _and_ Canvas objects, only the one that they require based on the renderer. This means Render Textures and Dynamic Textures now use 50% less memory under WebGL and don't create Canvas DOM elements.
* You can now directly use a Dynamic Texture as the source for a Bitmap Mask.
* Game Objects that have a mask will now reflect this when drawn to a Dynamic Texture.
* `DynamicTexture.isDrawing` is a new boolean that allows you to tell if a batch draw has been started and is in process.
* `DynamicTexture.isSpriteTexture` is a new boolean that informs the texture if it is being used as a backing texture for Sprite Game Objects, or not. If it is (which is the default) then items drawn to the texture are automatically inversed. Doing this ensures that images drawn to the Render Texture are correctly inverted for rendering in WebGL. Not doing so can cause inverted frames. If you use this method, you must use it before drawing anything to the Render Texture. Fix #6057 #6017 (thanks @andymikulski @Grandnainconnu)
* `DynamicTexture.setIsSpriteTexture` is a new method that allows you to toggle the `isSpriteTexture` property in a chained manner.
* `DynamicTexture.renderTarget` is a new property that holds an instance of a RenderTarget under WebGL. This encompasses a framebuffer and backing texture, rather than having them split.
* `DynamicTexture.stamp` is a new method that takes a given texture key and then stamps it at the x/y coordinates provided. You can also pass in a config object that gives a lot more control, such as alpha, tint, angle, scale and origin of the stamp. This is a much cleaner way of stamping a texture to the DynamicTexture without having to first turn it into a Game Object.
* `DynamicTexture.repeat` is a new method that will take a given texture and draw it to the Dynamic Texture as a fill-pattern. You can control the offset, width, height, alpha and tint of the draw (thanks xlapiz)
* `batchGameObject` now splits based on the renderer, allowing us to combine lots of the rendering code together, saving space.
* The `snapshot` and `snapshotPixel` methods now use the `snapshotArea` method to reduce code and filesize.
* The `snapshotPixel` function, used by the Canvas and WebGL Renderers and the RenderTexture would mistakenly divide the alpha value. These values now return correctly (thanks @samme)
* `DynamicTexture.batchTextureFrame` will now skip the `drawImage` call in canvas if the frame width or height are zero. Fix #5951 (thanks @Hoshinokoe)
* Using `DynamicTexture.fill` in CANVAS mode only would produce a nearly always black color due to float conversion (thanks @andymikulski)
* Using `DynamicTexture.fill` in CANVAS mode only, after using the `erase` method, wouldn't reset the global composite operation correctly, resulting in fills. Fix #6124 (thanks @mateuszkmiecik)
* Drawing a frame via `draw`, `drawFrame` or `batchDrawFrame` and specifying a `tint` value would inverse the Red and Blue channels. These are now handled properly. Fix #5509 (thanks @anthonygood)
* Drawing Game Objects to a Render Texture in WebGL would skip their blend modes. This is now applied correctly. Fix #5565 #5996 (thanks @sjb933 @danarcher)

Due to the creation of the Dynamic Texture class, we have completely revamped the old Render Texture Game Object. This is now a combination of a Dynamic Texture and an Image Game Object, that uses the Dynamic Texture to display itself with.

In versions of Phaser before 3.60 a Render Texture was the only way you could create a texture like this, that had the ability to be drawn on. But in 3.60 we split the core functions out to the Dynamic Texture class as it made a lot more sense for them to reside in there. As a result, the Render Texture is now a light-weight shim that sits on-top of an Image Game Object and offers proxy methods to the features available from a Dynamic Texture.

Render Texture breaking changes:

* Render Textures used to be able to take `key` and `frame` arguments in their constructors, which would take the texture from the Texture Manager and use that instance, instead of creating a new one. Because Dynamic Textures are always stored in the Texture Manager from the beginning, there is no need to specify these arguments. You can just get it from the Texture Manager by using its key.

* The following `RenderTexture` properties have changed:

* `renderer` is now available via `texture.renderer`.
* `textureManager` has been removed.
* `globalTint` has been removed.
* `globalAlpha` has been removed.
* `canvas` is now available via `texture.canvas`.
* `context` is now available via `texture.context`.
* `dirty` is now available via `texture.dirty`.
* `camera` is now available via `texture.camera`.
* `renderTarget` is now available via `texture.renderTarget`.
* `origin` is now (0.5, 0.5) by default instead of (0, 0).

* The following `RenderTexture` methods have changed:

* `drawGameObject` has been removed, this is now handled by the batch methods.
* `resize` has been renamed. Use `setSize(width, height)` instead.
* `setGlobalTint` has been removed as it's no longer used internally.
* `setGlobalAlpha` has been removed as it's no longer used internally.
* `batchGameObjectWebGL` has been removed, now handled by `batchGameObject`.
* `batchGameObjectCanvas` has been removed, now handled by `batchGameObject`.

**When should you use a Render Texture vs. a Dynamic Texture?**

You should use a Dynamic Texture if the texture is going to be used by multiple Game Objects, or you want to use it across multiple Scenes, because textures are globally stored.

You should use a Dynamic Texture if the texture isn't going to be displayed in-game, but is instead going to be used for something like a mask or shader.

You should use a Render Texture if you need to display the texture in-game on a single Game Object, as it provides the convenience of wrapping an Image and Dynamic Texture together for you.

---------------------------------------

Return to the [Change Log index](CHANGELOG-v3.60.md).

📖 Read the [Phaser 3 API Docs](https://newdocs.phaser.io/) 💻 Browse 2000+ [Code Examples](https://labs.phaser.io) 🤝 Join the awesome [Phaser Discord](https://discord.gg/phaser)
