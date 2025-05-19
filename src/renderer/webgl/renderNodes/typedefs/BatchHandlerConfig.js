/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * @typedef {object} Phaser.Types.Renderer.WebGL.RenderNodes.BatchHandlerConfig
 * @since 4.0.0
 *
 * @property {string} name - The name of the RenderNode. This should be unique within the manager.
 * @property {number} [instancesPerBatch] - The number of instances per batch. Instances are usually quads. This factors into the size of the vertex buffer. The default is based on 16-bit vertex indices, which allows for 65535 vertices. This is divided by `verticesPerInstance` to get the number of instances. Note that no larger number of vertices is possible with 16-bit indices.
 * @property {number} [verticesPerInstance=4] - The number of unique vertices per instance. This is usually 4 for a quad.
 * @property {number} [indicesPerInstance=6] - The number of indices per instance. This is used to populate and advance the element buffer. Default quads use 6 indices in the TRIANGLE_STRIP pattern [0, 0, 1, 2, 3, 3] to connect independent quads with degenerate topology. The minimum number is 3.
 * @property {number} [maxTexturesPerBatch] - The maximum number of textures per batch entry. This defaults to the maximum number of textures supported by the renderer. It is used to compile the shader program. At runtime, the manager may suggest a different number, which is interpreted by the node's `updateTextureCount` method.
 * @property {boolean} [indexBufferDynamic=false] - Whether the index buffer should be created as a dynamic buffer. This is useful for handlers that need to change the index data frequently.
 * @property {string} [shaderName] - The base name to use for the shader program.
 * @property {string} [vertexSource] - The vertex shader source code. If not provided, a default quad shader will be used.
 * @property {string} [fragmentSource] - The fragment shader source code. If not provided, a default quad shader will be used.
 * @property {Phaser.Types.Renderer.WebGL.ShaderAdditionConfig[]} [shaderAdditions] - An array of shader additions to apply to the shader program.
 * @property {string[]} [shaderFeatures] - An array of shader features to enable in the shader program.
 * @property {Phaser.Types.Renderer.WebGL.WebGLAttributeBufferLayout|any} [vertexBufferLayout] - The vertex buffer layout for the batch handler. If not provided, a default quad layout will be used. The `count` property will be determined by the `instancesPerBatch` and `verticesPerInstance` properties. The `location` and `bytes` properties of each attribute will be determined automatically during initialization. You may provide a Partial WebGLAttributeBufferLayout, which will be filled in automatically during initialization.
 * @property {string[]} [vertexBufferLayoutRemove] - An array of attribute names to remove from the vertex buffer layout. This is useful for removing attributes that are not used by the shader program.
 * @property {Array<Phaser.Types.Renderer.WebGL.WebGLAttributeLayout|any>} [vertexBufferLayoutAdd] - An array of additional attribute layouts to add to the vertex buffer layout. This is useful for adding attributes to the default shader program. You may provide a Partial WebGLAttributeLayout, which will be filled in automatically during initialization.
 */
