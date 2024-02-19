/**
 * @typedef {object} Phaser.Types.Renderer.WebGL.WebGLPipelineConfig
 * @since 3.50.0
 *
 * @property {Phaser.Game} game - The Phaser.Game instance that owns this pipeline.
 * @property {string} [name] - The name of the pipeline.
 * @property {GLenum} [topology=gl.TRIANGLES] - How the primitives are rendered. The default value is GL_TRIANGLES. Here is the full list of rendering primitives: (https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Constants).
 * @property {string} [vertShader] - The source code, as a string, for the vertex shader. If you need to assign multiple shaders, see the `shaders` property.
 * @property {string} [fragShader] - The source code, as a string, for the fragment shader. Can include `%count%` and `%forloop%` declarations for multi-texture support. If you need to assign multiple shaders, see the `shaders` property.
 * @property {number} [batchSize] - The number of quads to hold in the batch. Defaults to `RenderConfig.batchSize`. This amount * 6 gives the vertex capacity.
 * @property {number} [vertexSize] - The size, in bytes, of a single entry in the vertex buffer. Defaults to Float32Array.BYTES_PER_ELEMENT * 6 + Uint8Array.BYTES_PER_ELEMENT * 4.
 * @property {(number[]|Float32Array)} [vertices] - An optional Array or Typed Array of pre-calculated vertices data that is copied into the vertex data.
 * @property {Phaser.Types.Renderer.WebGL.WebGLPipelineAttributeConfig[]} [attributes] - An array of shader attribute data. All shaders bound to this pipeline must use the same attributes.
 * @property {Phaser.Types.Renderer.WebGL.WebGLPipelineShaderConfig[]} [shaders] - An array of shaders, all of which are created for this one pipeline. Uses the `vertShader`, `fragShader`, `attributes` and `uniforms` properties of this object as defaults.
 * @property {boolean} [forceZero=false] - Force the shader to use just a single sampler2d? Set for anything that extends the Single Pipeline.
 * @property {(boolean|number|Phaser.Types.Renderer.WebGL.RenderTargetConfig[])} [renderTarget] - Create Render Targets for this pipeline. Can be a number, which determines the quantity, a boolean (sets quantity to 1), or an array of Render Target configuration objects.
 * @property {string} [resizeUniform=''] - If the WebGL renderer resizes, this uniform will be set with the new width and height values as part of the pipeline resize call.
 */
