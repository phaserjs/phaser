/**
 * @typedef {object} Phaser.Types.GameObjects.Stencil.StencilOptions
 * @since 4.NEXT
 *
 * @property {Phaser.Types.Renderer.WebGL.AlphaStrategy} [stencilAlphaStrategy='dither'] - The alpha strategy to use when rendering the stencil.
 * @property {boolean|'auto'} [stencilCompositeCheck='auto'] - Whether to composite the contents of the stencil to a framebuffer.
 * @property {boolean} [stencilInvert=false] - Whether to invert the stencil, using an extra draw call.
 * @property {Phaser.Types.GameObjects.Stencil.StencilLayerMode} [stencilLayerMode='addLayer'] - The mode which the Stencil runs in.
 * @property {number} [stencilClearValue=0] - The value to clear the stencil to, if the `stencilLayerMode` is `clear`.
 */
