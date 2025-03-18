/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Calculate the width of the given line.
 *
 * @function Phaser.Geom.Line.Width
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Line} line - The line to calculate the width of.
 *
 * @return {number} The width of the line.
 */
var Width = function (line)
{
    return Math.abs(line.x1 - line.x2);
};

module.exports = Width;
