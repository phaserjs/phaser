/**
 * @typedef {object} Phaser.Types.Renderer.WebGL.WebGLPipelineAttributeConfig
 * @since 3.50.0
 *
 * @property {string} name - The name of the attribute as defined in the vertex shader.
 * @property {number} size - The number of components in the attribute, i.e. 1 for a float, 2 for a vec2, 3 for a vec3, etc.
 * @property {Phaser.Types.Renderer.WebGL.WebGLConst} type - The data type of the attribute, one of the `WEBGL_CONST` values, i.e. `WEBGL_CONST.FLOAT`, `WEBGL_CONST.UNSIGNED_BYTE`, etc.
 * @property {boolean} [normalized=false] - Should the attribute data be normalized?
 */
