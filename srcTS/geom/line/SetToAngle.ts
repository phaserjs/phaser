/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * Set a line to a given position, angle and length.
 *
 * @function Phaser.Geom.Line.SetToAngle
 * @since 3.0.0
 *
 * @generic {Phaser.Geom.Line} O - [line,$return]
 *
 * @param {Phaser.Geom.Line} line - The line to set.
 * @param {number} x - The horizontal start position of the line.
 * @param {number} y - The vertical start position of the line.
 * @param {number} angle - The angle of the line in radians.
 * @param {number} length - The length of the line.
 *
 * @return {Phaser.Geom.Line} The updated line.
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
