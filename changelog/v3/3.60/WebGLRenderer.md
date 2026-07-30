# Phaser 3.60.0 Change Log

Return to the [Change Log index](CHANGELOG-v3.60.md).

## WebGL Renderer Updates

Due to all of the changes with how WebGL texture batching works a lot of mostly internal methods and properties have been removed. This is the complete list:

* The `WebGLRenderer.currentActiveTexture` property has been removed.
* The `WebGLRenderer.startActiveTexture` property has been removed.
* The `WebGLRenderer.tempTextures` property has been removed.
* The `WebGLRenderer.textureZero` property has been removed.
* The `WebGLRenderer.normalTexture` property has been removed.
* The `WebGLRenderer.textueFlush` property has been removed.
* The `WebGLRenderer.isTextureClean` property has been removed.
* The `WebGLRenderer.setBlankTexture` method has been removed.
* The `WebGLRenderer.setTextureSource` method has been removed.
* The `WebGLRenderer.isNewNormalMap` method has been removed.
* The `WebGLRenderer.setTextureZero` method has been removed.
* The `WebGLRenderer.clearTextureZero` method has been removed.
* The `WebGLRenderer.setNormalMap` method has been removed.
* The `WebGLRenderer.clearNormalMap` method has been removed.
* The `WebGLRenderer.unbindTextures` method has been removed.
* The `WebGLRenderer.resetTextures` method has been removed.
* The `WebGLRenderer.setTexture2D` method has been removed.
* The `WebGLRenderer.pushFramebuffer` method has had the `resetTextures` argument removed.
* The `WebGLRenderer.setFramebuffer` method has had the `resetTextures` argument removed.
* The `WebGLRenderer.popFramebuffer` method has had the `resetTextures` argument removed.
* The `WebGLRenderer.deleteTexture` method has had the `reset` argument removed.
* The `Textures.TextureSource.glIndex` property has been removed.
* The `Textures.TextureSource.glIndexCounter` property has been removed.

Previously, `WebGLRenderer.whiteTexture` and `WebGLRenderer.blankTexture` had a data-type of `WebGLTexture` but they were actually `Phaser.Textures.Frame` instances. This has now been corrected and the two properties are now actually `WebGLTexture` instances, not Frames. If your code relies on this mistake being present, please adapt it.

* The `RenderTarget` class will now create a Framebuffer that includes a Depth Stencil Buffer attachment by default. Previously, it didn't. By attaching a stencil buffer it allows things like Geometry Masks to work in combination with Post FX and other Pipelines. Fix #5802 (thanks @mijinc0)
* When calling `PipelineManager.clear` and `rebind` it will now check if the vao extension is available, and if so, it'll bind a null vertex array. This helps clean-up from 3rd party libs that don't do this directly, such as ThreeJS.
* The `mipmapFilter` property in the Game Config now defaults to '' (an empty string) instead of 'LINEAR'. The WebGLRenderer has been updated so that it will no longer create mipmaps at all with a default config. This potential saves a lot of VRAM (if your game has a lot of power-of-two textures) where before it was creating mipmaps that may never have been used. However, you may notice scaling doesn't look as crisp as it did before if you were using this feature without knowing it. To get it back, just add `mipmapFilter: 'LINEAR'` to your game config. Remember, as this is WebGL1 it _only_ works with power-of-two sized textures.
* `WebGLPipeline.vertexAvailable` is a new method that returns the number of vertices that can be added to the current batch before it will trigger a flush.
* `UtilityPipeline.blitFrame` has a new optional boolean parameter `flipY` which, if set, will invert the source Render Target while drawing it to the destination Render Target.
* `WebGLPipeline.setBoolean` is a new method that allows you to set a boolean uniform on a shader.
* If the WebGL Renderer logs an error, it will now show the error string, or the code if not present in the error map (thanks @zpxp)

### Mobile Pipeline

* The Mobile Pipeline is a new pipeline that extends the Multi Tint pipeline, but uses customized shaders and a single-bound texture specifically for mobile GPUs. This should restore mobile performance back to the levels it was around v3.22, before Multi Tint improved it all for desktop at the expense of mobile.
* `shaders/Mobile.vert` and `shaders/Mobile.frag` are the two shaders used for the Mobile Pipeline.
* `PipelineManager#MOBILE_PIPELINE` is a new constant-style reference to the Mobile Pipeline instance.
* `autoMobilePipeline` is a new Game Configuration boolean that toggles if the Mobile Pipeline should be automatically deployed, or not. By default it is enabled, but you can set it to `false` to force use of the Multi Tint pipeline (or if you need more advanced conditions to check when to enable it)
* `defaultPipeline` is a new Game Configuration property that allows you to set the default Game Object Pipeline. This is set to Multi Tint as standard, but you can set it to your own pipeline from this value.
* `PipelineManager.default` is a new propery that is used by most Game Objects to determine which pipeline they will init with.
* `PipelineManager.setDefaultPipeline` is a new method that allows you to change the default Game Object pipeline. You could use this to allow for more fine-grained conditional control over when to use Multi or Mobile (or another pipeline)
* The `PipelineManager.boot` method is now passed the default pipeline and auto mobile setting from the Game Config.

### Multi Tint Pipeline

* The `batchLine` method in the Multi Pipeline will now check to see if the dxdy len is zero, and if so, it will abort drawing the line. This fixes issues on older Android devices, such as the Samsung Galaxy S6 or Kindle 7, where it would draw erroneous lines leading up to the top-left of the canvas under WebGL when rendering a stroked rounded rectangle. Fix #5429 (thanks @fkoch-tgm @sreadixl)
* The `Multi.frag` shader now uses a `highp` precision, or `mediump` if the device doesn't support it (thanks @arbassic)
* The `WebGL.Utils.checkShaderMax` function will no longer use a massive if/else glsl shader check and will instead rely on the value given in `gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS)`.
* The internal WebGL Utils function `GenerateSrc` has been removed as it's no longer required internally.
* Previously, the Multi Tint methods `batchSprite`, `batchTexture`, `batchTextureFrame` and `batchFillRect` would all make heavy use of the `TransformMatrix.getXRound` and `getYRound` methods, which in turn called `getX` and `getY` and applied optional rounding to them. This is all now handled by one single function (`setQuad`) with no branching, meaning rendering one single sprite has cut down 16 function calls and 48 getters to just 1 function.
* The Multi Pipeline now uses `highp float` precision by default, instead of `mediump`. This fixes issues with strange blue 'spots' appearing under WebGL on some Android devices. Fix #5751 #5659 #5655 (thanks @actionmoon @DuncanPriebe @ddanushkin)

### Lights Pipeline

* The Light fragment shader will now use the `outTintEffect` attribute meaning the Light Pipeline will now correctly light both tinted and fill-tinted Game Objects. Fix #5452 (thanks @kainage)
* The Light Pipeline will now check to see if a Light2D enabled Game Object has a parent Container, or not, and factor the rotation and scale of this into the light calculation. Fix #6086 (thanks @irongaze)
* The Light Pipeline no longer creates up to `maxLights` copies of the Light shader on boot. Previously it would then pick which shader to use, based on the number of visible lights in the Scene. Now, the number of lights is passed to the shader and branches accordingly. This means rather than compiling _n_ shaders on boot, it now only ever needs to create one.
* You can now have no lights in a Scene, but the Scene will still be impacted by the ambient light. Previously, you always needed at least 1 light to trigger ambient light (thanks jstnldrs)
* The `Light.frag` shader now uses a new `uLightCount` uniform to know when to stop iterating through the max lights.
* The `LightPipeline.LIGHT_COUNT` constant has been removed as it's not used internally.
* The `LightPipeline` previous created a global level temporary vec2 for calculations. This is now part of the class as the new `tempVec2` property.
* You can now correctly loading a Sprite Sheet with a Normal Map. The `TextureManager.addSpriteSheet` method has been updated to take an optional `dataSource` parameter and the `SpriteSheetFile.addToCache` method has been rewritten to handle normal maps as well.

### Removed - Graphics Pipeline

The WebGL Graphics Pipeline has been removed. This pipeline wasn't used in v3.55, as all Graphics rendering is handled by the MultiTint pipeline, for better batching support. No Phaser Game Objects use the Graphics pipeline any longer, so to save space it has been removed and is no longer installed by the Pipeline Manager.

## Post Pipeline Updates

In order to add clarity in the codebase we have created a new `PostPipeline` Component and moved all of the relevant functions from the `Pipeline` component in to it. This leads to the following changes:

* `PostPipeline` is a new Game Object Component that is now inherited by all Game Objects that are capable of using it.
* Game Objects with the `PostPipeline` component now have a new property called `postPipelineData`. This object is used for storing Post Pipeline specific data in. Previously, both regular and post pipelines used the same `pipelineData` object, but this has now been split up for flexibility.
* The `Pipeline.resetPipeline` method no longer has its first `resetPostPipelines` argument. It now has just one argument `resetData` so please be aware of this if you call this function anywhere in your code.
* `PostPipeline.initPostPipeline` is a new method that should be called by any Game Object that supports Post Pipelines.
* The following Game Objects now have the new `PostPipeline` Component exclusively: `Container` and `Layer`.
* The `Text`, `TileSprite` and `RenderTexture` Game Objects would call the pre and post batch functions twice by mistake, potentially applying a post fx twice to them.

## Snapshot Updates

* The `Renderer.Snapshot.WebGL` function has had its first parameter changed from an `HTMLCanvasElement` to a `WebGLRenderingContext`. This is now passed in from the `snapshot` methods inside the WebGL Renderer. The change was made to allow it to work with WebGL2 custom contexts (thanks @andymikulski)
* `WebGLSnapshot` will now flip the pixels in the created Image element if the source was a framebuffer. This means grabbing a snapshot from a Dynamic or Render Texture will now correctly invert the pixels on the y axis for an Image. Grabbing from the game renderer will skip this.
* `WebGLRenderer.snapshotFramebuffer` and by extension, the snapshot methods in Dynamic Textures and Render Textures, has been updated to ensure that the width and height never exceed the framebuffer dimensions, or it'll cause a runtime error. The method `snapshotArea` has had this limitation removed as a result, allowing you to snapshot areas that are larger than the Canvas. Fix #5707 (thanks @teng-z)
* `WebGLSnapshot` and `CanvasSnapshot` will now Math.floor the width/height values to ensure no sub-pixel dimensions, which corrupts the resulting texture. Fix #6099 (thanks @orjandh)

## Context Loss Handling Updates

* The `CONTEXT_RESTORED` Game Event has been removed and the WebGL Renderer no longer listens for the `contextrestored` DOM event, or has a `contextRestoredHandler` method. This never actually worked properly, in any version of Phaser 3 - although the WebGLRenderer would be restored, none of the shaders, pipelines or textures were correctly re-created. If a context is now lost, Phaser will display an error in the console and all rendering will halt. It will no longer try to re-create the context, leading to masses of WebGL errors in the console. Instead, it will die gracefully and require a page reload.
* The `Text` and `TileSprite` Game Objects no longer listen for the `CONTEXT_RESTORED` event and have had their `onContextRestored` methods removed.
* The context restore event handler is now turned off when a Game Object is destroyed. This helps avoid memory leakage from Text and TileSprite Game Objects, especially if you consistently destroy and recreate your Game instance in a single-page app (thanks @rollinsafary-inomma @rexrainbow @samme)

## WebGL Shader New Features

* `WebGLShader.fragSrc` is a new property that holds the source of the fragment shader.
* `WebGLShader.vertSrc` is a new property that holds the source of the vertex shader.
* `WebGLShader#.createProgram` is a new method that will destroy and then re-create the shader program based on the given (or stored) vertex and fragment shader source.
* `WebGLShader.setBoolean` is a new method that allows you to set a boolean uniform on a shader.

---------------------------------------

Return to the [Change Log index](CHANGELOG-v3.60.md).

📖 Read the [Phaser 3 API Docs](https://newdocs.phaser.io/) 💻 Browse 2000+ [Code Examples](https://labs.phaser.io) 🤝 Join the awesome [Phaser Discord](https://discord.gg/phaser)
