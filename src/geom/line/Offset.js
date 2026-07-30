/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Translates both endpoints of the given Line by the specified horizontal and vertical amounts, effectively moving the line to a new position in 2D space while preserving its length and angle.
 *
 * @function Phaser.Geom.Line.Offset
 * @since 3.0.0
 *
 * @generic {Phaser.Geom.Line} O - [line,$return]
 *
 * @param {Phaser.Geom.Line} line - The line to offset.
 * @param {number} x - The horizontal offset to add to the line.
 * @param {number} y - The vertical offset to add to the line.
 *
 * @return {Phaser.Geom.Line} The modified Line object, with both endpoints moved by the given offset.
 */
var Offset = function (line, x, y)
{
    line.x1 += x;
    line.y1 += y;

    line.x2 += x;
    line.y2 += y;

    return line;
};

module.exports = Offset;
