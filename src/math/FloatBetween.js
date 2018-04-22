/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * Generate a random floating point number between the given maximum and minimum bounds with the minimum bound inclusive, maximum bound exclusive.
 *
 * @function Phaser.Math.FloatBetween
 * @since 3.0.0
 *
 * @param {float} min - The minimum bound of the generated float (inclusive).
 * @param {float} max - The maximum bound of the generated float (exclusive).
 *
 * @return {float} The randomly generated float.
 */
var FloatBetween = function (min, max)
{
    return Math.random() * (max - min) + min;
};

module.exports = FloatBetween;
