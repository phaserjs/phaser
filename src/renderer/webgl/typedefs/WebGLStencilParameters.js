/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * @typedef {object} Phaser.Types.Renderer.WebGL.WebGLStencilParameters
 * @since 4.0.0
 *
 * @property {GLboolean} [enabled] Whether stencil testing is enabled.
 * @property {object} [func] Stencil function parameters.
 * @property {GLenum} func.func The comparison function.
 * @property {GLint} func.ref The reference value for the stencil test.
 * @property {GLuint} func.mask The mask to apply to the stencil test.
 * @property {object} [op] Stencil operation parameters.
 * @property {GLenum} op.fail The operation to perform if the stencil test fails.
 * @property {GLenum} op.zfail The operation to perform if the depth test fails.
 * @property {GLenum} op.zpass The operation to perform if the stencil test passes and the depth test passes or is disabled.
 * @property {GLint} [clear] The value to clear the stencil buffer to.
 */

// The back stencil parameters are not currently used.
