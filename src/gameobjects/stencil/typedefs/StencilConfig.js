/**
 * @typedef {object} Phaser.Types.GameObjects.Stencil.StencilConfig
 * @extends Phaser.Types.GameObjects.GameObjectConfig
 * @since 4.NEXT
 *
 * @property {Phaser.GameObjects.GameObject[]} [children] - An optional array of Game Objects to add to the Stencil.
 * @property {'addLayer'|'subtractLayer'} [stencilLayerMode='addLayer'] - The mode to use for the Stencil. Can be 'addLayer' or 'subtractLayer'.
 * @property {Phaser.Types.Renderer.WebGL.AlphaStrategy} [stencilAlphaStrategy='dither'] - The alpha strategy to use when rendering the stencil.
 * @property {boolean|'auto'} [stencilCompositeCheck='auto'] - Whether to composite the contents of the stencil to a framebuffer.
 */
