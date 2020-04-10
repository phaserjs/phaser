/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var RotateAroundXY = require('./RotateAroundXY');

/**
 * Rotate a line around a point by the given angle in radians.
 *
 * @function Phaser.Geom.Line.RotateAroundPoint
 * @since 3.0.0
 *
 * @generic {Phaser.Geom.Line} O - [line,$return]
 *
 * @param {Phaser.Geom.Line} line - The line to rotate.
 * @param {(Phaser.Geom.Point|object)} point - The point to rotate the line around.
 * @param {number} angle - The angle of rotation in radians.
 *
 * @return {Phaser.Geom.Line} The rotated line.
 */
var RotateAroundPoint = function (line, point, angle)
{
    return RotateAroundXY(line, point.x, point.y, angle);
};

module.exports = RotateAroundPoint;
