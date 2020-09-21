/**
 * @typedef {object} Phaser.Types.Renderer.WebGL.WebGLPipelineConfig
 * @since 3.50.0
 *
 * @property {Phaser.Game} game - The Phaser.Game instance that owns this pipeline.
 * @property {string} [name] - The name of the pipeline.
 * @property {GLenum} [topology=gl.TRIANGLES] - How the primitives are rendered. The default value is GL_TRIANGLES. Here is the full list of rendering primitives: (https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Constants).
 * @property {string} [vertShader] - The source code, as a string, for the vertex shader.
 * @property {string} [fragShader] - The source code, as a string, for the fragment shader. Can include `%count%` and `%forloop%` declarations for multi-texture support.
 * @property {number} [vertexCapacity] - The number of vertices to hold in the batch. Defaults to `RenderConfig.batchSize` * 6.
 * @property {number} [vertexSize] - The size, in bytes, of a single entry in the vertex buffer. Defaults to Float32Array.BYTES_PER_ELEMENT * 6 + Uint8Array.BYTES_PER_ELEMENT * 4.
 * @property {ArrayBuffer} [vertices] - An optional Array Buffer full of pre-calculated vertices data.
 * @property {Phaser.Types.Renderer.WebGL.WebGLPipelineAttributesConfig} [attributes] - An array of shader attribute data.
 * @property {string[]} [uniforms] - An array of shader uniform names that will be looked-up to get the locations for.
 */
