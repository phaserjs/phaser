/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var MATH_CONST = require('../../math/const');
var Wrap = require('../../math/Wrap');
var Angle = require('./Angle');

/**
 * Get the angle of the normal of the given line in radians.
 *
 * @function Phaser.Geom.Line.NormalAngle
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Line} line - The line to calculate the angle of the normal of.
 *
 * @return {number} The angle of the normal of the line in radians.
 */
var NormalAngle = function (line)
{
    var angle = Angle(line) - MATH_CONST.TAU;

    return Wrap(angle, -Math.PI, Math.PI);
};

module.exports = NormalAngle;
