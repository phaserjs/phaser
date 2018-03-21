/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var RotateAroundXY = require('./RotateAroundXY');

/**
 * [description]
 *
 * @function Phaser.Geom.Line.RotateAroundPoint
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Line} line - [description]
 * @param {(Phaser.Geom.Point|object)} point - [description]
 * @param {number} angle - [description]
 *
 * @return {Phaser.Geom.Line} [description]
 */
var RotateAroundPoint = function (line, point, angle)
{
    return RotateAroundXY(line, point.x, point.y, angle);
};

module.exports = RotateAroundPoint;
