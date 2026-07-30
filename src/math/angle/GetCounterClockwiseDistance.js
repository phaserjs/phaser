/**
 * @author       samme
 * @copyright    2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var MATH_CONST = require('../const');
var NormalizeAngle = require('./Normalize');

var TAU = MATH_CONST.TAU;

/**
 * Returns the counter-clockwise angular distance from `angle1` to `angle2`, expressed as a
 * non-positive value in radians. Counter-clockwise rotation is represented as negative, so the
 * result is always in the range (-2π, 0]. A result of 0 means the angles are equal or differ
 * by a full rotation. Use this when you need to measure how far to rotate counter-clockwise to
 * reach a target angle.
 *
 * @function Phaser.Math.Angle.GetCounterClockwiseDistance
 * @since 4.0.0
 *
 * @param {number} angle1 - The starting angle in radians.
 * @param {number} angle2 - The target angle in radians.
 *
 * @return {number} The counter-clockwise distance in radians, in the range (-2π, 0].
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
