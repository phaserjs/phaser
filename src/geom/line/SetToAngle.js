/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * [description]
 *
 * @function Phaser.Geom.Line.SetToAngle
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Line} line - [description]
 * @param {number} x - [description]
 * @param {number} y - [description]
 * @param {number} angle - [description]
 * @param {number} length - [description]
 *
 * @return {Phaser.Geom.Line} [description]
 */
var SetToAngle = function (line, x, y, angle, length)
{
    line.x1 = x;
    line.y1 = y;

    line.x2 = x + (Math.cos(angle) * length);
    line.y2 = y + (Math.sin(angle) * length);

    return line;
};

module.exports = SetToAngle;
