/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Calculate a smoother interpolation percentage of `x` between `min` and `max`.
 *
 * The function receives the number `x` as an argument and returns 0 if `x` is less than or equal to the left edge,
 * 1 if `x` is greater than or equal to the right edge, and smoothly interpolates, using a Hermite polynomial,
 * between 0 and 1 otherwise.
 *
 * Produces an even smoother interpolation than {@link Phaser.Math.SmoothStep}.
 *
 * @function Phaser.Math.SmootherStep
 * @since 3.0.0
 * @see {@link https://en.wikipedia.org/wiki/Smoothstep#Variations}
 *
 * @param {number} x - The input value.
 * @param {number} min - The minimum value, also known as the 'left edge', assumed smaller than the 'right edge'.
 * @param {number} max - The maximum value, also known as the 'right edge', assumed greater than the 'left edge'.
 *
 * @return {number} The percentage of interpolation, between 0 and 1.
 */
var SmootherStep = function (x, min, max)
{
    x = Math.max(0, Math.min(1, (x - min) / (max - min)));

    return x * x * x * (x * (x * 6 - 15) + 10);
};

module.exports = SmootherStep;
