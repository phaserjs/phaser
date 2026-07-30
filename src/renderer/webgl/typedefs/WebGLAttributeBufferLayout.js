/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * @typedef {object} Phaser.Types.Renderer.WebGL.WebGLAttributeLayout
 * @since 4.0.0
 *
 * @property {string} name - The name of the attribute, as defined in the shader.
 * @property {number} size - The number of components per vertex attribute.
 * @property {GLenum|string} type - The data type of each component in the array. This can differ from the type in the shader, so long as WebGL can convert the types. If the type is a string, it will be converted to the appropriate GLenum, e.g. 'FLOAT' to gl.FLOAT.
 * @property {boolean} normalized - Whether integer data values should be normalized when being cast to a float.
 * @property {number} offset - The byte offset from the beginning of the buffer.
 * @property {number} [bytes=4] - The number of bytes per vertex attribute. This is the size of the type, usually 4 bytes for FLOAT or INT.
 * @property {number} [columns=1] - The number of columns in the attribute data. Represent matrices as column vectors and increase columns to match the matrix size.
 */

/**
 * @typedef {object} Phaser.Types.Renderer.WebGL.WebGLAttributeBufferLayout
 * @since 4.0.0
 *
 * @property {number} stride - The stride of the attribute data.
 * @property {number} count - The maximum number of elements in the buffer.
 * @property {GLenum|string} usage - The usage pattern of the data store. gl.STATIC_DRAW, gl.DYNAMIC_DRAW or gl.STREAM_DRAW. If the type is a string, it will be converted to the appropriate GLenum, e.g. 'STATIC_DRAW' to gl.STATIC_DRAW.
 * @property {number} [instanceDivisor] - The instance divisor of the attribute data. This is how many vertices to draw before moving to the next one. It is only used for instanced rendering.
 * @property {Phaser.Types.Renderer.WebGL.WebGLAttributeLayout} layout - The layout of the attribute data.
 */
