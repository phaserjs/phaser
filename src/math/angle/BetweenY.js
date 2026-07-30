/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Find the angle of a segment from (x1, y1) -> (x2, y2).
 *
 * The difference between this method and {@link Phaser.Math.Angle.Between} is that it measures the angle from
 * the Y axis rather than the X axis. This means a result of zero indicates the segment points straight down (along
 * the positive Y axis), making it suitable for use with sprites that face upward by default.
 *
 * @function Phaser.Math.Angle.BetweenY
 * @since 3.0.0
 *
 * @param {number} x1 - The x coordinate of the first point.
 * @param {number} y1 - The y coordinate of the first point.
 * @param {number} x2 - The x coordinate of the second point.
 * @param {number} y2 - The y coordinate of the second point.
 *
 * @return {number} The angle in radians.
 */
var BetweenY = function (x1, y1, x2, y2)
{
    return Math.atan2(x2 - x1, y2 - y1);
};

module.exports = BetweenY;
