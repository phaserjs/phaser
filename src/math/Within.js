/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * Checks if the two values are within the given `tolerance` of each other.
 *
 * @function Phaser.Math.Within
 * @since 3.0.0
 *
 * @param {number} a - [description]
 * @param {number} b - [description]
 * @param {number} tolerance - The tolerance. Anything equal to or less than this value is considered as being within range.
 *
 * @return {boolean} Returns `true` if `a` is less than or equal to the tolerance of `b`.
 */
var Within = function (a, b, tolerance)
{
    return (Math.abs(a - b) <= tolerance);
};

module.exports = Within;
