/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Find the angle of a segment from (point1.x, point1.y) -> (point2.x, point2.y).
 *
 * Unlike {@link Phaser.Math.Angle.BetweenPoints}, this function measures the angle from the positive Y axis (pointing
 * downward in screen space) rather than the positive X axis. This means an angle of 0 radians points straight down
 * the screen, making it useful for game objects whose default facing direction is upward (i.e. toward decreasing y).
 *
 * @function Phaser.Math.Angle.BetweenPointsY
 * @since 3.0.0
 *
 * @param {Phaser.Types.Math.Vector2Like} point1 - The first point.
 * @param {Phaser.Types.Math.Vector2Like} point2 - The second point.
 *
 * @return {number} The angle in radians.
 */
var BetweenPointsY = function (point1, point2)
{
    return Math.atan2(point2.x - point1.x, point2.y - point1.y);
};

module.exports = BetweenPointsY;
