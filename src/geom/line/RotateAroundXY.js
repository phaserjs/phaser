/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * [description]
 *
 * @function Phaser.Geom.Line.RotateAroundXY
 * @since 3.0.0
 *
 * @generic {Phaser.Geom.Line} O - [line,$return]
 *
 * @param {Phaser.Geom.Line} line - [description]
 * @param {number} x - [description]
 * @param {number} y - [description]
 * @param {number} angle - [description]
 *
 * @return {Phaser.Geom.Line} [description]
 */
var RotateAroundXY = function (line, x, y, angle)
{
    var c = Math.cos(angle);
    var s = Math.sin(angle);

    var tx = line.x1 - x;
    var ty = line.y1 - y;

    line.x1 = tx * c - ty * s + x;
    line.y1 = tx * s + ty * c + y;

    tx = line.x2 - x;
    ty = line.y2 - y;

    line.x2 = tx * c - ty * s + x;
    line.y2 = tx * s + ty * c + y;

    return line;
};

module.exports = RotateAroundXY;
