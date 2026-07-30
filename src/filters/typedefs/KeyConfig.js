/**
 * @typedef {object} Phaser.Types.Filters.KeyConfig
 * @since 4.0.0
 *
 * @property {number | string | number[] | Phaser.Display.Color} [color=[1, 1, 1]] - The color to use for the key. It can be a hexcode number or string, an array of 3 numbers between 0 and 1, or a Color object.
 * @property {number} [alpha=1] - The amount of alpha to remove. This should be a value between 0 and 1, but you can go outside that range for different effects.
 * @property {boolean} [isolate=false] - Whether to keep the region matching the key color. If true, the region matching the key color will be kept, and the rest will be removed. If false, the region matching the key color will be removed, and the rest will be kept.
 * @property {number} [threshold=0.0625] - The threshold for the key color. A pixel is considered to be the key color if the difference between the pixel and the key color is less than the threshold. This should be a value between 0 and 1. The default threshold is 1 / 16, which is a good starting point for most images.
 * @property {number} [feather=0] - The feathering amount for the key color. Pixels outside the threshold, but still within the feather, will be a partial match. This should be a value between 0 and 1.
 */
