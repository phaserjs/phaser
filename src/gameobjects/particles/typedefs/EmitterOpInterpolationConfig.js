/**
 * Defines an operation yielding a value incremented continuously across an interpolated data set.
 *
 * @typedef {object} Phaser.Types.GameObjects.Particles.EmitterOpInterpolationConfig
 * @since 3.60.0
 *
 * @property {number[]} values - The array of number values to interpolate through.
 * @property {(string|function)} [interpolation='Linear'] - The interpolation function to use. Typically one of `linear`, `bezier` or `catmull` or a custom function.
 * @property {(string|function)} [ease='Linear'] - An optional ease function to use. This can be either a string from the EaseMap, or a custom function.
 * @property {number[]} [easeParams] - An optional array of ease parameters to go with the ease.
 */
