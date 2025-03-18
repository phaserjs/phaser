/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Calculate the height of the given line.
 *
 * @function Phaser.Geom.Line.Height
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Line} line - The line to calculate the height of.
 *
 * @return {number} The height of the line.
 */
var Height = function (line)
{
    return Math.abs(line.y1 - line.y2);
};

module.exports = Height;
