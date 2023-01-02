/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2013-2023 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var SmootherStep = require('../SmootherStep');

/**
 * A Smoother Step interpolation method.
 *
 * @function Phaser.Math.Interpolation.SmootherStep
 * @since 3.9.0
 * @see {@link https://en.wikipedia.org/wiki/Smoothstep#Variations}
 *
 * @param {number} t - The percentage of interpolation, between 0 and 1.
 * @param {number} min - The minimum value, also known as the 'left edge', assumed smaller than the 'right edge'.
 * @param {number} max - The maximum value, also known as the 'right edge', assumed greater than the 'left edge'.
 *
 * @return {number} The interpolated value.
 */
var SmootherStepInterpolation = function (t, min, max)
{
    return min + (max - min) * SmootherStep(t, 0, 1);
};

module.exports = SmootherStepInterpolation;
