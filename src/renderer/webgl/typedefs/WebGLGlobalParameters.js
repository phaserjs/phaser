/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * @typedef {object} Phaser.Types.Renderer.WebGL.WebGLGlobalParameters
 * @since 4.0.0
 *
 * @property {object} [bindings] Resources to be bound.
 * @property {GLint} [bindings.activeTexture] The active texture unit.
 * @property {Phaser.Renderer.WebGL.Wrappers.WebGLBufferWrapper} [bindings.arrayBuffer] The vertex array buffer to bind.
 * @property {Phaser.Renderer.WebGL.Wrappers.WebGLBufferWrapper} [bindings.elementArrayBuffer] The index array buffer to bind.
 * @property {Phaser.Renderer.WebGL.Wrappers.WebGLFramebufferWrapper} [bindings.framebuffer] The framebuffer to bind.
 * @property {Phaser.Renderer.WebGL.Wrappers.WebGLProgramWrapper} [bindings.program] The program to bind.
 * @property {WebGLRenderbuffer} [bindings.renderbuffer] The renderbuffer to bind.
 *
 * @property {Phaser.Types.Renderer.WebGL.WebGLBlendParameters} [blend] The blend parameters to set.
 *
 * @property {Float32Array[]} [colorClearValue] The color to clear the color buffer to. 4 elements, RGBA.
 * @property {GLboolean[]} [colorWritemask] The color writemask to set. 4 elements, RGBA.
 * @property {boolean} [cullFace] Whether to enable culling.
 * @property {boolean} [depthTest] Whether to enable depth testing.
 *
 * @property {object} [scissor] Scissor parameters to set.
 * @property {boolean} [scissor.enable] Whether to enable scissoring.
 * @property {Int32Array[]} [scissor.box] The scissor rectangle to set. 4 elements, XYWH. Note that these are stored in WebGL format, bottom-up, so the Y coordinate is inverted to screen space.
 *
 * @property {Phaser.Types.Renderer.WebGL.WebGLStencilParameters} [stencil] The stencil parameters to set.
 *
 * @property {object} [texturing] Texture settings to set. These take effect when creating a texture.
 * @property {GLboolean} [texturing.flipY] Should the texture be flipped on the Y axis?
 * @property {GLboolean} [texturing.premultiplyAlpha] Should the texture be pre-multiplied alpha?
 *
 * @property {Phaser.Renderer.WebGL.Wrappers.WebGLVAOWrapper} [vao] Vertex Array Object to bind. This controls the vertex attribute state.
 *
 * @property {Int32Array[]} [viewport] The viewport to set. 4 elements, XYWH.
 */
