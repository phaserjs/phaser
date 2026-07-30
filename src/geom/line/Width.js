/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Calculates the width of the given line, defined as the absolute difference between
 * the x-coordinates of its two endpoints (`x1` and `x2`). This represents the
 * horizontal extent of the line, not its geometric length. To get the true length
 * of the line, use `Phaser.Geom.Line.Length` instead.
 *
 * @function Phaser.Geom.Line.Width
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Line} line - The line to calculate the width of.
 *
 * @return {number} The width of the line, i.e. the absolute difference between its x1 and x2 coordinates.
 */
var Width = function (line)
{
    return Math.abs(line.x1 - line.x2);
};

module.exports = Width;
