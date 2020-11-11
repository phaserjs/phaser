/**
 * @typedef {object} Phaser.Types.Renderer.WebGL.WebGLPipelineShaderConfig
 * @since 3.50.0
 *
 * @property {string} [name] - The name of the shader. Doesn't have to be unique, but makes shader look-up easier if it is.
 * @property {string} [vertShader] - The source code, as a string, for the vertex shader. If not given, uses the `Phaser.Types.Renderer.WebGL.WebGLPipelineConfig.vertShader` property instead.
 * @property {string} [fragShader] - The source code, as a string, for the fragment shader. Can include `%count%` and `%forloop%` declarations for multi-texture support. If not given, uses the `Phaser.Types.Renderer.WebGL.WebGLPipelineConfig.fragShader` property instead.
 * @property {string[]} [uniforms] - An array of shader uniform names that will be looked-up to get the locations for. If not given, uses the `Phaser.Types.Renderer.WebGL.WebGLPipelineConfig.uniforms` property instead.
 * @property {Phaser.Types.Renderer.WebGL.WebGLPipelineAttributesConfig} [attributes] - An array of shader attribute data. All shaders bound to this pipeline must use the same attributes.
 */
