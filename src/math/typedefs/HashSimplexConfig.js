/**
 * @typedef {object} Phaser.Types.Math.HashSimplexConfig
 * @since 4.0.0
 *
 * @property {number[]} [noiseCells=[ 32, 32, 32 ]] - The number of cells in each dimension.
 * @property {number[]} [noisePeriod] - How many cells in each dimension before the pattern repeats. By default, this is the same as `noiseCells`.
 * @property {number} [noiseFlow=0] - The initial flow of the noise field. Use this to evolve the field along a period.
 * @property {number} [noiseWarpAmount=0] - How much turbulence to apply to the noise field.
 * @property {number} [noiseIterations=1] - How many octaves of noise to render, creating a more detailed output.
 * @property {number} [noiseWarpIterations=1] - How many octaves of noise to apply as turbulence, if `noiseWarpAmount` is greater than 0.
 * @property {number} [noiseDetailPower=2] - How much to increase detail per octave.
 * @property {number} [noiseFlowPower=2] - How much to increase flow per octave.
 * @property {number} [noiseContributionPower=2] - How much to shrink the contribution per octave.
 * @property {number} [noiseWarpDetailPower=2] - How much to increase warp detail per octave.
 * @property {number} [noiseWarpFlowPower=2] - How much to increase warp flow per octave.
 * @property {number} [noiseWarpContributionPower=2] - How much to shrink the warp contribution per octave.
 * @property {number[]} [noiseSeed=[ 1, 2, 3 ]] - The hash seed. Each seed creates a different pattern. The numbers must be integers.
 */
