/**
 * @typedef {object} Phaser.Types.GameObjects.Shader.ShaderQuadConfig
 * @since 4.0.0
 *
 * @property {string} name - The name of the render node. This is also used for `shaderName` if not set.
 * @property {string} [shaderName] - The name of the shader. This is used as the stub for the internal shader name. If another shader with the same name exists, that will be used instead, so it's best to use a unique name.
 * @property {string} [fragmentSource] - The fragment shader source code. This overrides anything set in `fragmentKey`.
 * @property {string} [vertexSource] - The vertex shader source code. This overrides anything set in `vertexKey`.
 * @property {string} [fragmentKey] - The key of the fragment shader source to use from the shader cache.
 * @property {string} [vertexKey] - The key of the vertex shader source to use from the shader cache.
 * @property {function} [setupUniforms] - A function that sets any uniform values that the shader needs. It takes two parameters: `setUniform` and `drawingContext`. `setUniform` is a function `(name: string, value: any) => void` that you can call to set a uniform value. `drawingContext` is the current drawing context.
 * @property {object} [initialUniforms] - An object containing the initial uniform values to set. The keys are the uniform names, and the values are the uniform values. This is used to set up the shader before it is rendered for the first time.
 * @property {Phaser.Types.Renderer.WebGL.ShaderAdditionConfig[]} [shaderAdditions] - Additional snippets to add to the shader. An advanced configuration option. You can use `updateShaderConfig` to edit these at render time, resulting in different shaders.
 * @property {function} [updateShaderConfig] - A function that updates the shader configuration. An advanced configuration option. It takes three parameters: `drawingContext`, `gameObject`, `renderNode`. `drawingContext` is the current drawing context. `gameObject` is the object which is rendering. `renderNode` is the ShaderQuad render node which invoked the function.
 */
