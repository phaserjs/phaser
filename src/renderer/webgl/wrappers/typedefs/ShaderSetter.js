/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * WebGL constants and functions used to set shader uniforms.
 *
 * @typedef {object} Phaser.Types.Renderer.WebGL.Wrappers.ShaderSetter
 * @since 4.0.0
 *
 * @property {GLenum} constant - The GL constant describing the data type.
 * @property {GLenum} baseType - The GL constant describing the base data type. This is the same as `constant` for non-array types.
 * @property {number} size - The number of elements in the data type.
 * @property {number} bytes - The number of bytes per element in the data type.
 * @property {function} set - The WebGL function to set the uniform.
 * @property {function} setV - The WebGL function to set the uniform with a value array (vector).
 * @property {boolean} isMatrix - Whether the uniform is a matrix.
 */
