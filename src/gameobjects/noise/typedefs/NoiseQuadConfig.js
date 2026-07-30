/**
 * @typedef {object} Phaser.Types.GameObjects.Noise.NoiseQuadConfig
 * @since 4.0.0
 *
 * @property {number[]} [noiseOffset=[ 0, 0 ]] - The offset of the noise texture.
 * @property {number} [noisePower] - The exponent of the noise values. Lower values remove low values; higher values remove high values.
 * @property {number | string | number[] | Phaser.Display.Color} [noiseColorStart=0x000000] - The color at the middle of the cells.
 * @property {number | string | number[] | Phaser.Display.Color} [noiseColorEnd=0xffffff] - The color at the edge of the cells.
 * @property {boolean} [noiseRandomChannels] - Whether to render random noise in each color channel.
 * @property {boolean} [noiseRandomNormal] - Whether to render random normal vectors. This overrides `noiseRandomChannels`.
 */
