/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * Rotate a line around the given coordinates by the given angle in radians.
 *
 * @function Phaser.Geom.Line.RotateAroundXY
 * @since 3.0.0
 *
 * @generic {Phaser.Geom.Line} O - [line,$return]
 *
 * @param {Phaser.Geom.Line} line - The line to rotate.
 * @param {number} x - The horizontal coordinate to rotate the line around.
 * @param {number} y - The vertical coordinate to rotate the line around.
 * @param {number} angle - The angle of rotation in radians.
 *
 * @return {Phaser.Geom.Line} The rotated line.
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
