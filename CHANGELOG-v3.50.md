## Version 3.50.0 - Subaru - in development

### WebGL Pipeline Updates

If you use a custom WebGL Pipeline in your game, you must update your code in order to use Phaser 3.50.

Due to the huge amount of work that has taken place in this area, all of the pipelines have been renamed. If you extend any of these pipelines or use them in your game code (referenced by name), then please update accordingly. The name changes are:

* `TextureTintPipeline` is now called the `MultiPipeline`.
* `TextureTintStripPipeline` is now called the `RopePipeline`.
* `ForwardDiffuseLightPipeline` is now called the `LightPipeline`.

There is also the new `GraphicsPipeline`. Previously, the `TextureTintPipeline` was responsible for rendering all Sprites, Graphics and Shape objects. Now, it only renders Sprites. All Graphics and Shapes are handled by the new `GraphicsPipeline` which uses its own shaders. See further below for details about this change.

To match the new pipeline names, the shader source code has also been renamed.

* `ForwardDiffuse.frag` is now called `Light.frag`.
* `TextureTint.frag` is now called `Multi.frag`.
* `TextureTint.vert` is now called `Multi.vert`.

Other pipeline changes are as follows:

* None of the shaders or pipelines use the `uViewMatrix` and `uModelMatrix` uniforms any longer. These were always just plain identity matrices, so there is no point spending CPU and GPU time to set them as uniforms, or use them in the shaders. Should you need these uniforms, you can add them to your own custom pipelines.
* `Types.Renderer.WebGL.WebGLPipelineConfig` is a new TypeDef that helps you easily configure your own Custom Pipeline when using TypeScript and also provides better JSDocs.
* `Types.Renderer.WebGL.WebGLPipelineAttributesConfig` is a new TypeDef that helps you easily configure the attributes for your own Custom Pipelines when using TypeScript and also provides better JSDocs.
* All pipelines will now work out the `renderer` property automatically, so it's no longer required in the config.
* All pipelines will now work out the `gl` property automatically, so it's no longer required in the config.
* All pipelines will now extract the `name` property from the config, allowing you to set it externally.
* All pipelines will now extract the `vertexCapacity` property from the config, allowing you to set it externally.
* All pipelines will now extract the `vertexSize` property from the config, allowing you to set it externally.
* All pipelines will now extract the `vertexData` property from the config, allowing you to set it externally.
* All pipelines will now extract the `attributes` property from the config, allowing you to set it externally.
* All pipelines will now extract the `topology` property from the config, allowing you to set it externally.
* The `WebGLPipeline.shouldFlush` method now accepts an optional parameter `amount`. If given, it will return `true` if when the amount is added to the vertex count it will exceed the vertex capacity. The Multi Pipeline has been updated to now use this method instead of performing the comparison multiple times itself.
* The `RopePipeline` now extends `MultiPipeline` and just changes the topolgy, vastly reducing the filesize.
* The `WebGLPipeline.flushLocked` property has been removed. A pipeline can never flush in the middle of a flush anyway, so it was just wasting CPU cycles being set.
* You can now pass a pipeline instance to the `GameObject.setPipeline` method, as well as a string.

### Pipeline Uniform Changes

Piplines now have a new `uniforms` array that can be passed in with the config. All default pipelines now set these. The array contains the names, as strings, of all uniforms your pipeline shader uses. Once the pipeline shader has been successfully linked, it will use the array of names to look-up the `WebGLUniformLocation` of all uniforms specified. These are stored in the new `WebGLPipeline.uniforms` object. This takes place in the new `WebGLPipeline.setUniformLocations` method.

When a pipeline is bound, you can now use the new methods (listed below) to set uniform values directly on the pipeline. Previously, calling a method such as `setFloat3` on a pipeline would pass that call over to `WebGLRenderer`. The renderer would first check to see if the pipeline program was current, and if not, make it so, before then looking up the uniform location and finally setting it. This is a lot of steps to take for pipelines that potentially need to change uniforms for every Game Object they render.

Under the new methods, and using the new pre-cached uniform locations, these extra steps are skipped. The uniform value is set directly, no shader binding takes place and no location look-up happens. This dramatically reduces the number of WebGL ops being issued per frame. To clearly differentiate these pipline methods, we have renamed them. The new method names are as follows:

* `WebGLPipeline.set1f` will set a 1f uniform based on the given name.
* `WebGLPipeline.set2f` will set a 2f uniform based on the given name.
* `WebGLPipeline.set3f` will set a 3f uniform based on the given name.
* `WebGLPipeline.set4f` will set a 4f uniform based on the given name.
* `WebGLPipeline.set1fv` will set a 1fv uniform based on the given name.
* `WebGLPipeline.set2fv` will set a 2fv uniform based on the given name.
* `WebGLPipeline.set3fv` will set a 3fv uniform based on the given name.
* `WebGLPipeline.set4fv` will set a 4fv uniform based on the given name.
* `WebGLPipeline.set1iv` will set a 1iv uniform based on the given name.
* `WebGLPipeline.set2iv` will set a 2iv uniform based on the given name.
* `WebGLPipeline.set3iv` will set a 3iv uniform based on the given name.
* `WebGLPipeline.set4iv` will set a 4iv uniform based on the given name.
* `WebGLPipeline.set1i` will set a 1i uniform based on the given name.
* `WebGLPipeline.set2i` will set a 2i uniform based on the given name.
* `WebGLPipeline.set3i` will set a 3i uniform based on the given name.
* `WebGLPipeline.set4i` will set a 4i uniform based on the given name.
* `WebGLPipeline.setMatrix2fv` will set a matrix 2fv uniform based on the given name.
* `WebGLPipeline.setMatrix3fv` will set a matrix 3fv uniform based on the given name.
* `WebGLPipeline.setMatrix4fv` will set a matrix 4fv uniform based on the given name.

If your code uses any of the old method names, please update them using the list below:

* `WebGLPipeline.setFloat1` has been removed. Please use `set1f` instead.
* `WebGLPipeline.setFloat2` has been removed. Please use `set2f` instead.
* `WebGLPipeline.setFloat3` has been removed. Please use `set3f` instead.
* `WebGLPipeline.setFloat4` has been removed. Please use `set4f` instead.
* `WebGLPipeline.setFloat1v` has been removed. Please use `set1fv` instead.
* `WebGLPipeline.setFloat2v` has been removed. Please use `set2fv` instead.
* `WebGLPipeline.setFloat3v` has been removed. Please use `set3fv` instead.
* `WebGLPipeline.setFloat4v` has been removed. Please use `set4fv` instead.
* `WebGLPipeline.setInt1` has been removed. Please use `set1i` instead.
* `WebGLPipeline.setInt2` has been removed. Please use `set2i` instead.
* `WebGLPipeline.setInt3` has been removed. Please use `set3i` instead.
* `WebGLPipeline.setInt4` has been removed. Please use `set4i` instead.
* `WebGLPipeline.setMatrix1` has been removed. Please use `setMatrix2fv` instead.
* `WebGLPipeline.setMatrix2` has been removed. Please use `setMatrix3fv` instead.
* `WebGLPipeline.setMatrix3` has been removed. Please use `setMatrix4fv` instead.

### Pipeline Manager

The `WebGL.PipelineManager` is a new class that is responsbile for managing all of the WebGL Pipelines in Phaser. An instance of the Pipeline Manager is created by the WebGL Renderer and is available under the `pipelines` property. This means that the WebGL Renderer no longer handles pipelines directly, causing the following API changes:

* `WebGLRenderer.pipelines` is no longer a plain object containing pipeline instances. It's now an instance of the `PipelineManager` class. This instance is created during the init and boot phase of the renderer.
* The `WebGLRenderer.currentPipeline` property no longer exists, instead use `PipelineManager.current`.
* The `WebGLRenderer.previousPipeline` property no longer exists, instead use `PipelineManager.previous`.
* The `WebGLRenderer.hasPipeline` method no longer exists, instead use `PipelineManager.has`.
* The `WebGLRenderer.getPipeline` method no longer exists, instead use `PipelineManager.get`.
* The `WebGLRenderer.removePipeline` method no longer exists, instead use `PipelineManager.remove`.
* The `WebGLRenderer.addPipeline` method no longer exists, instead use `PipelineManager.add`.
* The `WebGLRenderer.setPipeline` method no longer exists, instead use `PipelineManager.set`.
* The `WebGLRenderer.rebindPipeline` method no longer exists, instead use `PipelineManager.rebind`.
* The `WebGLRenderer.clearPipeline` method no longer exists, instead use `PipelineManager.clear`.

The Pipeline Manager also offers the following new features:

* The `PipelineManager.resize` method automatically handles resize events across all pipelines.
* The `PipelineManager.preRender` method calls the pre-render method of all pipelines.
* The `PipelineManager.render` method calls the render method of all pipelines.
* The `PipelineManager.postRender` method calls the post-render method of all pipelines.
* The `PipelineManager.setMulti` method automatically binds the Multi Texture Pipeline, Phaser's default.
* The `PipelineManager.clear` method will clear the pipeline, store it in `previous` and free the renderer.
* The `PipelineManager.rebind` method will reset the rendering context and restore the `previous` pipeline, if set.

New constants have been created to help you reference a pipeline without needing to use strings:

* `Phaser.Renderer.WebGL.Pipelines.BITMAPMASK_PIPELINE` for the Bitmap Mask Pipeline.
* `Phaser.Renderer.WebGL.Pipelines.LIGHT_PIPELINE` for the Light 2D Pipeline.
* `Phaser.Renderer.WebGL.Pipelines.SINGLE_PIPELINE` for the Single Pipeline.
* `Phaser.Renderer.WebGL.Pipelines.MULTI_PIPELINE` for the Multi Pipeline.
* `Phaser.Renderer.WebGL.Pipelines.ROPE_PIPELINE` for the Rope Pipeline.

All Game Objects have been updated to use the new constants and Pipeline Manager.

#### Single Pipeline

There is also a new pipeline called `SinglePipeline`, created to emulate the old `TextureTintPipeline`. This special pipeline uses just a single texture and makes things a lot easier if you wish to create a custom pipeline, but not have to recode your shaders to work with multiple textures. Instead, just extend `SinglePipeline`, where-as before you extended the `TextureTintPipeline` and you won't have to change any of your shader code. However, if you can, you should update it to make it perform faster, but that choice is left up to you.

### WebGL Multi-Texture Rendering

The Multi Pipeline (previously called the Texture Tint Pipeline) has had its core flow rewritten to eliminate the need for constantly creating `batch` objects. Instead, it now supports the new multi-texture shader, vastly increasing rendering performance, especially on draw-call bound systems.

All of the internal functions, such as `batchQuad` and `batchSprite` have been updated to use the new method of texture setting. The method signatures all remain the same unless indicated below.

* `Config.render.maxTextures` is a new game config setting that allows you to control how many texture units will be used in WebGL.
* `WebGL.Utils.checkShaderMax` is a new function, used internally by the renderer, to determine the maximum number of texture units the GPU + browser supports.
* The property `WebGLRenderer.currentActiveTextureUnit` has been renamed to `currentActiveTexture`.
* `WebGLRenderer.startActiveTexture` is a new read-only property contains the current starting active texture unit.
* `WebGLRenderer.maxTextures` is a new read-only property that contains the maximum number of texture units WebGL can use.
* `WebGLRenderer.textureIndexes` is a new read-only array that contains all of the available WebGL texture units.
* `WebGLRenderer.tempTextures` is a new read-only array that contains temporary WebGL textures.
* The `WebGLRenderer.currentTextures` property has been removed, as it's no longer used.
* `TextureSource.glIndex` is a new property that holds the currently assigned texture unit for the Texture Source.
* `TextureSource.glIndexCounter` is a new property that holds the time the index was assigned to the Texture Source.
* `WebGLRenderer.currentTextures` has been removed, as it's no longer used internally.
* `WebGLRenderer.setBlankTexture` no longer has a `force` parameter, as it's set by default.
* The Mesh Game Object WebGL Renderer function has been updated to support multi-texture units.
* The Blitter Game Object WebGL Renderer function has been updated to support multi-texture units.
* The Bitmap Text Game Object WebGL Renderer function has been updated to support multi-texture units.
* The Dynamic Bitmap Text Game Object WebGL Renderer function has been updated to support multi-texture units.
* The Particle Emitter Game Object WebGL Renderer function has been updated to support multi-texture units.
* The Texture Tint vertex and fragment shaders have been updated to support the `inTexId` float attribute and dynamic generation.
* The Texture Tint Pipeline has a new attribute, `inTexId` which is a `gl.FLOAT`.
* `TextureTintPipeline.bind` is a new method that sets the `uMainSampler` uniform.
* The `TextureTintPipeline.requireTextureBatch` method has been removed, as it's no longer required.
* The `TextureTintPipeline.pushBatch` method has been removed, as it's no longer required.
* The `TextureTintPipeline.maxQuads` property has been removed, as it's no longer required.
* The `TextureTintPipeline.batches` property has been removed, as it's no longer required.
* `TextureTintPipeline.flush` has been rewritten to support multi-textures.
* `TextureTintPipeline.flush` no longer creates a sub-array if the batch is full, but instead uses `bufferData` for speed.
* `WebGLPipeline.currentUnit` is a new property that holds the most recently assigned texture unit. Treat as read-only.
* `WebGLRenderer.setTextureSource` is a new method, used by pipelines and Game Objects, that will assign a texture unit to the given Texture Source.
* The `WebGLRenderer.setTexture2D` method has been updated to use the new texture unit assignment. It no longer takes the `textureUnit` or `flush` parameters and these have been removed from its method signature.
* `WebGLRenderer.setTextureZero` is a new method that activates texture zero and binds the given texture to it. Useful for fbo backed game objects.
* `WebGLRenderer.clearTextureZero` is a new method that clears the texture that was bound to unit zero.
* `WebGLRenderer.textureZero` is a new property that holds the currently bound unit zero texture.
* `WebGLRenderer.normalTexture` is a new property that holds the currently bound normal map (texture unit one).
* `WebGLRenderer.setNormalMap` is a new method that sets the current normal map texture.
* `WebGLRenderer.clearNormalMap` is a new method that clears the current normal map texture.
* `WebGLRenderer.resetTextures` is a new method that flushes the pipeline, resets all textures back to the temporary ones, and resets the active texture counter.
* `WebGLPipeline.boot` will now check all of the attributes and store the pointer location within the attribute entry.
* `WebGLPipeline.bind` no longer looks-up and enables every attribute, every frame. Instead, it uses the cached pointer location stored in the attribute entry, cutting down on redundant WebGL operations.
* `WebGLRenderer.isNewNormalMap` is a new method that returns a boolean if the given parameters are not currently used.
* `WebGLPipeline.forceZero` is a new property that informs Game Objects if the pipeline requires a zero bound texture unit.
* `WebGLPipeline.setAttribPointers` is a new method that will set the vertex attribute pointers for the pipeline.
* `WebGLRenderer.unbindTextures` is a new method that will activate and then null bind all WebGL textures.
* `Renderer.WebGL.Utils.parseFragmentShaderMaxTextures` is a new function that will take fragment shader source and search it for `%count%` and `%forloop%` declarations, replacing them with the required GLSL for multi-texture support, returning the modified source.
* The `WebGL.Utils.getComponentCount` function has been removed as this is no longer required internally.

### WebGLRenderer New Features, Updates and API Changes

* `WebGLRenderer.instancedArraysExtension` is a new property that holds the WebGL Extension for instanced array drawing, if supported by the browser.
* `WebGLRenderer.vaoExtension` is a new property that holds a reference to the Vertex Array Object WebGL Extension, if supported by the browser.
* `WebGLRenderer.resetProgram` is a new method that will rebind the current program, without flushing or changing any properties.
* `WebGLRenderer.textureFlush` is a new property that keeps track of the total texture flushes per frame.
* `WebGLRenderer.finalType` is a new boolean property that signifies if the current Game Object being rendered is the final one in the list.
* The `WebGLRenderer.updateCanvasTexture` method will now set `gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL` to true, which should stop issues where you update a Text Game Object, having added a Render Texture or Spine Game Object to the Scene after it, which switches the PMA setting. Fix #5064 #5155 (thanks @hugoruscitti @immangrove-supertree)
* `WebGLRenderer.previousPipeline` is a new property that is set during a call to `clearPipeline` and used during calls to `rebindPipeline`, allowing the renderer to rebind any previous pipeline, not just the Multi Pipeline.
* The `WebGLRenderer.rebindPipeline` method has been changed slightly. Previously, you had to specify the `pipelineInstance`, but this is now optional. If you don't, it will use the new `previousPipeline` property instead. If not set, or none given, it will now return without throwing gl errors as well.
* `WebGLRenderer.defaultScissor` is a new property that holds the default scissor dimensions for the renderer. This is modified during `resize` and avoids continuous array generation in the `preRender` loop.
* The `WebGLRenderer.nativeTextures` array has been removed and any WebGLTextures created by the renderer are no longer stored within it. All WebGLTexture instances are stored in the `TextureSource` objects anyway, or by local classes such as RenderTexture, so there was no need to have another array taking up memroy.
* The `WebGLRenderer.deleteTexture` method has a new optional boolean parameter `reset` which allows you to control if the `WebGLRenderer.resetTextures` method is called, or not, after the texture is deleted.
* The `WebGLRenderer.getMaxTextures` method has been removed. This is no longer needed as you can use the `WebGLRenderer.maxTextures` property instead.
* The `WebGLRenderer.setProgram` method now returns a boolean. `true` if the program was set, otherwise `false`.
* The `WebGLRenderer.setVertexBuffer` method now returns a boolean. `true` if the buffer was set, otherwise `false`.
* `WebGLRenderer.setFloat1` has been removed. Use `WebGLPipeline.set1f` or `WebGLShader.set1f` instead.
* `WebGLRenderer.setFloat2` has been removed. Use `WebGLPipeline.set2f` or `WebGLShader.set2f` instead.
* `WebGLRenderer.setFloat3` has been removed. Use `WebGLPipeline.set3f` or `WebGLShader.set3f` instead.
* `WebGLRenderer.setFloat4` has been removed. Use `WebGLPipeline.set4f` or `WebGLShader.set4f` instead.
* `WebGLRenderer.setFloat1v` has been removed. Use `WebGLPipeline.set1fv` or `WebGLShader.set1fv` instead.
* `WebGLRenderer.setFloat2v` has been removed. Use `WebGLPipeline.set1fv` or `WebGLShader.set2fv` instead.
* `WebGLRenderer.setFloat3v` has been removed. Use `WebGLPipeline.set1fv` or `WebGLShader.set3fv` instead.
* `WebGLRenderer.setFloat4v` has been removed. Use `WebGLPipeline.set1fv` or `WebGLShader.set4fv` instead.
* `WebGLRenderer.setInt1` has been removed. Use `WebGLPipeline.set1fi` or `WebGLShader.set1i` instead.
* `WebGLRenderer.setInt2` has been removed. Use `WebGLPipeline.set1fi` or `WebGLShader.set2i` instead.
* `WebGLRenderer.setInt3` has been removed. Use `WebGLPipeline.set1fi` or `WebGLShader.set3i` instead.
* `WebGLRenderer.setInt4` has been removed. Use `WebGLPipeline.set1fi` or `WebGLShader.set4i` instead.
* `WebGLRenderer.setMatrix2` has been removed. Use `WebGLPipeline.setMatrix2fv` or `WebGLShader.setMatrix2fv` instead.
* `WebGLRenderer.setMatrix3` has been removed. Use `WebGLPipeline.setMatrix3fv` or `WebGLShader.setMatrix3fv` instead.
* `WebGLRenderer.setMatrix4` has been removed. Use `WebGLPipeline.setMatrix4fv` or `WebGLShader.setMatrix4fv` instead.
* The `WebGLRenderer._tempMatrix1`, `_tempMatrtix2`, `_tempMatrix3` and `_tempMatrix4` properties have been removed. They were all flagged as private, yet used in lots of places. Instead, Game Objects now manager their own matrices, or use the global `GetCalcMatrix` function instead.
* `WebGLRenderer.fboStack` is a new property that maintains a stack of framebuffer objects, used for pipelines supporting multiple render targets.
* `WebGLRenderer.pushFramebuffer` is a new method that is used to push a framebuffer onto the fbo stack before setting it as the current framebuffer. This should now be called in place of `setFramebuffer`. Remember to call `popFramebuffer` after using it.
* `WebGLRenderer.popFramebuffer` is a new method that will pop the current framebuffer off the fbo stack and set the previous one as being active.
* `WebGLRenderer.setFramebuffer` has a new optional boolean parameter `resetTextures` which will reset the WebGL Textures, if set to `true` (which is the default).
* `WebGLRenderer.isBooted` is a new boolean property that lets you know if the rendere has fully finished booting.
* The `WebGLRenderer` now extends the Event Emitter, allowing you to listen to renderer specific events.
* `Phaser.Renderer.WebGL.Events` is a new WebGL Renderer namespace for events.
* `WebGL.Events.PRE_RENDER` is a new event dispatched by the WebGL Renderer. This happens right at the start of the render process.
* `WebGL.Events.RENDER` is a new event dispatched by the WebGL Renderer. This happens once for every camera, in every Scene at the start of its render process.
* `WebGL.Events.POST_RENDER` is a new event dispatched by the WebGL Renderer. This happens right at the end of the render process.
* `WebGL.Events.RESIZE` is a new event dispatched by the WebGL Renderer whenever it is resized.

### Camera - New Features, Updates and API Changes

The Camera API has changed in line with the new pipeline updates. To this end, the following changes have taken place:

The Camera class now inherits the `Pipeline` Component. This gives it new features, in line with the other pipelines changes in 3.50, such as `Camera.setPipeline`, `Camera.setPostPipeline`, `Camera.setPipelineData` and so on. This is a much more powerful and flexible way of setting camera effects, rather than it managing its own framebuffer and texture directly.

To that end, the following properties and methods have been removed to tidy things up:

* The `Camera.renderToTexture` property has been removed. Effects are now handled via pipelines.
* The `Camera.renderToGame` property has been removed. Effects are now handled via pipelines.
* The `Camera.canvas` property has been removed. Textures are handled by pipelines.
* The `Camera.context` property has been removed. Textures are handled by pipelines.
* The `Camera.glTexture` property has been removed. GL Textures are handled by pipelines.
* The `Camera.framebuffer` property has been removed. GL Framebuffers are handled by pipelines.
* The `Camera.setRenderToTexture` method has been removed. Effects are now handled via pipelines.
* The `Camera.clearRenderToTexture` method has been removed. Effects are now handled via pipelines.

These changes mean that you can no longer render a Camera to a canvas in Canvas games.

Other changes and fixes:

* `Cameras.Scene2D.Events.FOLLOW_UPDATE` is a new Event that is dispatched by a Camera when it is following a Game Object. It is dispatched every frame, right after the final Camera position and internal matrices have been updated. Use it if you need to react to a camera, using its most current position and the camera is following something. Fix #5253 (thanks @rexrainbow)
* If the Camera has `roundPixels` set it will now round the internal scroll factors and `worldView` during the `preRender` step. Fix #4464 (thanks @Antriel)

### Graphics Pipeline and Graphics Game Object Changes

The Graphics Pipeline is a new pipeline added in 3.50 that is responsible for rendering Graphics Game Objects and all of the Shape Game Objects, such as Arc, Rectangle, Star, etc. Due to the new pipeline some changes have been made:

* The Graphics Pipeline now uses much simpler vertex and fragment shaders, with just two attributes (`inPosition` and `inColor`), making the vertex size and memory-use 57% smaller.
* The private `_tempMatrix1`, 2, 3 and 4 properties have all been removed from the pipeline.
* A new public `calcMatrix` property has been added, which Shape Game Objects use to maintain transform state during rendering.
* The Graphics Pipeline no longer makes use of `tintEffect` or any textures.
* Because Graphics and Shapes now render with their own pipeline, you are able to exclude the pipeline and those Game Objects entirely from custom builds, further reducing the final bundle size.

As a result of these changes the follow features are no longer available:

* `Graphics.setTexture` has been removed. You can no longer use a texture as a 'fill' for a Graphic. It never worked with any shape other than a Rectangle, anyway, due to UV mapping issues, so is much better handled via the new Mesh Game Object.
* `Graphics._tempMatrix1`, 2 and 3 have been removed. They're not required internally any longer.
* `Graphics.renderWebGL` now uses the standard `GetCalcMatrix` function, cutting down on duplicate code significantly.

### Light Pipeline Changes

The Light Pipeline (previously called the Forward Diffuse Light Pipeline), which is responsible for rendering lights under WebGL, has been rewritten to work with the new Multi Pipeline features. Lots of redundant code has been removed and the following changes and improvements took place:

* The pipeline now works with Game Objects that do not have a normal map. They will be rendered using the new default normal map, which allows for a flat light effect to pass over them and merge with their diffuse map colors.
* Fixed a bug in the way lights were handled that caused Tilemaps to render one tile at a time, causing massive slow down. They're now batched properly, making a combination of lights and tilemaps possible again.
* The Bitmap Text (Static and Dynamic) Game Objects now support rendering with normal maps.
* The TileSprite Game Objects now support rendering with normal maps.
* Mesh and Quad Game Objects now support rendering with normal maps.
* The Graphics Game Objects now support rendering in Light2d. You can even use normal map textures for the texture fills.
* Particle Emitter Game Object now supports rendering in Light2d.
* All Shape Game Objects (Rectangle, IsoBox, Star, Polygon, etc) now support rendering in Light2d.
* The Text Game Object now supports rendering in Light2d, no matter which font, stroke or style it is using.
* Both Static and Dynamic Tilemap Layer Game Objects now support the Light2d pipeline, with or without normal maps.
* The pipeline will no longer look-up and set all of the light uniforms unless the `Light` is dirty.
* The pipeline will no longer reset all of the lights unless the quantity of lights has changed.
* The `ForwardDiffuseLightPipeline.defaultNormalMap` property has changed, it's now an object with a `glTexture` property that maps to the pipelines default normal map.
* The `ForwardDiffuseLightPipeline.boot` method has been changed to now generate a default normal map.
* The `ForwardDiffuseLightPipeline.onBind` method has been removed as it's no longer required.
* The `ForwardDiffuseLightPipeline.setNormalMap` method has been removed as it's no longer required.
* `ForwardDiffuseLightPipeline.bind` is a new method that handles setting-up the shader uniforms.
* The `ForwardDiffuseLightPipeline.batchTexture` method has been rewritten to use the Texture Tint Pipeline function instead.
* The `ForwardDiffuseLightPipeline.batchSprite` method has been rewritten to use the Texture Tint Pipeline function instead.
* `ForwardDiffuseLightPipeline.lightCount` is a new property that stores the previous number of lights rendered.
* `ForwardDiffuseLightPipeline.getNormalMap` is a new method that will look-up and return a normal map for the given object.

### Lights

* `Light.dirty` is a new property that controls if the light is dirty, or not, and needs its uniforms updating.
* `Light` has been recoded so that all of its properties are now setters that activate its `dirty` flag.
* `LightsManager.destroy` will now clear the `lightPool` array when destroyed, where-as previously it didn't.
* `LightsManager.cull` now takes the viewport height from the renderer instead of the game config (thanks zenwaichi)

### WebGL ModelViewProjection Removed

The `ModelViewProjection` object contained a lot of functions that Phaser never used internally. Instead, the functions available in them were already available in the `Math.Matrix4` class. So the pipelines have been updated to use a Matrix4 instead and all of the MVP functions have been removed. The full list of removed functions is below:

* `projIdentity` has been removed.
* `projPersp` has been removed.
* `modelRotateX` has been removed.
* `modelRotateY` has been removed.
* `modelRotateZ` has been removed.
* `viewLoad` has been removed.
* `viewRotateX` has been removed.
* `viewRotateY` has been removed.
* `viewRotateZ` has been removed.
* `viewScale` has been removed.
* `viewTranslate` has been removed.
* `modelIdentity` has been removed.
* `modelScale` has been removed.
* `modelTranslate` has been removed.
* `viewIdentity` has been removed.
* `viewLoad2D` has been removed.
* `projOrtho` has been removed.

### BitmapText - New Features, Updates and API Changes

* `BitmapText.setCharacterTint` is a new method that allows you to set a tint color (either additive or fill) on a specific range of characters within a static Bitmap Text. You can specify the start and length offsets and per-corner tint colors.
* `BitmapText.setWordTint` is a new method that allows you to set a tint color (either additive or fill) on all matching words within a static Bitmap Text. You can specify the word by string, or numeric offset, and the number of replacements to tint.
* `BitmapText.setDropShadow` is a new method that allows you to apply a drop shadow effect to a Bitmap Text object. You can set the horizontal and vertical offset of the shadow, as well as the color and alpha levels. Call this method with no parameters to clear a shadow.
* `BitmapTextWebGLRenderer` has been rewritten from scratch to make use of the new pre-cached WebGL uv texture and character location data generated by `GetBitmapTextSize`. This has reduced the number of calculations made in the function dramatically, as it no longer has to work out glyph advancing or offsets during render, but only when the text content updates.
* `BitmapText.getCharacterAt` is a new method that will return the character data from the BitmapText at the given `x` and `y` coordinates. The character data includes the code, position, dimensions, and glyph information.
* The `BitmapTextSize` object returned by `BitmapText.getTextBounds` has a new property called `characters` which is an array that contains the scaled position coordinates of each character in the BitmapText, which you could use for tasks such as determining which character in the BitmapText was clicked.
* `ParseXMLBitmapFont` will now calculate the WebGL uv data for the glyphs during parsing. This avoids it having to be done during rendering, saving CPU cycles on an operation that never changes.
* `ParseXMLBitmapFont` will now create a Frame object for each glyph. This means you could, for example, create a Sprite using the BitmapText texture and the glyph as the frame key, i.e.: `this.add.sprite(x, y, fontName, 'A')`.
* `BitmapTextWord`, `BitmapTextCharacter` and `BitmapTextLines` are three new type defs that are now part of the `BitmapTextSize` config object, as returned by `getTextBounds`. This improves the TypeScript defs and JS Docs for this object.
* The signature of the `ParseXMLBitmapFont` function has changed. The `frame` parameter is no longer optional, and is now the second parameter in the list, instead of being the 4th. If you call this function directly, please update your code.
* The `BitmapText.getTextBounds` method was being called every frame, even if the bounds didn't change, potentially costing a lot of CPU time depending on the text length and quantity of them. It now only updates the bounds if they change.
* The `GetBitmapTextSize` function used `Math.round` on the values, if the `round` parameter was `true`, which didn't create integers. It now uses `Math.ceil` instead to give integer results.
* The `GetBitmapTextSize` function has a new boolean parameter `updateOrigin`, which will adjust the origin of the parent BitmapText if set, based on the new bounds calculations.
* `BitmapText.preDestroy` is a new method that will tidy-up all of the BitmapText data during object destruction.
* `BitmapText.dropShadowX` is a new property that controls the horizontal offset of the drop shadow on the Bitmap Text.
* `BitmapText.dropShadowY` is a new property that controls the vertical offset of the drop shadow on the Bitmap Text.
* `BitmapText.dropShadowColor` is a new property that sets the color of the Bitmap Text drop shadow.
* `BitmapText.dropShadowAlpha` is a new property that sets the alpha of the Bitmap Text drop shadow.
* `BatchChar` is a new internal private function for batching a single character of a Bitmap Text to the pipeline.
* If you give an invalid Bitmap Font key, the Bitmap Text object will now issue a `console.warn`.
* Setting the `color` value in the `DynamicBitmapText.setDisplayCallback` would inverse the red and blue channels if the color was not properly encoded for WebGL. It is now encoded automatically, meaning you can pass normal hex values as the colors in the display callback. Fix #5225 (thanks @teebarjunk)
* If you apply `setSize` to the Dynamic BitmapText the scissor is now calculated based on the parent transforms, not just the local ones, meaning you can crop Bitmap Text objects that exist within Containers. Fix #4653 (thanks @lgibson02)
* `ParseXMLBitmapFont` has a new optional parameter `texture`. If defined, this Texture is populated with Frame data, one frame per glyph. This happens automatically when loading Bitmap Text data in Phaser.
* You can now use `setMaxWidth` on `DynamicBitmapText`, which wasn't previously possible. Fix #4997 (thanks @AndreaBoeAbrahamsen)

### Update List Changes

The way in which Game Objects add themselves to the Scene Update List has changed. Instead of being added by the Factory methods, they will now add and remove themselves based on the new `ADDED_TO_SCENE` and `REMOVED_FROM_SCENE` events. This means, you can now add Sprites directly to a Container, or Group, and they'll animate properly without first having to be part of the Update List. The full set of changes and new features relating to this follow:

* `GameObjects.Events.ADDED_TO_SCENE` is a new event, emitted by a Game Object, when it is added to a Scene, or a Container that is part of the Scene.
* `GameObjects.Events.REMOVED_FROM_SCENE` is a new event, emitted by a Game Object, when it is removed from a Scene, or a Container that is part of the Scene.
* `Scenes.Events.ADDED_TO_SCENE` is a new event, emitted by a Scene, when a new Game Object is added to the display list in the Scene, or a Container that is on the display list.
* `Scenes.Events.REMOVED_FROM_SCENE` is a new event, emitted by a Scene, when it a Game Object is removed from the display list in the Scene, or a Container that is on the display list.
* `GameObject.addedToScene` is a new method that custom Game Objects can use to perform additional set-up when a Game Object is added to a Scene. For example, Sprite uses this to add itself to the Update List.
* `GameObject.removedFromScene` is a new method that custom Game Objects can use to perform additional tear-down when a Game Object is removed from a Scene. For example, Sprite uses this to remove themselves from the Update List.
* Game Objects no longer automatically remove themselves from the Update List during `preDestroy`. This should be handled directly in the `removedFromScene` method now.
* The `Container` will now test to see if any Game Object added to it is already on the display list, or not, and emit its ADDED and REMOVED events accordingly. Fix #5267 #3876 (thanks @halgorithm @mbpictures)
* `DisplayList.events` is a new property that references the Scene's Event Emitter. This is now used internally.
* `DisplayList.addChildCallback` is a new method that overrides the List callback and fires the new ADDED events.
* `DisplayList.removeChildCallback` is a new method that overrides the List callback and fires the new REMOVED events.
* `GameObjectCreator.events` is a new property that references the Scene's Event Emitter. This is now used internally.
* `GameObjectFactory.events` is a new property that references the Scene's Event Emitter. This is now used internally.
* `ProcessQueue.checkQueue` is a new boolean property that will make sure only unique objects are added to the Process Queue.
* The `Update List` now uses the new `checkQueue` property to ensure no duplicate objects are on the active list.
* `DOMElementFactory`, `ExternFactory`, `ParticleManagerFactor`, `RopeFactory` and `SpriteFactory` all no longer add the objects to the Update List, this is now handled by the ADDED events instead.
* `Sprite`, `Rope`, `ParticleEmitterManager`, `Extern` and `DOMElement` now all override the `addedToScene` and `removedFromScene` callbacks to handle further set-up tasks.

### Spine Plugin Updates

* The Spine Runtimes have been updated to 3.8.99, which are the most recent non-beta versions. Please note, you will _need_ to re-export your animations if you're working in a version of Spine lower than 3.8.20.
* `SpineContainer` is a new Game Object available via `this.add.spineContainer` to which you can add Spine Game Objects only. It uses a special rendering function to retain batching, even across multiple container or Spine Game Object instances, resulting in dramatically improved performance compared to using regular Containers. You _can_ still use regular Containers if you need, but they do not benefit from the new batching.
* A Spine Game Object with `setVisible(false)` will no longer still cause internal gl commands and is now properly skipped, retaining any current batch in the process. Fix #5174 (thanks @Kitsee)
* The Spine Game Object WebGL Renderer will no longer clear the type if invisible and will only end the batch if the next type doesn't match.
* The Spine Game Object WebGL Renderer will no longer rebind the pipeline if it was the final object on the display list, saving lots of gl commands.
* The Webpack build scripts have all been updated for Webpack 4.44.x. Fix #5243 (thanks @RollinSafary)
* There is a new npm script `npm run plugin.spine.runtimes` which will build all of the Spine runtimes, for ingestion by the plugin. Note: You will need to check-out the Esoteric Spine Runtimes repo into `plugins/spine/` in order for this to work and then run `npm i`.
* Spine Game Objects can now be rendered to Render Textures. Fix #5184 (thanks @Kitsee)
* Using > 128 Spine objects in a Container would cause a `WebGL: INVALID_OPERATION: vertexAttribPointer: no ARRAY_BUFFER is bound and offset is non-zero` error if you added any subsequent Spine objects to the Scene. There is now no limit. Fix #5246 (thanks @d7561985)
* The Spine Plugin will now work in HEADLESS mode without crashing. Fix #4988 (thanks @raimon-segura)
* Spine Game Objects now use -1 as their default blend mode, which means 'skip setting it', as blend modes should be handled by the Spine skeletons directly.
* The Spine TypeScript defs have been updated for the latest version of the plugin and to add SpineContainers.
* The `SpineGameObject.setAnimation` method will now use the `trackIndex` parameter if `ignoreIfPlaying` is set and run the check against this track index. Fix #4842 (thanks @vinerz)
* The `SpineFile` will no longer throw a warning if adding a texture into the Texture Manager that already exists. This allows you to have multiple Spine JSON use the same texture file, however, it also means you now get no warning if you accidentally load a texture that exists, so be careful with your keys! Fix #4947 (thanks @Nomy1)
* The Spine Plugin `destroy` method will now no longer remove the Game Objects from the Game Object Factory, or dispose of the Scene Renderer. This means when a Scene is destroyed, it will keep the Game Objects in the factory for other Scenes to use. Fix #5279 (thanks @Racoonacoon)
* `SpinePlugin.gameDestroy` is a new method that is called if the Game instance emits a `destroy` event. It removes the Spine Game Objects from the factory and disposes of the Spine scene renderer.
* `SpineFile` will now check to see if another identical atlas in the load queue is already loading the texture it needs and will no longer get locked waiting for a file that will never complete. This allows multiple skeleton JSONs to use the same atlas data. Fix #5331 (thanks @Racoonacoon)
* `SpineFile` now uses a `!` character to split the keys, instead of an underscore, preventing the plugin from incorrectly working out the keys for filenames with underscores in them. Fix #5336 (thanks @Racoonacoon)
* `SpineGameObject.willRender` is no longer hard-coded to return `true`. It instead now takes a Camera parameter and performs all of the checks needed before returning. Previously, this happened during the render functions.
* The Spine Plugin now uses a single instance of the Scene Renderer when running under WebGL. All instances of the plugin (installed per Scene) share the same base Scene Renderer, avoiding duplicate allocations and resizing events under multi-Scene games. Fix #5286 (thanks @spayton BunBunBun)

### Animation API - New Features and Updates

If you use Animations in your game, please read the following important API changes in 3.50:

The Animation API has had a significant overhaul to improve playback handling. Instead of just playing an animation based on its global key, you can now supply a new `PlayAnimationConfig` object instead, which allows you to override any of the default animation settings, such as `duration`, `delay` and `yoyo` (see below for the full list). This means you no longer have to create lots of duplicate animations just to change properties such as `duration`, and can now set them dynamically at run-time as well.

* The `Animation` class no longer extends `EventEmitter`, as it no longer emits any events directly. This means you cannot now listen for events directly from an Animation instance. All of the events are now dispatched by the Game Objects instead.
* All of the `SPRITE_ANIMATION_KEY` events have been removed. Instead, please use the new events which all carry the `frameKey` parameter, which can be used to handle frame specific events. The only exception to this is `ANIMATION_COMPLETE_KEY`, which is a key specific version of the completion event.
* `ANIMATION_UPDATE_EVENT` is a new event that is emitted from a Sprite when an animation updates, i.e. its frame changes.
* `ANIMATION_STOP_EVENT` is a new event that is emitted from a Sprite when its current animation is stopped. This can happen if any of the `stop` methods are called, or a new animation is played prior to this one reaching completion. Fix #4894 (thanks @scott20145)
* The Game Object `Component.Animation` component has been renamed to `AnimationState` and has moved namespace. It's now in `Phaser.Animations` instead of `GameObjects.Components` to help differentiate it from the `Animation` class when browsing the documentation.
* The `play`, `playReverse`, `playAfterDelay`, `playAfterRepeat` and `chain` Sprite and Animation Component methods can now all take a `Phaser.Types.Animations.PlayAnimationConfig` configuration object, as well as a string, as the `key` parameter. This allows you to override any default animation setting with those defined in the config, giving you far greater control over animations on a Game Object level, without needing to globally duplicate them.
* `AnimationState.create` is a new method that allows you to create animations directly on a Sprite. These are not global and never enter the Animation Manager, instead risiding within the Sprite itself. This allows you to use the same keys across both local and global animations and set-up Sprite specific local animations.
* `AnimationState.generateFrameNumbers` is a new method that is a proxy for the same method available under the Animation Manager. It's exposed in the Animation State so you're able to access it from within a Sprite (thanks @juanitogan)
* `AnimationState.generateFrameNames` is a new method that is a proxy for the same method available under the Animation Manager. It's exposed in the Animation State so you're able to access it from within a Sprite (thanks @juanitogan)
* All playback methods: `play`, `playReverse`, `playAfterDelay` and `playAfterRepeat` will now check to see if the given animation key exists locally on the Sprite first. If it does, it's used, otherwise it then checks the global Animation Manager for the key instead.
* `AnimationState.skipMissedFrames` is now used when playing an animation, allowing you to create animations that run at frame rates far exceeding the refresh rate, or that will update to the correct frame should the game lag. Feature #4232 (thanks @colorcube)
* `AnimationManager.addMix` is a new method that allows you to create mixes between two animations. Mixing allows you to specify a unique delay between a pairing of animations. When playing Animation A on a Game Object, if you then play Animation B, and a mix exists, it will wait for the specified delay to be over before playing Animation B. This allows you to customise smoothing between different types of animation, such as blending between an idle and a walk state, or a running and a firing state.
* `AnimationManager.getMix` is a new method that will return the mix duration between the two given animations.
* `AnimationManager.removeMix` is a new method that will remove the mixture between either two animations, or all mixtures for the given animation.
* `AnimationState.remove` is a new method that will remove a locally stored Animation instance from a Sprite.
* `AnimationState.get` is a new method that will return a locally stored Animation instance from the Sprite.
* `AnimationState.exists` is a new method that will check if a locally stored Animation exists on the Sprite.
* The internal `AnimationState.remove` method has been renamed to `globalRemove`.
* `AnimationState.textureManager` is a new property that references the global Texture Manager.
* `AnimationState.anims` is a new property that contains locally created Animations in a Custom Map.
* `AnimationState.play` and `Sprite.play` no longer accept a `startFrame` parameter. Please set it via the `PlayAnimationConfig` instead.
* `AnimationState.playReverse` and `Sprite.playReverse` no longer accept a `startFrame` parameter. Please set it via the `PlayAnimationConfig` instead.
* The `AnimationState.delayedPlay` method has been renamed to `playAfterDelay`. The parameter order has also changed, so the key now comes first instead of the duration.
* The `AnimationState.stopOnRepeat` method has been renamed to `stopAfterRepeat`
* The `AnimationState.getCurrentKey` method has been renamed to `getName`.
* `AnimationState.getFrameName` is a new method that will return the key of the current Animation Frame, if an animation has been loaded.
* `AnimationState.playAfterDelay` and `Sprite.playAfterDelay` are new methods that will play the given animation after the delay in ms expires.
* `AnimationState.playAfterRepeat` and `Sprite.playAfterRepeat` are new methods that will play the given animation after the current animation finishes repeating. You can also specify the number of repeats allowed left to run.
* The `AnimationState.chain` method is now available on the Sprite class.
* The `AnimationState.stopAfterDelay` method is now available on the Sprite class.
* The `AnimationState.stopAfterRepeat` method is now available on the Sprite class.
* The `AnimationState.stopOnFrame` method is now available on the Sprite class.
* `AnimationManager.createFromAseprite` is a new method that allows you to use animations created in the Aseprite editor directly in Phaser. Please see the comprehensive documentation for this method for full details on how to do this.
* `AnimationState` now handles all of the loading of the animation. It no longer has to make calls out to the Animation Manager or Animation instance itself and will load the animation data directly, replacing as required from the optional `PlayAnimationConfig`. This improves performance and massively reduces CPU calls in animation heavy games.
* The `PlayAnimationConfig.frameRate` property lets you optionally override the animation frame rate.
* The `PlayAnimationConfig.duration` property lets you optionally override the animation duration.
* The `PlayAnimationConfig.delay` property lets you optionally override the animation delay.
* The `PlayAnimationConfig.repeat` property lets you optionally override the animation repeat counter.
* The `PlayAnimationConfig.repeatDelay` property lets you optionally override the animation repeat delay value.
* The `PlayAnimationConfig.yoyo` property lets you optionally override the animation yoyo boolean.
* The `PlayAnimationConfig.showOnStart` property lets you optionally override the animation show on start value.
* The `PlayAnimationConfig.hideOnComplete` property lets you optionally override the animation hide on complete value.
* The `PlayAnimationConfig.startFrame` property lets you optionally set the animation frame to start on.
* The `PlayAnimationConfig.timeScale` property lets you optionally set the animation time scale factor.
* `AnimationState.delayCounter` is a new property that allows you to control the delay before an animation will start playing. Only once this delay has expired, will the animation `START` events fire. Fix #4426 (thanks @bdaenen)
* `AnimationState.hasStarted` is a new boolean property that allows you to tell if the current animation has started playing, or is still waiting for a delay to expire.
* `AnimationState.showOnStart` is a new boolean property that controls if the Game Object should have `setVisible(true)` called on it when the animation starts.
* `AnimationState.hideOnComplete` is a new boolean property that controls if the Game Object should have `setVisible(false)` called on it when the animation completes.
* The `AnimationState.chain` method docs said it would remove all pending animations if called with no parameters. However, it didn't - and now does!
* The `AnimationState.setDelay` method has been removed. It never actually worked and you can now perform the same thing by calling either `playAfterDelay` or setting the `delay` property in the play config.
* The `AnimationState.getDelay` method has been removed. You can now read the `delay` property directly.
* The `AnimationState.setRepeat` method has been removed. You can achieve the same thing by setting the `repeat` property in the play config, or adjusting the public `repeatCounter` property if the animation has started.
* `AnimationState.handleStart` is a new internal private method that handles the animation start process.
* `AnimationState.handleRepeat` is a new internal private method that handles the animation repeat process.
* `AnimationState.handleStop` is a new internal private method that handles the animation stop process.
* `AnimationState.handleComplete` is a new internal private method that handles the animation complete process.
* `AnimationState.emitEvents` is a new internal private method that emits animation events, cutting down on duplicate code.
* The `AnimationState.restart` method has a new optional boolean parameter `resetRepeats` which controls if you want to reset the repeat counter during the restart, or not.
* `Animation.getTotalFrames` is a new method that will return the total number of frames in the animation. You can access it via `this.anims.currentAnim.getTotalFrames` from a Sprite.
* `Animation.calculateDuration` is a new method that calculates the duration, frameRate and msPerFrame for a given animation target.
* The `BuildGameObjectAnimation` function now uses the `PlayAnimationConfig` object to set the values.
* `Sprite.playReverse` is a new method that allows you to play the given animation in reverse on the Sprite.
* `Sprite.playAfterDelay` is a new method that allows you to play the given animation on the Sprite after a delay.
* `Sprite.stop` is a new method that allows you to stop the current animation on the Sprite.
* `AnimationManager.load` has been removed as it's no longer required.
* `AnimationManager.staggerPlay` has been fixed so you can now pass in negative stagger values.
* `AnimationManager.staggerPlay` has a new optional boolean parameter `staggerFirst`, which allows you to either include or exclude the first child in the stagger calculations.
* The `Animation.completeAnimation` method has been removed as it's no longer required.
* The `Animation.load` method has been removed as it's no longer required.
* The `Animation.setFrame` method has been removed as it's no longer required.
* The `Animation.getFirstTick` method has no longer needs the `includeDelay` parameter, as it's handled by `AnimationState` now.
* The `Animation.getFrames` method has a new optional boolean parameter `sortFrames` which will run a numeric sort on the frame names after constructing them, if a string-based frame is given.
* `Types.Animations.Animation` has a new boolean property `sortFrames`, which lets Phaser numerically sort the generated frames.
* `AnimationState.timeScale` is a new public property that replaces the old private `_timeScale` property.
* `AnimationState.delay` is a new public property that replaces the old private `_delay` property.
* `AnimationState.repeat` is a new public property that replaces the old private `_repeat` property.
* `AnimationState.repeatDelay` is a new public property that replaces the old private `_repeatDelay` property.
* `AnimationState.yoyo` is a new public property that replaces the old private `_yoyo` property.
* `AnimationState.inReverse` is a new public property that replaces the old private `_reverse` property.
* `AnimationState.startAnimation` is a new public method that replaces the old private `_startAnimation` method.
* The `AnimationState.getProgress` method has been fixed so it will return correctly if the animation is playing in reverse.
* The `AnimationState.globalRemove` method will now always be called when an animation is removed from the global Animation Manager, not just once.
* The `AnimationState.getRepeat` method has now been removed. You can get the value from the `repeat` property.
* The `AnimationState.setRepeatDelay` method has now been removed. You can set the value using the `repeatDelay` config property, or changing it at run-time.
* `AnimationState.complete` is a new method that handles the completion in animation playback.
* The `AnimationState.setTimeScale` method has now been removed. You can set the value using the `timeScale` config property, or changing it at run-time.
* The `AnimationState.getTimeScale` method has now been removed. You can read the value using the `timeScale` property.
* The `AnimationState.getTotalFrames` method has been fixed and won't error if called when no animation is loaded.
* The `AnimationState.setYoyo` method has now been removed. You can set the value using the `yoyo` config property, or changing it at run-time.
* The `AnimationState.getYoyo` method has now been removed. You can read the value using the `yoyo` property.
* The `AnimationState.stopAfterRepeat` method now has an optional parameter `repeatCount`, so you can tell the animation to stop after a specified number of repeats, not just 1.
* When playing an animation in reverse, if it reached the first frame and had to repeat, it would then jump to the frame before the final frame and carry on, skipping out the final frame.
* The `AnimationState.updateFrame` method has now been removed. Everything is handled by `setCurrentFrame` instead, which removes one extra step out of the update process.
* `GenerateFrameNames` will now `console.warn` if the generated frame isn't present in the texture, which should help with debugging animation creation massively.
* `GenerateFrameNumbers` will now `console.warn` if the generated frame isn't present in the texture, which should help with debugging animation creation massively.
* `GenerateFrameNumbers` would include the __BASE frame by mistake in its calculations. This didn't end up in the final animation, but did cause a cache miss when building the animation.
* `GenerateFrameNumbers` can now accept the `start` and `end` parameters in reverse order, meaning you can now do `{ start: 10, end: 1 }` to create the animation in reverse.
* `GenerateFrameNames` can now accept the `start` and `end` parameters in reverse order, meaning you can now do `{ start: 10, end: 1 }` to create the animation in reverse.

### Tilemap - New Features, Updates and API Changes

There are three large changes to Tilemaps in 3.50. If you use tilemaps, you must read this section:

1) The first change is that there are no longer `DynamicTilemapLayer` and `StaticTilemapLayer` classes. They have both been removed and replaced with the new `TilemapLayer` class. This new class consolidates features from both and provides a lot cleaner API experience, as well as speeding up internal logic.

In your game where you use `map.createDynamicLayer` or `map.createStaticLayer` replace it with `map.createLayer` instead.

2) The second change is that the Tilemap system now supports isometric, hexagonal and staggered isometric map types, along with the previous orthogonal format, thanks to a PR from @svipal. You can now export maps using any of these orientations from the Tiled Map Editor and load them into Phaser using the existing tilemap loading API. No further changes need to take place in the way your maps are loaded.

3) The `Tilemap.createFromObjects` method has been overhauled to make it much more useful. The method signature has changed and it now takes a new `CreateFromObjectLayerConfig` configuration object, or an array of them, which allows much more fine-grained control over which objects in the Tiled Object Layers are converted and what they are converted to. Previously it could only convert to Sprites, but you can now pass in a custom class, filter based on id, gid or name, even provide a Container to add the created Game Objects to. Please see the new documentation for this method and the config object for more details. Fix #3817 #4613 (thanks @georgzoeller @Secretmapper)

* The `Tilemap.createDynamicLayer` method has been renamed to `createLayer`.
* The `Tilemap.createStaticLayer` method has been removed. Use `createLayer` instead.
* The `Tilemap.createBlankDynamicLayer` method has been renamed to `createBlankLayer`.
* The `Tilemap.convertLayerToStatic` method has been removed as it is no longer required.
* The `TilemapLayerWebGLRenderer` function will no longer iterate through the layer tilesets, drawing tiles from only that set. Instead all it does now is iterate directly through only the tiles. This allows it to take advantage of the new Multi Texturing pipeline and also draw multi-tileset isometric layers correctly.
* `Phaser.Types.Tilemaps.TilemapOrientationType` is a new type def that holds the 4 types of map orientation now supported.
* The `Tile.updatePixelXY` method now updates the tile XY position based on map type.
* `ParseTilesets` will now correctly handle non-consecutive tile IDs. It also now correctly sets the `maxId` property, fixing a bug where tiles wouldn't render if from IDs outside the expected range. Fix #4367 (thanks @jackfreak)
* `Tilemap.hexSideLength` is a new property that holds the length of the hexagon sides, if using Hexagonal Tilemaps.
* `LayerData.orientation` is a new property that holds the tilemap layers orientation constant.
* `LayerData.hexSideLength` is a new property that holds the length of the hexagon sides, if using Hexagonal Tilemaps.
* `MapData.orientation` is a new property that holds the tilemap layers orientation constant.
* `MapData.hexSideLength` is a new property that holds the length of the hexagon sides, if using Hexagonal Tilemaps.
* `Tilemaps.Components.HexagonalWorldToTileY` is a new function that converts a world Y coordinate to hexagonal tile Y coordinate.
* `Tilemaps.Components.StaggeredWorldToTileY` is a new function that converts a world Y coordinate to staggered tile Y coordinate.
* `Tilemaps.Components.HexagonalWorldToTileXY` is a new function that converts world coordinates to hexagonal tile coordinates.
* `Tilemaps.Components.IsometricWorldToTileXY` is a new function that converts world coordinates to isometric tile coordinates.
* `Tilemaps.Components.StaggeredWorldToTileXY` is a new function that converts world coordinates to staggered tile coordinates.
* `Tilemaps.Components.HexagonalTileToWorldY` is a new function that converts a hexagonal Y coordinate to a world coordinate.
* `Tilemaps.Components.StaggeredTileToWorldY` is a new function that converts a staggered Y coordinate to a world coordinate.
* `Tilemaps.Components.HexagonalTileToWorldXY` is a new function that converts hexagonal tile coordinates to world coordinates.
* `Tilemaps.Components.IsometricTileToWorldXY` is a new function that converts isometric tile coordinates to world coordinates.
* `Tilemaps.Components.StaggeredTileToWorldXY` is a new function that converts staggered tile coordinates to world coordinates.
* `Tilemaps.Components.GetTileToWorldXFunction` is a new function that returns the correct conversion function to use.
* `Tilemaps.Components.GetTileToWorldYFunction` is a new function that returns the correct conversion function to use.
* `Tilemaps.Components.GetTileToWorldXXFunction` is a new function that returns the correct conversion function to use.
* `Tilemaps.Components.GetWorldToTileXFunction` is a new function that returns the correct conversion function to use.
* `Tilemaps.Components.GetWorldToTileYFunction` is a new function that returns the correct conversion function to use.
* `Tilemaps.Components.GetWorldToTileXYFunction` is a new function that returns the correct conversion function to use.
* `Tilemaps.Components.GetCullTilesFunction` is a new function that returns the correct culling function to use.
* `Tilemaps.Components.HexagonalCullTiles` is a new function that culls tiles in a hexagonal map.
* `Tilemaps.Components.StaggeredCullTiles` is a new function that culls tiles in a staggered map.
* `Tilemaps.Components.IsometricCullTiles` is a new function that culls tiles in a isometric map.
* `Tilemaps.Components.CullBounds` is a new function that calculates the cull bounds for an orthogonal map.
* `Tilemaps.Components.HexagonalCullBounds` is a new function that calculates the cull bounds for a hexagonal map.
* `Tilemaps.Components.StaggeredCullBounds` is a new function that calculates the cull bounds for a staggered map.
* `Tilemaps.Components.RunCull` is a new function that runs the culling process from the combined bounds and tilemap.
* `Tilemap._convert` is a new internal private hash of tilemap conversion functions used by the public API.
* The `Tilemap._isStaticCall` method has been removed and no Tilemap methods now check this, leading to faster execution.
* The Arcade Physics Sprites vs. Tilemap Layers flow has changed. Previously, it would iterate through a whole bunch of linked functions, taking lots of jumps in the process. It now just calls the `GetTilesWithinWorldXY` component directly, saving lots of overhead.

### Mesh Game Object - New Features, Updates and API Changes

The Mesh Game Object has been rewritten from scratch in v3.50 with a lot of changes to make it much more useful. It is accompanied by the new `Geom.Mesh` set of functions.

* `Geom.Mesh` is a new namespace that contains the Mesh related geometry functions. These are stand-alone functions that you may, or may not require, depending on your game.
* `Geom.Mesh.Vertex` is a new class that encapsulates all of the data required for a single vertex, including position, uv, normals, color and alpha.
* `Geom.Mesh.Face` is a new class that consists of references to the three `Vertex` instances that construct a single Face in a Mesh and provides methods for manipulating them.
* `Geom.Mesh.GenerateVerts` is a new function that will return an array of `Vertex` and `Face` objects generated from the given data. You can provide index, or non-index vertex lists, along with UV data, normals, colors and alpha which it will parse and return the results from.
* `Geom.Mesh.GenerateGridVerts` is a new function that will generate a series of `Vertex` objects in a grid format, based on the given `GenerateGridConfig` config file. You can set the size of the grid, the number of segments to split it into, translate it, color it and tile the texture across it. The resulting data can be easily used by a Mesh Game Object.
* `Geom.Mesh.GenerateObjVerts` is a new function that will generate a series of `Vertex` objects based on the given parsed Wavefront Obj Model data. You can optionally scale and translate the generated vertices and add them to a Mesh.
* `Geom.Mesh.ParseObj` is a new function that will parse a triangulated Wavefront OBJ file into model data into a format that the `GenerateObjVerts` function can consume.
* `Geom.Mesh.ParseObjMaterial` is a new function that will parse a Wavefront material file and extract the diffuse color data from it, combining it with the parsed object data.
* `Geom.Mesh.RotateFace` is a new function that will rotate a Face by a given amount, based on an optional center of rotation.
* `Loader.OBJFile` is a new File Loader type that can load triangulated Wavefront OBJ files, and optionally material files, which are then parsed and stored in the OBJ Cache.
* The Mesh constructor and `MeshFactory` signatures have changed to `scene, x, y, texture, frame, vertices, uvs, indicies, containsZ, normals, colors, alphas`. Note the way the Texture and Frame parameters now comes first. `indicies` is a new parameter that allows you to provide indexed vertex data to create the Mesh from, where the `indicies` array holds the vertex index information. The final list of vertices is built from this index along with the provided vertices and uvs arrays. The `indicies` array is optional. If your data is not indexed, then simply pass `null` or an empty array for this parameter.
* The `Mesh` Game Object now has the Animation State Component. This allows you to create and play animations across the texture of a Mesh, something that previously wasn't possible. As a result, the Mesh now adds itself to the Update List when added to a Scene.
* `Mesh.addVertices` is a new method that allows you to add vertices to a Mesh Game Object based on the given parameters. This allows you to modify a mesh post-creation, or populate it with data at a later stage.
* `Mesh.addVerticesFromObj` is a new method that will add the model data from a loaded Wavefront OBJ file to a Mesh. You load it via the new `OBJFile` with a `this.load.obj` call, then you can use the key with this method. This method also takes an optional scale and position parameters to control placement of the created model within the Mesh.
* `Mesh.hideCCW` is a new boolean property that, when enabled, tells a Face to not render if it isn't counter-clockwise. You can use this to hide backward facing Faces.
* `Mesh.modelPosition` is a new Vector3 property that allows you to translate the position of all vertices in the Mesh.
* `Mesh.modelRotation` is a new Vector3 property that allows you to rotate all vertices in the Mesh.
* `Mesh.modelScale` is a new Vector3 property that allows you to scale all vertices in the Mesh.
* `Mesh.panX` is a new function that will translate the view position of the Mesh on the x axis.
* `Mesh.panY` is a new function that will translate the view position of the Mesh on the y axis.
* `Mesh.panZ` is a new function that will translate the view position of the Mesh on the z axis.
* `Mesh.setPerspective` is a new method that allows you to set a perspective projection matrix based on the given dimensions, fov, near and far values.
* `Mesh.setOrtho` is a new method that allows you to set an orthographic projection matrix based on the given scale, near and far values.
* `Mesh.clear` is a new method that will destroy all Faces and Vertices and clear the Mesh.
* `Mesh.depthSort` is a new method that will run a depth sort across all Faces in the Mesh by sorting them based on their average depth.
* `Mesh.addVertex` is a new method that allows you to add a new single Vertex into the Mesh.
* `Mesh.addFace` is a new method that allows you to add a new Face into the Mesh. A Face must consist of 3 Vertex instances.
* `Mesh.getFaceCount` new is a new method that will return the total number of Faces in the Mesh.
* `Mesh.getVertexCount` new is a new method that will return the total number of Vertices in the Mesh.
* `Mesh.getFace` new is a new method that will return a Face instance from the Mesh based on the given index.
* `Mesh.getFaceAt` new is a new method that will return an array of Face instances from the Mesh based on the given position. The position is checked against each Face, translated through the optional Camera and Mesh matrix. If more than one Face intersects, they will all be returned but the array will be depth sorted first, so the first element will be that closest to the camera.
* `Mesh.vertices` is now an array of `GameObject.Vertex` instances, not a Float32Array.
* `Mesh.faces` is a new array of `GameObject.Face` instances, which is populated during a call to methods like `addVertices` or `addModel`.
* `Mesh.totalRendered` is a new property that holds the total number of Faces that were rendered in the previous frame.
* `Mesh.setDebug` is a new method that allows you to render a debug visualisation of the Mesh vertices to a Graphics Game Object. You can provide your own Graphics instance and optionally callback that is invoked during rendering. This allows you to easily visualise the vertices of your Mesh to help debug UV mapping.
* The Mesh now renders by iterating through the Faces array, not the vertices. This allows you to use Array methods such as `BringToTop` to reposition a Face, thus changing the drawing order without having to repopulate all of the vertices. Or, for a 3D model, you can now depth sort the Faces.
* The `Mesh` Game Object now extends the `SingleAlpha` component and the alpha value is factored into the final alpha value per vertex during rendering. This means you can now set the whole alpha across the Mesh using the standard `setAlpha` methods. But, if you wish to, you can still control the alpha on a per-vertex basis as well.
* The Mesh renderer will now check to see if the pipeline capacity has been exceeded for every Face added, allowing you to use Meshes with vertex counts that exceed the pipeline capacity without causing runtime errors.
* You can now supply just a single numerical value as the `colors` parameter in the constructor, factory method and `addVertices` method. If a number, instead of an array, it will be used as the color for all vertices created.
* You can now supply just a single numerical value as the `alphas` parameter in the constructor, factory method and `addVertices` method. If a number, instead of an array, it will be used as the alpha for all vertices created.
* `Mesh.debugGraphic` is a new property that holds the debug Graphics instance reference.
* `Mesh.debugCallback` is a new property that holds the debug render callback.
* `Mesh.renderDebugVerts` is a new method that acts as the default render callback for `setDebug` if none is provided.
* `Mesh.preDestroy` is a new method that will clean-up the Mesh arrays and debug references on destruction.
* `Mesh.isDirty` is a new method that will check if any of the data is dirty, requiring the vertices to be transformed. This is called automatically in `preUpdate` to avoid generating lots of math when nothing has changed.
* The `Mesh.uv` array has been removed. All UV data is now bound in the Vertex instances.
* The `Mesh.colors` array has been removed. All color data is now bound in the Vertex instances.
* The `Mesh.alphas` array has been removed. All color data is now bound in the Vertex instances.
* The `Mesh.tintFill` property is now a `boolean` and defaults to `false`.

### Quad Game Object Removed

The `Quad` Game Object has been removed from v3.50.0.

You can now create your own Quads easily using the new `Geom.Mesh.GenerateGridVerts` function, which is far more flexible than the old quads were.

### Input / Mouse Updates and API Changes

* `ScaleManager.refresh` is now called when the `Game.READY` event fires. This fixes a bug where the Scale Manager would have the incorrect canvas bounds, because they were calculated before a previous canvas was removed from the DOM. Fix #4862 (thanks @dranitski)
* The Game Config property `inputMouseCapture` has been removed, as this is now split into 3 new config options:
* `inputMousePreventDefaultDown` is a new config option that allows you to control `preventDefault` calls specifically on mouse down events. Set it via `input.mouse.preventDefaultDown` in the Game Config. It defaults to `true`, the same as the previous `capture` property did.
* `inputMousePreventDefaultUp` is a new config option that allows you to control `preventDefault` calls specifically on mouse up events. Set it via `input.mouse.preventDefaultUp` in the Game Config. It defaults to `true`, the same as the previous `capture` property did.
* `inputMousePreventDefaultMove` is a new config option that allows you to control `preventDefault` calls specifically on mouse move events. Set it via `input.mouse.preventDefaultMove` in the Game Config. It defaults to `true`, the same as the previous `capture` property did.
* `inputMousePreventDefaultWheel` is a new config option that allows you to control `preventDefault` calls specifically on mouse wheel events. Set it via `input.mouse.preventDefaultWheel` in the Game Config. It defaults to `true`, the same as the previous `capture` property did.
* The `MouseManager.capture` property has been removed, as this is now split into 3 new config options (see below)
* `MouseManager.preventDefaultDown` is a new boolean property, set via the `inputMousePreventDefaultDown` config option that allows you to toggle capture of mouse down events at runtime.
* `MouseManager.preventDefaultUp` is a new boolean property, set via the `inputMousePreventDefaultUp` config option that allows you to toggle capture of mouse up events at runtime.
* `MouseManager.preventDefaultMove` is a new boolean property, set via the `inputMousePreventDefaultMove` config option that allows you to toggle capture of mouse move events at runtime.
* `MouseManager.preventDefaultWheel` is a new boolean property, set via the `inputMousePreventDefaultWheel` config option that allows you to toggle capture of mouse wheel at runtime.
* In the `MouseManager` the up, down and move events are no longer set as being passive if captured. Over, Out, Wheel and the Window level Down and Up events are always flagged as being passive. Wheel events are non-passive if capturing is enabled.
* The `GamepadPlugin` will now call `refreshPads` as part of its start process. This allows you to use Gamepads across multiple Scenes, without having to wait for a connected event from each one of them. If you've already had a connected event in a previous Scene, you can now just read the pads directly via `this.input.gamepad.pad1` and similar. Fix #4890 (thanks @Sytten)
* Shutting down the Gamepad plugin (such as when sleeping a Scene) no longer calls `GamepadPlugin.disconnectAll`, but destroying it does.
* `Gamepad._created` is a new private internal property that keeps track of when the instance was created. This is compared to the navigator timestamp in the update loop to avoid event spamming. Fix #4890.
* `Pointer.down` will now check if the browser is running under macOS and if the ctrl key was also pressed, if so, it will flag the down event as being a right-click instead of a left-click, as per macOS conventions. Fix #4245 (thanks @BigZaphod)
* When destroying an interactive Game Object that had `useHandCursor` enabled, it would reset the CSS cursor to default, even if the cursor wasn't over that Game Object. It will now only reset the cursor if it's over the Game Object being destroyed. Fix #5321 (thanks @JstnPwll)
* The `InputPlugin.shutdown` method will now reset the CSS cursor, in case it was set by any Game Objects in the Scene that have since been destroyed.
* The `InputPlugin.processOverEvents` has had a duplicate internal loop removed from it (thanks KingCosmic)

### Tint Updates and Shader Changes

Phaser has had the ability to apply an additive tint to a Game Object since the beginning, and gained 'filled tints', with and without texture alpha, in v3.11. While this was handy, it introduced a 3-way if-else condition to the shaders to handle the different modes. Plus, setting tint colors was also generating rgb order Float32 color values for each Game Object, making reading those colors back again difficult (as they'd return in BGR order).

This has all changed in 3.50, as outlined below. Tint values are now used directly in the shader and don't pass through a color conversion function first. Lots of private properties have been removed and the shaders no longer have a 3-way if-else block. All of this means improved performance and a slight reduction in memory overhead.

* `Tint.tintTopLeft` is now a normal property in RGB order, not a setter, and no longer passes through the `GetColorFromValue` function. This directly replaces the private property `_tintTL` which has now been removed.
* `Tint.tintTopRight` is now a normal property in RGB order, not a setter, and no longer passes through the `GetColorFromValue` function. This directly replaces the private property `_tintTR` which has now been removed.
* `Tint.tintBottomLeft` is now a normal property in RGB order, not a setter, and no longer passes through the `GetColorFromValue` function. This directly replaces the private property `_tintBL` which has now been removed.
* `Tint.tintBottomRight` is now a normal property in RGB order, not a setter, and no longer passes through the `GetColorFromValue` function. This directly replaces the private property `_tintBR` which has now been removed.
* The property `Tint._isTinted` has been removed as it's no longer required.
* The `Single.frag`, `Light.frag` and `Multi.frag` shaders have all been updated so they now read the color value as `outTint.bgr` instead of `outTint.rgb`. This allows the colors to remain in RGB order within the Tint component.
* The `Single.frag`, `Light.frag` and `Multi.frag` shaders have all been updated so they no longer have a 3-way check on the `outTintEffect` value.
* The `Multi Pipeline`, `Bitmap Text`, `Render Texture`, `Text`, `TileSprite` and `Camera` now all read the tint values from the public properties instead of the private `_tintTL` etc ones. They also now set the `tintEffect` value directly from the `tintFill` property, removing another conditional check.
* The function `GetColorFromValue` has been removed as it's no longer used internally.
* The `Rope.tintFill` property is now a boolean, not an integer, and can no longer take `2` as a value for a complete fill. Instead, you should provide a solid color texture with no alpha.
* As a result of the change to the shader, all uses of the WebGL Util function `getTintAppendFloatAlphaAndSwap` have been replaced with `getTintAppendFloatAlpha` instead.
* As a result of the change to the shader, the Multi Pipeline now uses the `WebGLRenderer.whiteTexture` and `tintEffect` mode of 1 by default, instead of mode 2 (which has been removed) and a transparent texture. This ensures Graphics and Shapes objects still render correctly under the new smaller shader code.
* `WebGLRenderer.whiteTexture` is a new property that is a reference to a pure white 4x4 texture that is created during Boot by the Texture Manager. The Graphics Pipeline uses this internally for all geometry fill rendering.
* The `TextureManager` now generates a new texture with the key `__WHITE` durings its boot process. This is a pure white 4x4 texture used by the Graphics pipelines.
* `Config.images.white` is a new Game Config property that specifies the 4x4 white PNG texture used by Graphics rendering. You can override this via the config, but only do so if needed.

### Arcade Physics Updates

Prior to v3.50 an Arcade Physics Body could be one of two states: immovable, or moveable. An immovable body could not receive _any_ impact from another Body. If something collided with it, it wouldn't even separate to break free from the collision (the other body had to take the full separation value). It was intended for objects such as platforms, ground or walls, there they absolutely shouldn't move under any circumstances. As a result, two immovable bodies could never be collided together. While this worked for scenery-like items, it didn't work if you required maybe 2 players who could collide with each other, but should never be able to push one another. As of 3.50 all physics bodies now have a new property `pushable` that allows this. A pushable body can share separation with its collider, as well as take on mass-based velocity from the impact. A non-pushable body will behave differently depending on what it collides with. For example, a pushable body hitting a non-pushable (or immoveable) body will rebound off it.

* The Arcade Physics `Body` class has a new boolean property `pushable` (true, by default). This allows you to set if a Body can be physically pushed by another Body, or not. Fix #4175 #4415 (thanks @inmylo @CipSoft-Components)
* `Body.setPushable` is a new chainable method that allows you to set the `pushable` state of a Body.
* `Arcade.Components.Pushable` is a new component, inherited by the standard Arcade Physics Image and Sprite classes.
* Bodies will now check to see if they are blocked in the direction they're being pushed, before resolving the collision. This helps stop some bodies from being pushed into other objects.
* Bodies will now check which direction they were moving and separate accordingly. This helps stop some bodies from being pushed into other objects.
* `ArcadePhysics.disableUpdate` is a new method that will prevent the Arcade Physics World `update` method from being called when the Scene updates. By disabling it, you're free to call the update method yourself, passing in your own delta and time values.
* `ArcadePhysics.enableUpdate` is a new method that will make the Arcade Physics World update in time with the Scene update. This is the default, so only call this if you have specifically disabled it previously.
* `ArcadeWorldConfig.customUpdate` is a new boolean property you can set in the Arcade Physics config object, either in the Scene or in the Game Config. If `true` the World update will never be called, allowing you to call it yourself from your own component. Close #5190 (thanks @cfortuner)
* `Physics.Arcade.Body.setCollideWorldBounds` now has a new optional parameter `onWorldBounds` which allows you to enable the Body's `onWorldBounds` property in the same call (thanks @samme)
* `ArcadePhysics.Body.setMaxVelocityX` is a new method that allows you to set the maximum horizontal velocity of a Body (thanks @samme)
* `ArcadePhysics.Body.setMaxVelocityY` is a new method that allows you to set the maximum vertical velocity of a Body (thanks @samme)
* The `PhysicsGroup` config now has two new optional properties `maxVelocityX` and `maxVelocityY` which allows you to set the maximum velocity on bodies added to the Group (thanks @samme)
* The `Arcade.Body.resetFlags` method has a new optional boolean parameter `clear`. If set, it clears the `wasTouching` flags on the Body. This happens automatically when `Body.reset` is called. Previous to this, the flags were not reset until the next physics step (thanks @samme)
* `Physics.Arcade.ProcessX` is a new set of functions, called by the `SeparateX` function, that handles all of the different collision tests, checks and resolutions. These functions are not exposed in the public API.
* `Physics.Arcade.ProcessY` is a new set of functions, called by the `SeparateY` function, that handles all of the different collision tests, checks and resolutions. These functions are not exposed in the public API.
* `Arcade.Body.center` values were incorrect after collisions with the world bounds or (for rectangular bodies) after collisions with another body. The body center is now updated after those separations (thanks @samme)
* The Arcade Physics `WORLD_STEP` event now has a new parameter: the delta argument (thanks @samme)
* The Arcade Body `drag` property has been redefined when damping is used and scales the damping multiplier by the physics step delta. Drag is now the velocity retained after 1 second instead of after 1 step, when damping is used. This makes damping consistent for different physics step rates and more accurate when fixedStep is off. If you use `drag` you will need to change any existing drag values to get the same effects as before. Convert `drag` to `drag ^ 60` or `drag ^ fps` if you use a different step rate (thanks @samme)

### Loader Cache Changes

When loading any of the file types listed below it will no longer store the data file in the cache. For example, when loading a Texture Atlas using a JSON File, it used to store the parsed image data in the Texture Manager and also store the JSON in the JSON Cache under the same key. This has changed in 3.50. The data files are no longer cached, as they are not required by the textures once parsing is completed, which happens during load. This helps free-up memory. How much depends on the size of your data files. And also allows you to easily remove textures based on just their key, without also having to clear out the corresponding data cache.

* `AtlasJSONFile` no longer stores the JSON in the JSON Cache once the texture has been created.
* `AtlasXMLFile` no longer stores the XML in the XML Cache once the texture has been created.
* `UnityAtlasFile` no longer stores the Text in the Text Cache once the texture has been created.
* `BitmapFontFile` no longer stores the XML in the XML Cache once the texture has been created.
* You can now use `TextureManager.remove` to remove a texture and not have to worry about clearing the corresponding JSON or XML cache entry as well in order to reload a new texture using the same key. Fix #5323 (thanks @TedGriggs)

### ColorMatrix

* `Phaser.Display.ColorMatrix` is a new class that allows you to create and manipulate a 5x4 color matrix, which can be used by shaders or graphics operations.
* The `ColorMatrix.set` method allows you to set the values of a ColorMatrix.
* The `ColorMatrix.reset` method will reset the ColorMatrix to its default values.
* The `ColorMatrix.getData` method will return the data in the ColorMatrix as a Float32Array, useful for setting in a shader uniform.
* The `ColorMatrix.brightness` method lets you set the brightness of the ColorMatrix.
* The `ColorMatrix.saturate` method lets you set the saturation of the ColorMatrix.
* The `ColorMatrix.desaturate` method lets you desaturate the colors in the ColorMatrix.
* The `ColorMatrix.hue` method lets you rotate the hues of the ColorMatrix by the given amount.
* The `ColorMatrix.grayscale` method converts the ColorMatrix to grayscale.
* The `ColorMatrix.blackWhite` method converts the ColorMatrix to black and whites.
* The `ColorMatrix.contrast` method lets you set the contrast of the ColorMatrix.
* The `ColorMatrix.negative` method converts the ColorMatrix to negative values.
* The `ColorMatrix.desaturateLuminance` method applies a desaturated luminance to the ColorMatrix.
* The `ColorMatrix.sepia` method applies a sepia tone to the ColorMatrix.
* The `ColorMatrix.brown` method applies a brown tone to the ColorMatrix.
* The `ColorMatrix.night` method applies a night time effect to the ColorMatrix.
* The `ColorMatrix.lsd` method applies a trippy color effect to the ColorMatrix.
* The `ColorMatrix.vintagePinhole` method applies a vintage pinhole color effect to the ColorMatrix.
* The `ColorMatrix.kodachrome` method applies a kodachrome color effect to the ColorMatrix.
* The `ColorMatrix.technicolor` method applies a technicolor color effect to the ColorMatrix.
* The `ColorMatrix.polaroid` method applies a polaroid color effect to the ColorMatrix.
* The `ColorMatrix.shiftToBGR` method shifts the values of the ColorMatrix into BGR order.
* The `ColorMatrix.multiply` method multiplies two ColorMatrix data sets together.

### Removal of 'resolution' property from across the API

For legacy reasons, Phaser 3 has never properly supported HighDPI devices. It will render happily to them of course, but wouldn't let you set a 'resolution' for the Canvas beyond 1. Earlier versions of 3.x had a resolution property in the Game Config, but it was never fully implemented (for example, it would break zooming cameras). When the Scale Manager was introduced in v3.16 we forced the resolution to be 1 to avoid it breaking anything else internally.

For a long time, the 'resolution' property has been present - taunting developers and confusing new comers. In this release we have finally gone through and removed all references to it. The Game Config option is now gone, it's removed from the Scale Manager, Base Camera and everywhere else where it matters. As much as we would have liked to implement the feature, we've spent too long without it, and things have been built around the assumption it isn't present. The API just wouldn't cope with having it shoe-horned in at this stage. As frustrating as this is, it's even more annoying to just leave the property there confusing people and wasting CPU cycles. Phaser 4 has been built with HighDPI screens in mind from the very start, but it's too late for v3. The following changes are a result of this removal:

* The `Phaser.Scale.Events#RESIZE` event no longer sends the `resolution` as a parameter.
* The `BaseCamera.resolution` property has been removed.
* The internal private `BaseCamera._cx`, `_cy`, `_cw` and `_ch` properties has been removed, use `x`, `y`, `width` and `height` instead.
* The `BaseCamera.preRender` method no longer receives or uses the `resolution` parameter.
* The `Camera.preRender` method no longer receives or uses the `resolution` parameter.
* The `CameraManager.onResize` method no longer receives or uses the `resolution` parameter.
* The `Core.Config.resolution` property has been removed.
* The `TextStyle.resolution` property is no longer read from the Game Config. You can still set it via the Text Style config to a value other than 1, but it will default to this now.
* The `CanvasRenderer` no longer reads or uses the Game Config resolution property.
* The `PipelineManager.resize` method along with `WebGLPipeline.resize` and anything else that extends them no longer receives or uses the `resolution` parameter.
* The `WebGLRenderer.resize` and `onResize` methods no longer receives or uses the `resolution` parameter.
* The `ScaleManager.resolution` property has been removed and all internal use of it.

### Removed 'interpolationPercentage' parameter from all render functions

Since v3.0.0 the Game Object `render` functions have received a parameter called `interpolationPercentage` that was never used. The renderers do not calculate this value and no Game Objects apply it, so for the sake of clairty, reducing code and removing complexity from the API it has been removed from every single function that either sent or expected the parameter. This touches every single Game Object and changes the parameter order as a result, so please be aware of this if you have your own _custom_ Game Objects, or plugins, that implement their own `render` methods. In terms of surface API changes, you shouldn't notice anything at all from this removal.

### New Features

* `Geom.Intersects.GetLineToLine` is a new function that will return a Vector3 containing the point of intersection between 2 line segments, with the `z` property holding the distance value.
* `Geom.Intersects.GetLineToPolygon` is a new function that checks for the closest point of intersection between a line segment and an array of polygons.
* `Geom.Intersects.GetLineToPoints` is a new function that checks for the closest point of intersection between a line segment and an array of points, where each pair of points form a line segment.
* `Geom.Intersects.GetRaysFromPointToPolygon` is a new function that emits rays out from the given point and detects for intersection against all given polygons, returning the points of intersection in the results array.
* `Geom.Polygon.Translate` is a new function that allows you to translate all the points of a polygon by the given values.
* `Geom.Polygon.Simplify` is a new function that takes a polygon and simplifies the points by running them through a combination of Douglas-Peucker and Radial Distance algorithms, potentially dramatically reducing the number of points while retaining its shape.
* `Phaser.Types.Math.Vector3Like` is a new data type representing as Vector 3 like object.
* `Phaser.Types.Math.Vector4Like` is a new data type representing as Vector 4 like object.
* `Transform.getLocalPoint` is a new method, available on all Game Objects, that takes an `x` / `y` pair and translates them into the local space of the Game Object, factoring in parent transforms and display origins.
* The `KeyboardPlugin` will now track the key code and timestamp of the previous key pressed and compare it to the current event. If they match, it will skip the event. On some systems, if you were to type quickly, you would sometimes get duplicate key events firing (the exact same event firing more than once). This is now prevented from happening.
* `Display.Color.GetColorFromValue` is a new function that will take a hex color value and return it as an integer, for use in WebGL. This is now used internally by the Tint component and other classes.
* `Utils.String.RemoveAt` is a new function that will remove a character from the given index in a string and return the new string.
* `Frame.setUVs` is a new method that allows you to directly set the canvas and UV data for a frame. Use this if you need to override the values set automatically during frame creation.
* `TweenManager.getTweensOf` has a new parameter `includePending`. If set, it will also check the pending tweens for the given targets and return those in the results as well. Fix #5260 (thanks @pcharest2000)
* `WebGLPipeline.hasBooted` is a new boolean property that tracks if the pipeline has been booted or not, which is now far more important in 3.5 than in previous versions. This is checked in the `WebGLRenderer.addPipeline` method, and if not set, the pipeline is booted. Fix #5251 #5255 (thanks @telinc1 @rexrainbow)
* The WebGL Renderer will now add the pipelines during the `boot` method, instead of `init`.
* You can now use `this.renderer` from within a Scene, as it's now a Scene-level property and part of the Injection Map.
* `Clock.addEvent` can now take an existing `TimerEvent` object, as well as a config object. If a `TimerEvent` is given it will be removed from the Clock, reset and then added. This allows you to pool TimerEvents rather than constantly create and delete them. Fix #4115 (thanks @jcyuan)
* `Clock.removeEvent` is a new method that allows you to remove a `TimerEvent`, or an array of them, from all internal lists of the current Clock.
* `Group.getMatching` is a new method that will return any members of the Group that match the given criteria, such as `getMatching('visible', true)` (thanks @atursams)
* `Utils.Array.SortByDigits` is a new function that takes the given array of strings and runs a numeric sort on it, ignoring any non-digits.
* `GroupCreateConfig`, which is used when calling `Group.createMultiple` or `Group.createFromConfig`, can now accept the following new properties: `setOrigin: { x, y, stepX, stepY }` which are applied to the items created by the Group.
* `Transform.copyPosition` is a new method that will copy the position from the given object to the Game Object (thanks @samme)
* The `Text.MeasureText` function, which is used to calculate the ascent and descent of Text Game Objects whenever the style, or font size, is changed, has been updated to use the new `actualBoundingBoxAscent` functions present in modern browsers. This allows for significantly faster ascent calculations than previously. Older browsers, such as IE, will still fall back (thanks @rexrainbow)
* `GameObjects.GetCalcMatrix` is a new function that is used to calculate the transformed Game Object matrix, based on the given Game Object, Camera and Parent. This function is now used by the following Game Objects: `BitmapText` (Static and Dynamic), `Graphics`, `Extern`, `Mesh`, `Rope`, `Shader`, `Arc`, `Curve`, `Ellipse`, `Grid`, `IsoBox`, `IsoTriangle`, `Line`, `Polygon`, `Rectangle`, `Star` and `Triangle`. This dramatically reduces the amount of duplicate code across the API.
* `Utils.Array.Matrix.Translate` is a new function that will translate an Array Matrix by horizontally and vertically by the given amounts.
* `Vertor3.addScale` is a new method that will add the given vector and multiply it in the process.
* When defining the ease used with a Particle Emitter you can now set `easeParams` in the config object, allowing you to pass custom ease parameters through to an ease function (thanks @vforsh)
* `BitmapMask.createMask` is a new method that will internally create the WebGL textures and framebuffers required for the mask. This is now used by the constructor and if the context is lost. It now also clears any previous textures/fbos that may have been created first, helping prevent memory leaks.
* `BitmapMask.clearMask` will delete any WebGL textures or framebuffers the mask is using. This is now called when the mask is destroyed, or a new mask is created upon it.
* `Quaternion` now has a new property `onChangeCallback` which, if set, will be invoked each time the quaternion is updated. This allows you to link change events to other objects.
* The `Quaternion.set` method has a new optional boolean parameter `update` (defaults to `true`), which will call the `onChangeCallback` if set.
* `Quaternion.setFromEuler` is a new method that will set the quaternion from the given `Euler` object, optionally calling the `onChangeCallback` in the process.
* `Quaternion.setFromRotationMatrix` is a new method that will set the rotation of the quaternion from the given Matrix4.
* `Vector3.setFromMatrixPosition` is a new method that will set the components of the Vector3 based on the position of the given Matrix4.
* `Vector3.setFromMatrixColumn` is a new method that will set the components of the Vector3 based on the specified Matrix4 column.
* `Vector3.fromArray` is a new method that will set the components of the Vector3 based on the values in the given array, at the given offset.
* `Vector3.min` is a new method that will set the components of the Vector3 based on the `Main.min` between it and the given Vector3.
* `Vector3.max` is a new method that will set the components of the Vector3 based on the `Main.max` between it and the given Vector3.
* `Vector3.addVectors` is a new method that will set the components of the Vector3 based on the addition of the two Vector3s given.
* `Vector3.addScalar` is a new method that will multiply the components of the Vector3 by the scale value given.
* `Vector3.applyMatrix3` is a new method that will take a Matrix3 and apply it to the Vector3.
* `Vector3.applyMatrix4` is a new method that will take a Matrix4 and apply it to the Vector3.
* `Vector3.projectViewMatrix` is a new method that multiplies the Vector3 by the given view and projection matrices.
* `Vector3.unprojectViewMatrix` is a new method that multiplies the Vector3 by the given inversed projection matrix and world matrix.
* `Matrix4.setValues` is a new method that allows you to set all of the matrix components individually. Most internal methods now use this.
* `Matrix.multiplyToMat4` is a new method that multiplies a Matrix4 by the given `src` Matrix4 and stores the results in the `out` Matrix4.
* `Matrix4.fromRotationXYTranslation` is a new method that takes the rotation and position vectors and builds this Matrix4 from them.
* `Matrix4.getMaxScaleOnAxis` is a new method that will return the maximum axis scale from the Matrix4.
* `Matrix4.lookAtRH` is a new method that will generate a right-handed look-at matrix from the given eye, target and up positions.
* `Matrix4.transform` is a new method that will generate a transform matrix from the given position and scale vectors and a rotation quaternion.
* `Matrix4.multiplyMatrices` is a new method that multiplies two given Matrix4 objects and stores the results in the Matrix4.
* `Matrix4.premultiply` is a new method that takes a Matrix4 and multiplies it by the current Matrix4.
* `Matrix4.getInverse` is a new method that takes a Matrix4, copies it to the current matrix, then returns the inverse of it.
* `CameraManager.getVisibleChildren` is a new method that is called internally by the `CameraManager.render` method. It filters the DisplayList, so that Game Objects that pass the `willRender` test for the given Camera are added to a sub-list, which is then passed to the renderer. This avoids the renderer having to do any checks on the children, it just renders each one in turn.
* `Physics.Arcade.Body.setDamping` is a new method that allows you to set the `useDamping` property of a Body in a chainable way. Fix #5352 (thanks @juanitogan)
* The `GameObjects.Graphics.fillGradientStyle` method can now accept a different alpha value for each of the fill colors. The default is still 1. If you only provide a single alpha, it'll be used for all colors. Fix #5044 (thanks @zhangciwu)
* `Types.Core.PipelineConfig` is a new configuration object that you can set in the Game Config under the `pipeline` property. It allows you to define custom WebGL pipelines as part of the Game Config, so they're automatically installed and ready for use by all Scenes in your game. You can either set the `pipeline` object, or set it under the `render` sub-config.
* `Utils.Object.DeepCopy` is a new function that will recursively deep copy an array of object.

### Updates and API Changes

* Earcut, used for polygon triangulation, has been updated from 2.1.4 to 2.2.2.
* Earcut has now been exposed and is available via `Geom.Polygon.Earcut` and is fully documented.
* `Config.batchSize` has been increased from 2000 to 4096.
* Removed the Deferred Diffuse fragment and vertex shaders from the project, as they're not used.
* `StaticTilemapLayer.upload` will now set the vertex attributes and buffer the data, and handles internal checks more efficiently.
* `StaticTilemapLayer` now includes the `ModelViewProjection` mixin, so it doesn't need to modify the pipeline during rendering.
* `TransformMatrix.getXRound` is a new method that will return the X component, optionally passed via `Math.round`.
* `TransformMatrix.getYRound` is a new method that will return the Y component, optionally passed via `Math.round`.
* The `KeyboardPlugin` no longer emits `keydown_` events. These were replaced with `keydown-` events in v3.15. The previous event string was deprecated in v3.20.
* The `KeyboardPlugin` no longer emits `keyup_` events. These were replaced with `keyup-` events in v3.15. The previous event string was deprecated in v3.20.
* The `ScaleManager.updateBounds` method is now called every time the browser fires a 'resize' or 'orientationchange' event. This will update the offset of the canvas element Phaser is rendering to, which is responsible for keeping input positions correct. However, if you change the canvas position, or visibility, via any other method (i.e. via an Angular route) you should call the `updateBounds` method directly, yourself.
* The constant `Phaser.Renderer.WebGL.BYTE` value has been removed as it wasn't used internally.
* The constant `Phaser.Renderer.WebGL.SHORT` value has been removed as it wasn't used internally.
* The constant `Phaser.Renderer.WebGL.UNSIGNED_BYTE` value has been removed as it wasn't used internally.
* The constant `Phaser.Renderer.WebGL.UNSIGNED_SHORT` value has been removed as it wasn't used internally.
* The constant `Phaser.Renderer.WebGL.FLOAT` value has been removed as it wasn't used internally.
* `Pointer.downTime` now stores the event timestamp of when the first button on the input device was pressed down, not just when button 1 was pressed down.
* `Pointer.upTime` now stores the event timestamp of when the final depressed button on the input device was released, not just when button 1 was released.
* The `Pointer.getDuration` method now uses the new Pointer `downTime` and `upTime` values, meaning it will accurately report the duration of when any button is being held down, not just the primary one. Fix #5112 (thanks @veleek)
* The `BaseShader` default vertex shader now includes the `outTexCoord` vec2 varying, mapped to be the same as that found in the pipeline shaders. Fix #5120 (@pavel-shirobok)
* When using the `GameObjectCreator` for `Containers` you can now specify the `children` property in the configuration object.
* `Textures.Parsers.JSONHash` will now perform a `hasOwnProperty` check when iterating the frames, skipping anything that isn't a direct property. This should allow you to use generated atlas data that comes from `JSON.parse`. Fix #4768 (thanks @RollinSafary)
* The `Camera3D` Plugin has been rebuilt for Phaser 3.50 and the webpack config updated. This plugin is now considered deprecated and will not be updated beyond this release.
* `Tween.seek` will no longer issue a console warning for `'Tween.seek duration too long'`, it's now up to you to check on the performance of tween seeking.
* If `inputWindowEvents` is set in the Game Config, then the `MouseManager` will now listen for the events on `window.top` instead of just `window`, which should help in situations where the pointer is released outside of an embedded iframe. This check is wrapped in a `try/catch` block, as not all sites allow access to `window.top` (specifically in cross-origin iframe situations) Fix #4824 (thanks @rexrainbow)
* `MouseManager.isTop` is a new boolean read-only property that flags if the mouse event listeners were attached to `window.top` (true), or just `window` (false). By default Phaser will attempt `window.top`, but this isn't possible in all environments, such as cross-origin iframes, so it will fall back to `window` in those cases and set this property to false (thanks BunBunBun)
* `Types.GameObjects.Text.GetTextSizeObject` is a new type def for the GetTextSize function results.
* `Utils.Array.StableSort` has been recoded. It's now based on Two-Screens stable sort 0.1.8 and has been updated to fit into Phaser better and no longer create any window bound objects. The `inplace` function has been removed, just call `StableSort(array)` directly now. All classes that used `StableSort.inplace` have been updated to call it directly.
* If a Scene is paused, or sent to sleep, it will automatically call `Keyboard.resetKeys`. This means that if you hold a key down, then sleep or pause a Scene, then release the key and resume or wake the Scene, it will no longer think it is still being held down (thanks @samme)
* `Actions.setOrigin` will now call `updateDisplayOrigin` on the items array, otherwise the effects can't be seen when rendering.
* You can now set the `ArcadeWorld.fixedStep` property via the `ArcadeWorldConfig` object (thanks @samme)
* `Utils.Array.NumerArray` can now accept the `start` and `end` parameters in reverse order, i.e. `10, 1` will generate a number array running from 10 to 1. Internally it has also been optimized to skip string based returns.
* `DataManager.Events.DESTROY` is a new event that the Data Manager will _listen_ for from its parent and then call its own `destroy` method when received.
* The `Quaternion` class constructor will now default the values to `0,0,0,1` if they're not provided, making it an identity quaternion, rather than the `0,0,0,0` it was before.
* You can now set the `ParticleEmitter.reserve` value via the emitter configuration object (thanks @vforsh)
* Setting the `pixelArt` config option will now set `antialiasGL` to `false`, as well as `antialias`. Fix #5309 (thanks @Vegita2)
* The `Shape` class now includes the `ComputedSize` component properties and methods directly in the class, rather than applying as a mixin. `setSize` is now flagged as being `private`, because it shouldn't be used on Shape classes, which was leading to confusion as it appeared in the public-facing API. Fix #4811 (thanks @aolsx)
* The `Loader.maxParallelDownloads` value is now set to 6 if running on Android, or 32 on any other OS. This avoids `net::ERR_FAILED` issues specifically on Android. You can still override this in the Game Config if you wish. Fix #4957 (thanks @RollinSafary)
* When running an Arcade Physics `overlap` test against a `StaticBody`, it will no longer set the `blocked` states of the dynamic body. If you are doing a collision test, they will still be set, but they're skipped for overlap-only tests. Fix #4435 (thanks @samme)
* The `Line` Game Object will now default its width and height to 1, rather than zero. This allows you to give Line objects a physics body (although you will still need to re-adjust the center of the body manually). Fix #4596 (thanks @andrewaustin)
* Internally, the `Quaternion` class now has 4 new private properties: `_x`, `_y`, `_z` and `_w` and 4 new getters and setters for the public versions. It also now passes most methods via `set` to allow for the onChange callback to be invoked. This does not change the public-facing API.
* `Group` now extends `EventEmitter`, allowing you to emit custom events from within a Group.
* `Device.Audio.wav` now uses `audio/wav` as the `canPlayType` check string, instead of `audio/wav; codecs="1"`, which should allow iOS13 to play wav files again.
* In the `Loader.FileTypes.TextFile` config you can now override the type and cache destination for the file.
* `Loader.MultiFile` will now parse the given files array and only add valid entries into the file list, allowing multifiles to now have optional file entries.
* The `ParticleEmitter.tint` value is now `0xffffff` (previously, it was `0xffffffff`) to allow particle tints to work in the correct RGB order including alpha (thanks @vforsh)
* `SceneManager.start` will now reset the `SceneSystems.sceneUpdate` reference to `NOOP`. This gets set back to the Scene update method again during `bootScene` (if it has one) and stops errors with external plugins and multi-part files that may trigger `update` before `create` has been called. Fix #4629 (thanks @Osmose)
* `Phaser.Scene.renderer` is a new property available in every Phaser.Scene that gives you a reference to the renderer, either Canvas or WebGL.
* The `CanvasRenderer._tempMatrix1`, `_tempMatrtix2`, `_tempMatrix3` and `_tempMatrix4` properties have been removed. They were all flagged as private, yet used in lots of places. Instead, Game Objects now manager their own matrices, or use the global `GetCalcMatrix` function instead.
* Since iOS 13, iPads now identify as MacOS devices. A new maxTouchPoint check is now part of the `Device.OS` tests, stopping iPads from being flagged as desktop devices. Fix #5389 (thanks @SBCGames)
* The `BitmapMask.prevFramebuffer` property has been removed as it's no longer required, due to the fbo stack in the renderer.

### Bug Fixes

* `RenderTexture.resize` (which is called from `setSize`) wouldn't correctly set the `TextureSource.glTexture` property, leading to `bindTexture: attempt to use a deleted object` errors under WebGL.
* `RenderTexture.fill` would fail to fill the correct area under WebGL if the RenderTexture wasn't the same size as the Canvas. It now fills the given region properly.
* The `MatterAttractors` plugin, which enables attractors between bodies, has been fixed. The original plugin only worked if the body with the attractor was _first_ in the world bodies list. It can now attract any body, no matter where in the world list it is. Fix #5160 (thanks @strahius)
* The `KeyboardManager` and `KeyboardPlugin` were both still checking for the `InputManager.useQueue` property, which was removed several versions ago.
* In Arcade Physics, Dynamic bodies would no longer hit walls when riding on horizontally moving platforms. The horizontal (and vertical) friction is now re-applied correctly in these edge-cases. Fix #5210 (thanks @Dercetech @samme)
* Calling `Rectangle.setSize()` wouldn't change the underlying geometry of the Shape Game Object, causing any stroke to be incorrectly rendered after a size change.
* The `ProcessQueue` was emitting the wrong events internally. It now emits 'add' and 'remove' correctly (thanks @halilcakar)
* The `GridAlign` action didn't work if only the `height` parameter was set. Fix #5019 (thanks @halilcakar)
* The `Color.HSVToRGB` function has been rewritten to use the HSL and HSV formula from Wikipedia, giving much better results. Fix #5089 (thanks @DiamondeX)
* Previously, the `easeParams` array within a Tweens `props` object, or a multi-object tween, were ignored and it was only used if set on the root Tween object. It will now work correctly set at any depth. Fix #4292 (thanks @willblackmore)
* When using `Camera.setRenderToTexture` its `zoom` and `rotation` values would be applied twice. Fix #4221 #4924 #4713 (thanks @wayfu @DanMcgraw @pavel-shirobok)
* `GameObjects.Shape.Grid` would render a white fill even if you passed `undefined` as the fill color in the constructor. It now doesn't render cells if no fill color is given.
* The `onMouse` events in the Input Manager didn't reset the `activePointer` property to the mouse, meaning on dual-input systems such as Touch Screen devices, the active pointer would become locked to whichever input method was used first. Fix #4615 #5232 (thanks @mmolina01 @JstnPwll @Legomite)
* The Scale Managers `GetScreenOrientation` function will now check for `window.orientation` first, because iOS mobile browsers have an incomplete implementation of the Screen API, forcing us to use the window value as a priority. This means the Scale Manager will now emit `orientationchange` events correctly on iOS. Fix #4361 #4914 (thanks @pfdtravalmatic @jackfreak @cuihu)
* `Time.Clock.addEvent` can now take an instance of a `TimerEvent` as its parameter. Fix #5294 (thanks @samme @EmilSV)
* `GameConfig.audio` now defaults to an empty object, which simplifies access to the config in later checks (thanks @samme)
* The `Loader.path` was being added to the File URL even if the URL was absolute. This is now checked for and the path is not applied unless the URL is relative (thanks @firesoft)
* `Group.getMatching` would always return an empty array. It now returns matching children (thanks @samme)
* The `ParticleManagerWebGLRenderer` now calculates its transform matrix differently, splitting out the parent matrix and factoring in follow offsets separately. This fixes numerous issues with particle emitters being incorrectly offset when added to Containers. Fix #5319 #5195 #4739 #4691 (thanks @vforsh @condeagustin @IvanDem @Formic)
* The `ParticleManagerCanvasRenderer` now calculates its transform matrix differently, splitting out the parent matrix and factoring in the follow offsets separately. It also uses `setToContext` internally. This fixes numerous issues with particle emitters being incorrectly offset when added to Containers, or having the Camera zoomed, running under Canvas. Fix #4908 #4531 #4131 (thanks @smjnab @SirLink @jhooper04)
* The `Graphics` WebGL Renderer will now default to `pathOpen = true`. This fixes issues under WebGL where, for example, adding an arc and calling `strokePath`, without first calling `beginPath` will no longer cause rendering artefacts when WebGL tries to close the path with a single tri.
* `Graphics.strokeRoundedRect` now issues `moveTo` commands as part of the drawing sequence, preventing issues under WebGL where on older Android devices it would project additional vertices into the display. Fix #3955 (thanks @alexeymolchan)
* Creating a Bitmap Mask from a texture atlas that was then used to mask another Game Object also using that same texture atlas would throw the error `GL_INVALID_OPERATION : glDrawArrays: Source and destination textures of the draw are the same.`. It now renders as expected. Fix #4675 (thanks @JacobCaron)
* When using the same asset for a Game Object to be used as a mask, it would make other Game Objects using the same asset, that appeared above the mask in the display list, to not render. Fix #4767 (thanks @smjnab)
* When taking a `snapshot` in WebGL it would often have an extra line of empty pixels at the top of the resulting image, due to a rounding error in the `WebGLSnapshot` function. Fix #4956 (thanks @gammafp @telinc1)
* You can now draw a `Group` to a `RenderTexture`. Previously, it failed to pass the camera across, resulting in none of the Group children being drawn. Fix #5330 (thanks @somnolik)
* `Particles.EmitterOp.setMethods` will now reset both `onEmit` and `onUpdate` to their default values. This allows you to reconfigure an emitter op with a new type of value and not have it stuck on the previous one. Fix #3663 (thanks @samme)
* `Particles.EmitterOp` now cleanly separates between the different types of property configuration options. `start | end` will now ease between the two values, `min | max` will pick a random value between them and `random: []` will pick a random element. They no longer get mixed together. Fix #3608 (thanks @samme)
* When setting both `transparent: true` and `backgroundColor` in the Game Config, it would ignore the transparency and use the color anyway. If transparent, the game is now fully transparent. Fix #5362 (thanks @Hoshinokoe)
* The `Ellipse` Game Object now will update the width, height, and geometric position in the `setSize` method (thanks @PhaserEditor2D)

### Namespace Updates

* The `Phaser.Curves.MoveTo` function has now been exposed on the Phaser namespace (thanks @samme)
* The `Phaser.DOM.GetInnerHeight` function has now been exposed on the Phaser namespace (thanks @samme)
* The `Phaser.GameObjects.Bob` class has now been exposed on the Phaser namespace (thanks @samme)
* The `Phaser.GameObjects.LightsManager` class has now been exposed on the Phaser namespace (thanks @samme)
* The `Phaser.GameObjects.LightsPlugin` class has now been exposed on the Phaser namespace (thanks @samme)
* The `Phaser.GameObjects.Particles.EmitterOp` class has now been exposed on the Phaser namespace (thanks @samme)
* The `Phaser.GameObjects.GetTextSize` function has now been exposed on the Phaser namespace (thanks @samme)
* The `Phaser.GameObjects.MeasureText` function has now been exposed on the Phaser namespace (thanks @samme)
* The `Phaser.GameObjects.TextStyle` function has now been exposed on the Phaser namespace (thanks @samme)
* The `Phaser.Input.CreatePixelPerfectHandler` function has now been exposed on the Phaser namespace (thanks @samme)
* The `Phaser.Physics.Arcade.Components.OverlapCirc` function has now been exposed on the Phaser namespace (thanks @samme)
* The `Phaser.Physics.Arcade.Components.OverlapRect` function has now been exposed on the Phaser namespace (thanks @samme)
* The `Phaser.Physics.Arcade.Tilemap` namespace has now been exposed on the Phaser namespace (thanks @samme)
* The `Phaser.Physics.Matter.Components` namespace has now been exposed on the Phaser namespace (thanks @samme)
* The `Phaser.Physics.Matter.Events` namespace has now been exposed on the Phaser namespace (thanks @samme)
* The `Phaser.Physics.Matter.MatterGameObject` class has now been exposed on the Phaser namespace (thanks @samme)
* The `Phaser.Physics.Matter.PointerConstraint` class has now been exposed on the Phaser namespace (thanks @samme)
* The `Phaser.Scenes.GetPhysicsPlugins` function has now been exposed on the Phaser namespace (thanks @samme)
* The `Phaser.Scenes.GetScenePlugins` function has now been exposed on the Phaser namespace (thanks @samme)
* The `Phaser.Structs.Events` namespace has now been exposed on the Phaser namespace (thanks @samme)
* The `Phaser.Tilemaps.Parsers.Tiled` function has now been exposed on the Phaser namespace (thanks @samme)
* Every single `Tilemap.Component` function has now been made public. This means you can call the Component functions directly, should you need to, outside of the Tilemap system.

### Examples, Documentation and TypeScript

My thanks to the following for helping with the Phaser 3 Examples, Docs, and TypeScript definitions, either by reporting errors, fixing them, or helping author the docs:

@samme @16patsle @scott20145 @khasanovbi @mk360 @volkans80 @jaabberwocky @maikthomas @atursams @LearningCode2023 @DylanC @BenjaminDRichards @rexrainbow @Riderrr @spwilson2 @EmilSV @PhaserEditor2D @Gangryong @vinerz @trynx @usufruct99 @pirateksh
