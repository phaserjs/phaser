/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Wrap = require('../Wrap');

/**
 * Wrap an angle in degrees.
 *
 * Wraps the angle to a value in the range of -180 to 180.
 *
 * @function Phaser.Math.Angle.WrapDegrees
 * @since 3.0.0
 *
 * @param {number} angle - The angle to wrap, in degrees.
 *
 * @return {number} The wrapped angle, in degrees.
 */
var WrapDegrees = function (angle)
{
    return Wrap(angle, -180, 180);
};

module.exports = WrapDegrees;
