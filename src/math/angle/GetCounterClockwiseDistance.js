/**
 * @author       samme
 * @copyright    2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var NormalizeAngle = require('./Normalize');

var TAU = 2 * Math.PI;

/**
 * Gets the shortest nonpositive angular distance from angle1 to angle2.
 *
 * @function Phaser.Math.Angle.GetCounterClockwiseDistance
 * @since 4.0.0
 *
 * @param {number} angle1 - The starting angle in radians.
 * @param {number} angle2 - The target angle in radians.
 *
 * @return {number} The distance in radians, in the range (-2pi, 0].
 */
var GetCounterClockwiseDistance = function (angle1, angle2)
{
    var distance = NormalizeAngle(angle2 - angle1);

    if (distance > 0)
    {
        distance -= TAU;
    }

    return distance;
};

module.exports = GetCounterClockwiseDistance;
