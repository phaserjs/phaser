# Phaser 3.80.0 Change Log

Return to the [Change Log index](CHANGELOG-v3.80.md).

## WebGL Context Restore

Phaser now performs a WebGL context restore.

WebGL can lose context when the browser wants to reclaim resources. This happens most often when a browser tab is inactive. When it happens is beyond the control of web developers.

When context is lost, the game canvas goes blank. A lost context loses all the data that was sent to the WebGL system. It cannot do anything until the browser restores the context, usually when the user returns to their tab.

Phaser now restores this data, with a few exceptions, allowing your games to seamlessly resume. For the most part, your WebGL games should now simply recover when the browser restores the WebGL context.

Key concepts:

- `WebGLRenderer` emits `LOSE_WEBGL` and `RESTORE_WEBGL` events.
- Dynamic textures are cleared.
- WebGL objects are now enclosed in wrappers.
- You can test WebGL context restore with WebGL extensions.
- Supporting changes were made to the rendering system.

### Events

`Phaser.Renderers.WebGL.WebGLRenderer` now emits events that you can use to stay informed about context loss.

- `Phaser.Renderer.Events#LOSE_WEBGL` is emitted when context is lost. This would be a good time to pause the game, or otherwise avoid making changes that the player cannot see.
- `Phaser.Renderer.Events#RESTORE_WEBGL` is emitted when context is restored. This would be a good time to restore dynamic textures, and start things moving again.

### Dynamic Textures

Dynamic textures and render textures are stored on the GPU. When context is lost, the texture is erased. When context is restored, the texture is re-enabled, but it remains blank.

A render texture which is redrawn every frame will naturally redraw itself.

Textures which are drawn once, however, will stay blank. You should listen for the `RESTORE_WEBGL` event to know when to redraw them.

It is safe to draw while the context is lost, but nothing will be drawn. Snapshots will return blank.

### WebGL Object Wrappers

WebGL objects are now wrapped. The wrapper holds the necessary information to automatically recreate the object when context is restored.

This is only relevant if you need deep access to the WebGL renderer.

Wrappers are created and managed by the `WebGLRenderer`. They have the following qualities:

- A property for the wrapped WebGL object, for use in rendering. This property should only be accessed within a call to WebGL; it may be changed within the wrapper.
- `createResource()`, which will create a new WebGL object from stored information.
- `destroy()`, which will remove the object. Do not call this directly; it is managed by the `WebGLRenderer`.

The following wrappers are available in the `Phaser.Renderer.WebGL.Wrappers` namespace:

- `WebGLAttribLocationWrapper`
- `WebGLBufferWrapper`
- `WebGLFramebufferWrapper`
- `WebGLProgramWrapper`
- `WebGLTextureWrapper`
- `WebGLUniformLocationWrapper`

### Testing Context Restore

You can test context loss and restore with a built-in WebGL extension. The following code snippet should be useful for testing purposes. It shows how to get the built-in extension, and simulate losing and restoring the context after 1 and 2 seconds respectively.

```js
const webGLLoseContextExtension = game.renderer.getExtension('WEBGL_lose_context');

setTimeout(function () {
    webGLLoseContextExtension.loseContext();
    setTimeout(function () {
        webGLLoseContextExtension.restoreContext();
    }, 1000)
}, 1000);
```

### Supporting Changes

Several changes were made to the rendering system to support these improvements. In particular, many properties were changed to use wrappers instead of raw WebGL objects. The full list of changes is as follows:

- `Phaser.FX.Displacement`
  - `glTexture` property type changed from `WebGLTexture` to `WebGLTextureWrapper`
- `BatchChar`
  - Constructor:
    - `texture` parameter type changed from `WebGLTexture` to `WebGLTextureWrapper`
- `Phaser.GameObjects.Shader`
  - `vertexBuffer` property type changed from `WebGLBuffer` to `WebGLBufferWrapper`
  - `program` property type changed from `WebGLProgram` to `WebGLProgramWrapper`
  - `framebuffer` property type changed from `WebGLFramebuffer` to `WebGLFramebufferWrapper`
  - `glTexture` property type changed from `WebGLTexture` to `WebGLTextureWrapper`
  - `#initUniforms` method:
    - `texture` parameter type changed from `WebGLTexture` to `WebGLTextureWrapper`
- `Phaser.GameObjects.TileSprite`
  - `fillPattern` property type changed from `?(WebGLTexture|CanvasPattern)` to `?(WebGLTextureWrapper|CanvasPattern)`
- `Phaser.Renderer.WebGL.PipelineManager`
  - Added property `postPipelineInstances` of type `PostFXPipeline[]`
  - Added method `removePostPipeline(pipeline: PostFXPipeline)`
  - Added method `restoreContext()`, used after context is restored
- `Phaser.Renderer.WebGL.RenderTarget`
  - `framebuffer` property type changed from `WebGLFramebuffer` to `WebGLFramebufferWrapper`
  - `texture` parameter type changed from `WebGLTexture` to `WebGLTextureWrapper`
  - `#unbind` method:
    - Return type changed from `WebGLFramebuffer` to `WebGLFramebufferWrapper`
- `Phaser.Renderer.WebGL.WebGLPipeline`
  - `vertexBuffer` property type changed from `WebGLBuffer` to `WebGLBufferWrapper`
  - `activeBuffer` property type changed from `WebGLBuffer` to `WebGLBufferWrapper`
  - `currentTexture` property type changed from `WebGLTexture` to `WebGLTextureWrapper`
  - `activeTextures` property type changed from `WebGLTexture[]` to `WebGLTextureWrapper[]`
  - `#setShader` method:
    - `vertexBuffer` parameter type changed from `WebGLBuffer` to `WebGLBufferWrapper`
  - `#createBatch` method:
    - `texture` parameter type changed from `WebGLTexture` to `WebGLTextureWrapper`
  - `#addTextureToBatch` method:
    - `texture` parameter type changed from `WebGLTexture` to `WebGLTextureWrapper`
  - `#pushBatch` method:
    - `texture` parameter type changed from `WebGLTexture` to `WebGLTextureWrapper`
  - Added method `restoreContext()`, used after context is restored
  - `#setVertexBuffer` method:
    - `buffer` parameter type changed from `WebGLBuffer` to `WebGLBufferWrapper`
  - `#batchQuad` method:
    - `texture` parameter type changed from `WebGLTexture` to `WebGLTextureWrapper`
  - `#batchTri` method:
    - `texture` parameter type changed from `WebGLTexture` to `WebGLTextureWrapper`
  - `#drawFillRect` method:
    - `texture` parameter type changed from `WebGLTexture` to `WebGLTextureWrapper`
  - `#setTexture2D` method:
    - `texture` parameter type changed from `WebGLTexture` to `WebGLTextureWrapper`
  - `#bindTexture` method:
    - `texture` parameter type changed from `WebGLTexture` to `WebGLTextureWrapper`
- `Phaser.Renderer.WebGL.WebGLRenderer`
  - Added property `glBufferWrappers` of type `WebGLBufferWrapper[]`
  - Added property `glProgramWrappers` of type `WebGLProgramWrapper[]`
  - Added property `glTextureWrappers` of type `WebGLTextureWrapper[]`
  - Added property `glFramebufferWrappers` of type `WebGLFramebufferWrapper[]`
  - Added property `glAttribLocationWrappers` of type `WebGLAttribLocationWrapper[]`
  - Added property `glUniformLocationWrappers` of type `WebGLUniformLocationWrapper[]`
  - Added property `normalTexture` of type `WebGLTextureWrapper`
  - `currentFramebuffer` property type changed from `WebGLFramebuffer` to `WebGLFramebufferWrapper`
  - `fboStack` property type changed from `WebGLFramebuffer[]` to `WebGLFramebufferWrapper[]`
  - `currentProgram` property type changed from `WebGLProgram` to `WebGLProgramWrapper`
  - `blankTexture` property type changed from `WebGLTexture` to `WebGLTextureWrapper`
  - `whiteTexture` property type changed from `WebGLTexture` to `WebGLTextureWrapper`
  - Added method `createTemporaryTextures()`, used when booting on MacOS
  - `#pushFramebuffer` method:
    - `framebuffer` parameter changed from `WebGLFramebuffer` to `WebGLFramebufferWrapper`
    - `texture` parameter changed from `WebGLTexture` to `WebGLTextureWrapper`
  - `#setFramebuffer` method:
    - `framebuffer` parameter changed from `WebGLFramebuffer` to `WebGLFramebufferWrapper`
    - `texture` parameter changed from `WebGLTexture` to `WebGLTextureWrapper`
  - `#popFramebuffer` method:
    - Return type changed from `WebGLFramebuffer` to `WebGLFramebufferWrapper`
  - `#setProgram` method:
    - `program` parameter changed from `WebGLProgram` to `WebGLFramebufferWrapper`
  - `#createTextureFromSource` method:
    - Return type changed from `WebGLTexture` to `WebGLTextureWrapper`
  - `#createTexture2D` method:
    - `width` parameter made optional
    - `height` parameter made optional
    - Return type changed from `WebGLTexture` to `WebGLTextureWrapper`
  - `#createFramebuffer` method:
    - `texture` parameter type changed from `WebGLTexture` to `WebGLTextureWrapper`
    - Return type changed from `WebGLFramebuffer` to `WebGLFramebufferWrapper`
  - `#createProgram` method:
    - Return type changed from `WebGLProgram` to `WebGLProgramWrapper`
  - `#createVertexBuffer` method:
    - Return type changed from `WebGLBuffer` to `WebGLBufferWrapper`
  - Added method `createAttribLocation`
  - Added method `createUniformLocation`
  - `#createIndexBuffer` method:
    - Return type changed from `WebGLBuffer` to `WebGLBufferWrapper`
  - `#deleteTexture` method:
    - `texture` parameter type changed from `WebGLTexture` to `WebGLTextureWrapper`
  - `#deleteFramebuffer` method:
    - `framebuffer` parameter type changed from `WebGLFramebuffer` to `WebGLFramebufferWrapper`
  - `#deleteProgram` method:
    - `program` parameter type changed from `WebGLProgram` to `WebGLProgramWrapper`
  - Added method `deleteAttribLocation`
  - Added method `deleteUniformLocation`
  - `#deleteBuffer` method:
    - `vertexBuffer` parameter type changed from `WebGLBuffer` to `WebGLBufferWrapper`
  - `#snapshotFramebuffer` method:
    - `framebuffer` parameter changed from `WebGLFramebuffer` to `WebGLFramebufferWrapper`
  - `#canvasToTexture` method:
    - `dstTexture` parameter type changed from `WebGLTexture` to `WebGLTextureWrapper`
    - Return type changed from `WebGLTexture` to `WebGLTextureWrapper`
  - `#createCanvasTexture` method:
    - Return type changed from `WebGLTexture` to `WebGLTextureWrapper`
  - `#updateCanvasTexture` method:
    - `dstTexture` parameter type changed from `WebGLTexture` to `WebGLTextureWrapper`
    - Return type changed from `WebGLTexture` to `WebGLTextureWrapper`
  - `#createVideoTexture` method:
    - Return type changed from `WebGLTexture` to `WebGLTextureWrapper`
  - `#updateCanvasTexture` method:
    - `dstTexture` parameter type changed from `WebGLTexture` to `WebGLTextureWrapper`
    - Return type changed from `WebGLTexture` to `WebGLTextureWrapper`
  - Added method `createUint8ArrayTexture`
  - `#setTextureFilter` method:
    - `texture` parameter type changed from `WebGLTexture` to `WebGLTextureWrapper`
- `Phaser.Renderers.WebGL.WebGLShader`
  - `program` property type changed from `WebGLProgram` to `WebGLProgramWrapper`
  - Added method `syncUniforms` for use during context recovery
- `Phaser.Renderers.WebGL.Pipelines.LightPipeline`
  - Removed property `defaultNormalMap`. There is now a default normal map at `WebGLRenderer.normalTexture`, or the texture key `'__NORMAL'`.
  - `currentNormalMap` property type changed from `WebGLTexture` to `WebGLTextureWrapper`
  - `#setTexture2D` method:
    - `texture` parameter type changed from `WebGLTexture` to `WebGLTextureWrapper`
  - `#isNewNormalMap` method:
    - `texture` parameter type changed from `WebGLTexture` to `WebGLTextureWrapper`
    - `normalMap` parameter type changed from `WebGLTexture` to `WebGLTextureWrapper`
  - `#getNormalMap` method:
    - Return type changed from `WebGLTexture` to `WebGLTextureWrapper`
  - `#batchTexture` method:
    - `texture` parameter type changed from `WebGLTexture` to `WebGLTextureWrapper`
- `Phaser.Renderers.WebGL.Pipelines.MultiPipeline`
  - `#batchTexture` method:
    - `texture` parameter type changed from `WebGLTexture` to `WebGLTextureWrapper`
- `Phaser.Renderers.WebGL.Pipelines.PreFXPipeline`
  - `quadVertexBuffer` property type changed from `WebGLBuffer` to `WebGLBufferWrapper`
  - `#batchQuad` method:
    - `texture` parameter type changed from `WebGLTexture` to `WebGLTextureWrapper`
- `Phaser.Renderers.WebGL.Pipelines.DisplacementFXPipeline`
  - `glTexture` property type changed from `WebGLTexture` to `WebGLTextureWrapper`
- `WebGLPipelineAttribute`
  - `location` property changed from `number` to `-1|WebGLAttribLocationWrapper`
- `WebGLPipelineBatchEntry`
  - `texture` property changed from `WebGLTexture` to `WebGLTextureWrapper`
- `WebGLPipelineUniformsConfig`
  - Added property `setter` of type `?function` for use in restoring context
- `Phaser.Textures.DynamicTexture`
  - `#getWebGLTexture` method:
    - Return type changed from `WebGLTexture` to `WebGLTextureWrapper`
- `Phaser.Textures.Frame`
  - `glTexture` property type changed from `WebGLTexture` to `WebGLTextureWrapper`
    - Property is now read-only
- `Phaser.Textures.Texture`
  - Constructor
    - `source` parameter type options added `WebGLTextureWrapper`
- `Phaser.Textures.TextureManager`
  - A texture with the key `'__NORMAL'` is created on boot if the WebGL renderer is being used. This is a 1x1 texture of colour #7f7fff, or a flat normal map.
  - `#addGLTexture` method:
    - `glTexture` parameter type changed from `WebGLTexture` to `WebGLTextureWrapper`
    - `width` parameter removed
    - `height` parameter removed
  - `#getTextureKeys` now excludes `'__NORMAL'` as well as `'__DEFAULT'`, `'__MISSING'`, and `'__WHITE'`.
  - Added method `addUint8Array` for creating textures from raw colour data
- `Phaser.Textures.TextureSource`
  - `glTexture` property type changed from `WebGLTexture` to `WebGLTextureWrapper`
- `Phaser.Tilemaps.Tileset`
  - `glTexture` property type changed from `WebGLTexture` to `WebGLTextureWrapper`