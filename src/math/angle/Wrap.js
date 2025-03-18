/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var MathWrap = require('../Wrap');

/**
 * Wrap an angle.
 *
 * Wraps the angle to a value in the range of -PI to PI.
 *
 * @function Phaser.Math.Angle.Wrap
 * @since 3.0.0
 *
 * @param {number} angle - The angle to wrap, in radians.
 *
 * @return {number} The wrapped angle, in radians.
 */
var Wrap = function (angle)
{
    return MathWrap(angle, -Math.PI, Math.PI);
};

module.exports = Wrap;
