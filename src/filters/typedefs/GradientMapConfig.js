/**
 * @typedef {object} Phaser.Types.Filters.GradientMapConfig
 * @since 4.0.0
 *
 * @property {Phaser.Display.ColorRamp | Phaser.Types.Display.ColorBandConfig | Phaser.Display.ColorBand | Array<Phaser.Types.Display.ColorBandConfig | Phaser.Display.ColorBand>} [ramp] - The color ramp to use.
 * @property {boolean} [dither=false] - Whether to dither the gradient output.
 * @property {number[]} [color=[0, 0, 0, 0]] - Value to add to each channel.
 * @property {number[]} [colorFactor=[0.3, 0.6, 0.1, 0]] - Factor to apply to each channel. Try to keep them summing to 1.
 * @property {boolean} [unpremultiply=true] - Whether to unpremultiply color data before processing it.
 * @property {number} [alpha=1] - How much of the effect to blend over the original.
 */
