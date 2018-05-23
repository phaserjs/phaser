/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * Smoothly interpolate between two values.
 *
 * Computes a smooth step interpolation between `min` and `max` by `x`.
 *
 * Produces an even smoother interpolation than {@link Phaser.Math.SmoothStep}.
 *
 * @function Phaser.Math.SmootherStep
 * @since 3.0.0
 *
 * @param {number} x - The percentage of interpolation, between 0 and 1.
 * @param {number} min - The minimum value.
 * @param {number} max - The maximum value.
 *
 * @return {number} The smoothly interpolated value.
 */
var SmootherStep = function (x, min, max)
{
    x = Math.max(0, Math.min(1, (x - min) / (max - min)));

    return x * x * x * (x * (x * 6 - 15) + 10);
};

module.exports = SmootherStep;
