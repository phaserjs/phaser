/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Compares two lines for strict equality. Two lines are considered equal if their start
 * and end point coordinates all match exactly: `x1`, `y1`, `x2`, and `y2`.
 *
 * @function Phaser.Geom.Line.Equals
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Line} line - The first line to compare.
 * @param {Phaser.Geom.Line} toCompare - The second line to compare.
 *
 * @return {boolean} `true` if the two lines have identical start and end point coordinates, otherwise `false`.
 */
var Equals = function (line, toCompare)
{
    return (
        line.x1 === toCompare.x1 &&
        line.y1 === toCompare.y1 &&
        line.x2 === toCompare.x2 &&
        line.y2 === toCompare.y2
    );
};

module.exports = Equals;
