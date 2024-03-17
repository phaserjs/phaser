/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * @typedef {object} Phaser.Types.Renderer.WebGL.WebGLGlobalParameters
 * @since 3.90.0
 *
 * @property {Phaser.Types.Renderer.WebGL.WebGLBlendParameters} [blend] The blend parameters to set.
 *
 * @property {object} [bindings] Resources to be bound.
 * @property {GLint} [bindings.activeTexture] The active texture unit.
 * @property {Phaser.Renderer.WebGL.Wrappers.WebGLBufferWrapper} [bindings.arrayBuffer] The vertex array buffer to bind.
 * @property {Phaser.Renderer.WebGL.Wrappers.WebGLBufferWrapper} [bindings.elementArrayBuffer] The index array buffer to bind.
 * @property {Phaser.Renderer.WebGL.Wrappers.WebGLFramebufferWrapper} [bindings.framebuffer] The framebuffer to bind.
 * @property {Phaser.Renderer.WebGL.Wrappers.WebGLProgramWrapper} [bindings.program] The program to bind.
 * @property {Phaser.Renderer.WebGL.Wrappers.WebGLTextureWrapper} [bindings.texture] The texture to bind.
 *
 * @property {Float32Array[4]} [colorClearValue] The color to clear the color buffer to.
 * @property {GLboolean[4]} [colorWritemask] The color writemask to set.
 * @property {boolean} [cullFace] Whether to enable culling.
 * @property {boolean} [depthTest] Whether to enable depth testing.
 *
 * @property {object} [scissor] Scissor parameters to set.
 * @property {boolean} [scissor.enable] Whether to enable scissoring.
 * @property {Int32Array[4]} [scissor.box] The scissor rectangle to set.
 *
 * @property {Phaser.Types.Renderer.WebGL.WebGLStencilParameters} [stencil] The stencil parameters to set.
 *
 * @property {object} [texturing] Texture settings to set. These take effect when creating a texture.
 * @property {GLboolean} [texturing.flipY] Should the texture be flipped on the Y axis?
 * @property {GLboolean} [texturing.premultiplyAlpha] Should the texture be pre-multiplied alpha?
 *
 * @property {Phaser.Renderer.WebGL.Wrappers.WebGLTextureWrapper[]} [textureUnits] Textures to be bound to each texture unit.
 *
 * @property {Int32Array[4]} [viewport] The viewport to set.
 */
