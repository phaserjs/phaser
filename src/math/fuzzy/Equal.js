/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * Check whether the given values are equal.
 *
 * @function Phaser.Math.Fuzzy.Equal
 * @since 3.0.0
 *
 * @param {number} a - The first value.
 * @param {number} b - The second value.
 * @param {float} [epsilon=0.0001] - The epsilon.
 *
 * @return {boolean} Whether the given values are equal.
 */
var Equal = function (a, b, epsilon)
{
    if (epsilon === undefined) { epsilon = 0.0001; }

    return Math.abs(a - b) < epsilon;
};

module.exports = Equal;
