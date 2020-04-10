/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Generate a random floating point number between the two given bounds, minimum inclusive, maximum exclusive.
 *
 * @function Phaser.Math.FloatBetween
 * @since 3.0.0
 *
 * @param {number} min - The lower bound for the float, inclusive.
 * @param {number} max - The upper bound for the float exclusive.
 *
 * @return {number} A random float within the given range.
 */
var FloatBetween = function (min, max)
{
    return Math.random() * (max - min) + min;
};

module.exports = FloatBetween;
