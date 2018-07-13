/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * Round a given number so it is further away from zero. That is, positive numbers are rounded up, and negative numbers are rounded down.
 *
 * @function Phaser.Math.RoundAwayFromZero
 * @since 3.0.0
 *
 * @param {number} value - The number to round.
 *
 * @return {number} The rounded number, rounded away from zero.
 */
var RoundAwayFromZero = function (value)
{
    // "Opposite" of truncate.
    return (value > 0) ? Math.ceil(value) : Math.floor(value);
};

module.exports = RoundAwayFromZero;
