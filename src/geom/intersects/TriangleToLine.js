/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2022 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var LineToLine = require('./LineToLine');

/**
 * Checks if a Triangle and a Line intersect.
 *
 * The Line intersects the Triangle if it starts inside of it, ends inside of it, or crosses any of the Triangle's sides. Thus, the Triangle is considered "solid".
 *
 * @function Phaser.Geom.Intersects.TriangleToLine
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Triangle} triangle - The Triangle to check with.
 * @param {Phaser.Geom.Line} line - The Line to check with.
 *
 * @return {boolean} `true` if the Triangle and the Line intersect, otherwise `false`.
 */
var TriangleToLine = function (triangle, line)
{
    //  If the Triangle contains either the start or end point of the line, it intersects
    if (triangle.contains(line.x1, line.y1) || triangle.contains(line.x2, line.y2))
    {
        return true;
    }

    //  Now check the line against each line of the Triangle
    if (LineToLine(triangle.getLineA(), line))
    {
        return true;
    }

    if (LineToLine(triangle.getLineB(), line))
    {
        return true;
    }

    if (LineToLine(triangle.getLineC(), line))
    {
        return true;
    }

    return false;
};

module.exports = TriangleToLine;
