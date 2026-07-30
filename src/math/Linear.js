/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Performs a linear interpolation between two values, returning the value that is `t` percent of the way between `p0` and `p1`.
 *
 * @function Phaser.Math.Linear
 * @since 3.0.0
 *
 * @param {number} p0 - The first point.
 * @param {number} p1 - The second point.
 * @param {number} t - The percentage between p0 and p1 to return, represented as a number between 0 and 1.
 *
 * @return {number} The interpolated value between p0 and p1, at position t.
 */
var Linear = function (p0, p1, t)
{
    return (p1 - p0) * t + p0;
};

module.exports = Linear;
