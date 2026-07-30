/**
 * @typedef {object} Phaser.Types.Filters.QuantizeConfig
 * @since 4.0.0
 *
 * @property {number[]} [steps=[ 8, 8, 8, 8 ]] - Number of steps to use per channel.
 * @property {number[]} [gamma=[ 1, 1, 1, 1 ]] - Gamma power to apply per channel.
 * @property {number[]} [offset=[ 0, 0, 0, 0 ]] - Offset to apply per channel.
 * @property {boolean} [dither=false] - Whether to dither the quantization.
 * @property {number} [mode=0] - Color space mode. 0 is RGBA. 1 is HSVA. Use HSVA for better treatment of hues.
 */
