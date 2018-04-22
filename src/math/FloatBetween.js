/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * Generate a random floating point number between the two given bounds, minimum inclusive, maximum exclusive.
 *
 * @function Phaser.Math.FloatBetween
 * @since 3.0.0
 *
 * @param {float} min - The lower bound for the float, inclusive.
 * @param {float} max - The upper bound for the float exclusive.
 *
 * @return {float} A random float within the given range.
 */
var FloatBetween = function (min, max)
{
    return Math.random() * (max - min) + min;
};

module.exports = FloatBetween;
