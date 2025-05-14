/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Self-shadowing options for quad rendering.
 *
 * @typedef {object} Phaser.Types.Renderer.WebGL.RenderNodes.BatchHandlerQuadRenderOptionsSelfShadow
 * @since 4.0.0
 *
 * @property {boolean} enabled - Whether to use self-shadowing.
 * @property {number} penumbra - Self-shadowing penumbra strength.
 * @property {number} diffuseFlatThreshold - Self-shadowing texture brightness equivalent to a flat surface.
 */

/**
 * Lighting options for quad rendering.
 *
 * @typedef {object} Phaser.Types.Renderer.WebGL.RenderNodes.BatchHandlerQuadRenderOptionsLighting
 * @since 4.0.0
 *
 * @property {Phaser.Renderer.WebGL.Wrappers.WebGLTextureWrapper} normalGLTexture - The normal map texture to render.
 * @property {number} normalMapRotation - The rotation of the normal map texture.
 * @property {Phaser.Types.Renderer.WebGL.RenderNodes.BatchHandlerQuadRenderOptionsSelfShadow} [selfShadow] - Self-shadowing options.
 */

/**
 * Options to configure shader capabilities for quad rendering.
 *
 * @typedef {object} Phaser.Types.Renderer.WebGL.RenderNodes.BatchHandlerQuadRenderOptions
 * @since 4.0.0
 *
 * @property {boolean} [multiTexturing] - Whether to use multi-texturing.
 * @property {Phaser.Types.Renderer.WebGL.RenderNodes.BatchHandlerQuadRenderOptionsLighting} [lighting] - How to treat lighting. If this object is defined, lighting will be activated, and multi-texturing disabled.
 * @property {boolean} [smoothPixelArt] - Whether to use the smooth pixel art algorithm.
 * @param {boolean} [clampFrame] - Whether to clamp the texture frame. This prevents bleeding due to linear filtering. It is mostly useful for tiles.
 * @param {boolean} [wrapFrame] - Whether to wrap the texture frame. This is necessary for TileSprites.
 */
