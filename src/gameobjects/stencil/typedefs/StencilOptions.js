/**
 * @typedef {object} Phaser.Types.GameObjects.Stencil.StencilOptions
 * @since 4.2.0
 *
 * @property {Phaser.Types.Renderer.WebGL.AlphaStrategy} [stencilAlphaStrategy='dither'] - The alpha strategy to use when rendering the stencil.
 * @property {number} [stencilClearValue=0] - The value to clear the stencil to, if the `stencilLayerMode` is `clear` or `clearRegion`. Must be between 0 and 255.
 * @property {boolean|'auto'} [stencilCompositeCheck='auto'] - Whether to composite the contents of the stencil to a framebuffer.
 * @property {boolean} [stencilInvert=false] - Whether to invert the stencil, using an extra draw call. This only works with the `addLayer` and `subtractLayer` modes.
 * @property {Phaser.Types.GameObjects.Stencil.StencilLayerMode} [stencilLayerMode='addLayer'] - The mode which the Stencil runs in.
 * @property {boolean} [stencilValueWrap=true] - Whether to wrap the value in the stencil buffer when it overflows or underflows when using the `addLayer` or `subtractLayer` mode. This is useful when defining stencils with subtraction, and you don't want to underflow from 0 to 255.
 */
