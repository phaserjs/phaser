/**
 * @author       samme
 * @copyright    2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var WrapAngle = require('./Wrap');

/**
 * Gets the shortest signed angular distance from angle1 to angle2.
 * A positive distance is a clockwise rotation.
 * A negative distance is a counter-clockwise rotation.
 *
 * For calculation in degrees use {@link Phaser.Math.Angle.ShortestBetween} instead.
 *
 * @function Phaser.Math.Angle.GetShortestDistance
 * @since 4.0.0
 *
 * @param {number} angle1 - The first angle in radians.
 * @param {number} angle2 - The second angle in radians.
 *
 * @return {number} The distance in radians, in the range [-pi, pi).
 */
var GetShortestDistance = function (angle1, angle2)
{
    return WrapAngle(angle2 - angle1);
};

module.exports = GetShortestDistance;
