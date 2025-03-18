/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Configuration settings for a DrawingContext.
 * 
 * @typedef {object} Phaser.Types.Renderer.WebGL.RenderNodes.DrawingContextOptions
 * @since 4.0.0
 *
 * @property {boolean|boolean[]} [autoClear=true] - Whether to automatically clear the framebuffer when the context comes into use. If an array, the elements are whether to clear the color, depth, and stencil buffers respectively.
 * @property {number} [blendMode=0] - The blend mode to use when rendering.
 * @property {?Phaser.Cameras.Scene2D.Camera} [camera=null] - The camera to use for this context.
 * @property {number[]} [clearColor=[0, 0, 0, 0]] - The color to clear the framebuffer with. This is an array of 4 values: red, green, blue, alpha.
 * @property {boolean} [useCanvas=false] - Whether to use the canvas as the framebuffer.
 * @property {Phaser.Renderer.WebGL.DrawingContext} [copyFrom] - The DrawingContext to copy from.
 * @property {number} [width] - The width of the framebuffer, used if `copyFrom` and `useCanvas` are not set. Default is the renderer width.
 * @property {number} [height] - The height of the framebuffer, used if `copyFrom` and `useCanvas` are not set. Default is the renderer height.
 * @property {Phaser.Renderer.WebGL.DrawingContextPool} [pool] - The pool to return to when this context is no longer needed. Used only for temporary contexts.
 */
