/**
 * @typedef {object} Phaser.Types.GameObjects.NoiseSimplex2D.NoiseSimplex2DQuadConfig
 * @since 4.0.0
 *
 * @property {number[]} [noiseCells=[ 32, 32 ]] - The number of cells in each dimension.
 * @property {number[]} [noisePeriod] - How many cells in each dimension before the pattern repeats. By default, this is the same as `noiseCells`.
 * @property {number[]} [noiseOffset=[ 0, 0 ]] - The offset of the noise texture.
 * @property {number} [noiseFlow=0] - The initial flow of the noise field. Use this to evolve the field along a period.
 * @property {number} [noiseWarpAmount=0] - How much turbulence to apply to the noise field.
 * @property {number} [noiseIterations=1] - How many octaves of noise to render, creating a more detailed output.
 * @property {number} [noiseWarpIterations=1] - How many octaves of noise to apply as turbulence, if `noiseWarpAmount` is greater than 0.
 * @property {boolean} [noiseNormalMap=false] - Whether to convert the noise to a normal map.
 * @property {number} [noiseNormalScale=1] - How much curvature to include in the normal map, if `noiseNormalMap` is enabled.
 * @property {number | string | number[] | Phaser.Display.Color} [noiseColorStart=0x000000] - The color at the middle of the cells.
 * @property {number | string | number[] | Phaser.Display.Color} [noiseColorEnd=0xffffff] - The color at the edge of the cells.
 * @property {number} [noiseDetailPower=2] - How much to increase detail per octave.
 * @property {number} [noiseFlowPower=2] - How much to increase flow per octave.
 * @property {number} [noiseContributionPower=2] - How much to shrink the contribution per octave.
 * @property {number} [noiseWarpDetailPower=2] - How much to increase warp detail per octave.
 * @property {number} [noiseWarpFlowPower=2] - How much to increase warp flow per octave.
 * @property {number} [noiseWarpContributionPower=2] - How much to shrink the warp contribution per octave.
 * @property {number} [noiseValueFactor=0.5] - How much to scale the noise value for output.
 * @property {number} [noiseValueAdd=0.5] - How much to add to the noise value for output.
 * @property {number} [noiseValuePower=1] - Exponent to apply to the noise value for output.
 * @property {number[]} [noiseSeed=[ 1, 2 ]] - The hash seed. Each seed creates a different pattern.
 */
