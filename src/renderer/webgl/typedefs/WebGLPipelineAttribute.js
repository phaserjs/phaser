/**
 * @typedef {object} Phaser.Types.Renderer.WebGL.WebGLPipelineAttribute
 * @since 3.50.0
 *
 * @property {string} name - The name of the attribute as defined in the vertex shader.
 * @property {number} size - The number of components in the attribute, i.e. 1 for a float, 2 for a vec2, 3 for a vec3, etc.
 * @property {GLenum} type - The data type of the attribute. Either `gl.BYTE`, `gl.SHORT`, `gl.UNSIGNED_BYTE`, `gl.UNSIGNED_SHORT` or `gl.FLOAT`.
 * @property {number} offset - The offset, in bytes, of this attribute data in the vertex array. Equivalent to `offsetof(vertex, attrib)` in C.
 * @property {boolean} normalized - Should the attribute data be normalized?
 * @property {boolean} enabled - You should set this to `false` by default. The pipeline will enable it on boot.
 * @property {(number|Phaser.Renderer.WebGL.Wrappers.WebGLAttribLocationWrapper)} location - You should set this to `-1` by default. The pipeline will set it on boot.
 */
