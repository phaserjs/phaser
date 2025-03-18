/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Calculate the perpendicular slope of the given line.
 *
 * @function Phaser.Geom.Line.PerpSlope
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Line} line - The line to calculate the perpendicular slope of.
 *
 * @return {number} The perpendicular slope of the line.
 */
var PerpSlope = function (line)
{
    return -((line.x2 - line.x1) / (line.y2 - line.y1));
};

module.exports = PerpSlope;
