/**
 * @author       Richard Davey <rich@phaser.io>
 * @author       Florian Mertens
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Calculates the shortest (perpendicular) distance from an infinite line, defined by the two
 * endpoints of the given Line object, to the given Point. If the line has zero length (both
 * endpoints are identical), this function returns `false`.
 *
 * @function Phaser.Geom.Line.GetShortestDistance
 * @since 3.16.0
 *
 * @param {Phaser.Geom.Line} line - The line to get the distance from.
 * @param {Phaser.Types.Math.Vector2Like} point - The point to get the shortest distance to.
 *
 * @return {(boolean|number)} The shortest perpendicular distance from the line to the point, or `false` if the line has zero length.
 */
var GetShortestDistance = function (line, point)
{
    var x1 = line.x1;
    var y1 = line.y1;

    var x2 = line.x2;
    var y2 = line.y2;

    var L2 = (((x2 - x1) * (x2 - x1)) + ((y2 - y1) * (y2 - y1)));

    if (L2 === 0)
    {
        return false;
    }

    var s = (((y1 - point.y) * (x2 - x1)) - ((x1 - point.x) * (y2 - y1))) / L2;

    return Math.abs(s) * Math.sqrt(L2);
};

module.exports = GetShortestDistance;
