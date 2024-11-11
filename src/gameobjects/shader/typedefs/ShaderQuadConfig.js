/**
 * @typedef {object} Phaser.Types.GameObjects.Shader.ShaderQuadConfig
 * @since 3.90.0
 *
 * @property {string} name - The name of the render node. This is also used for `shaderName` if not set.
 * @property {string} [shaderName] - The name of the shader. This is used as the stub for the internal shader name. If another shader with the same name exists, that will be used instead, so it's best to use a unique name.
 * @property {string} [fragmentSource] - The fragment shader source code. This overrides anything set in `fragmentKey`.
 * @property {string} [vertexSource] - The vertex shader source code. This overrides anything set in `vertexKey`.
 * @property {string} [fragmentKey] - The key of the fragment shader source to use from the shader cache.
 * @property {string} [vertexKey] - The key of the vertex shader source to use from the shader cache.
 * @property {function (setUniform: (name: string, value: any) => void, drawingContext: Phaser.Renderer.WebGL.DrawingContext): void} [setupUniforms] - A function that sets any uniform values that the shader needs.
 * @property {Phaser.Types.Renderer.WebGL.ShaderAdditionConfig[]} [shaderAdditions] - Additional snippets to add to the shader. An advanced configuration option. You can use `updateShaderConfig` to edit these at render time, resulting in different shaders.
 * @property {function (drawingContext: Phaser.Renderer.WebGL.DrawingContext, gameObject: Phaser.GameObjects.Shader, renderNode: Phaser.Renderer.WebGL.RenderNodes.ShaderQuad): void} [updateShaderConfig] - A function that updates the shader configuration. An advanced configuration option. It will be invoked by the ShaderQuad render node, but if you defined it with an arrow function, it will not have that context. Thus, `renderNode` is passed as an argument.
 */
