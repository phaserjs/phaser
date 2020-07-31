/**
 * @author       Richard Davey
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Vector3 = require('../../math/Vector3');

/**
 * Checks for intersection between the two line segments and returns the intersection point as a Vector3,
 * or `null` if the lines are parallel, or do not intersect.
 *
 * The `z` property of the Vector3 contains the intersection distance, which can be used to find
 * the closest intersecting point from a group of line segments.
 *
 * @function Phaser.Geom.Intersects.GetLineToLine
 * @since 3.50.0
 *
 * @param {Phaser.Geom.Line} line1 - The first line segment to check.
 * @param {Phaser.Geom.Line} line2 - The second line segment to check.
 * @param {Phaser.Math.Vector3} [out] - A Vector3 to store the intersection results in.
 *
 * @return {Phaser.Math.Vector3} A Vector3 containing the intersection results, or `null`.
 */
var GetLineToLine = function (line1, line2, out)
{
    var dx1 = line1.x2 - line1.x1;
    var dy1 = line1.y2 - line1.y1;

    var dx2 = line2.x2 - line2.x1;
    var dy2 = line2.y2 - line2.y1;

    var mag1 = Math.sqrt(dx1 * dx1 + dy1 * dy1);
    var mag2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);

    //  Parallel?
    if (dx1 / mag1 === dx2 / mag2 && dy1 / mag1 === dy2 / mag2)
    {
        return null;
    }

    var T2 = (dx1 * (line2.y1 - line1.y1) + dy1 * (line1.x1 - line2.x1)) / (dx2 * dy1 - dy2 * dx1);
    var T1 = (line2.x1 + dx2 * T2 - line1.x1) / dx1;

    //  Intersects?
    if (T1 < 0 || T2 < 0 || T2 > 1)
    {
        return null;
    }

    if (out === undefined)
    {
        out = new Vector3();
    }

    return out.set(
        line1.x1 + dx1 * T1,
        line1.y1 + dy1 * T1,
        T1
    );
};

module.exports = GetLineToLine;
