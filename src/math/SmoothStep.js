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
 * @function Phaser.Math.SmoothStep
 * @since 3.0.0
 *
 * @param {number} x - The percentage of interpolation, between 0 and 1.
 * @param {number} min - The minimum value.
 * @param {number} max - The maximum value.
 *
 * @return {number} The smoothly interpolated value.
 */
var SmoothStep = function (x, min, max)
{
    x = Math.max(0, Math.min(1, (x - min) / (max - min)));

    return x * x * (3 - 2 * x);
};

module.exports = SmoothStep;
