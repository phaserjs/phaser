/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var RotateAroundXY = require('./RotateAroundXY');

/**
 * Rotate a line around its midpoint by the given angle in radians.
 *
 * @function Phaser.Geom.Line.Rotate
 * @since 3.0.0
 *
 * @generic {Phaser.Geom.Line} O - [line,$return]
 *
 * @param {Phaser.Geom.Line} line - The line to rotate.
 * @param {number} angle - The angle of rotation in radians.
 *
 * @return {Phaser.Geom.Line} The rotated line.
 */
var Rotate = function (line, angle)
{
    var x = (line.x1 + line.x2) / 2;
    var y = (line.y1 + line.y2) / 2;

    return RotateAroundXY(line, x, y, angle);
};

module.exports = Rotate;
