/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Checks if the two values are within the given `tolerance` of each other.
 *
 * @function Phaser.Math.Within
 * @since 3.0.0
 *
 * @param {number} a - The first value to use in the calculation.
 * @param {number} b - The second value to use in the calculation.
 * @param {number} tolerance - The tolerance. Anything equal to or less than this value is considered as being within range.
 *
 * @return {boolean} Returns `true` if the absolute difference between `a` and `b` is less than or equal to `tolerance`.
 */
var Within = function (a, b, tolerance)
{
    return (Math.abs(a - b) <= tolerance);
};

module.exports = Within;
