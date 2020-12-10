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
    var x1 = line1.x1;
    var y1 = line1.y1;
    var x2 = line1.x2;
    var y2 = line1.y2;

    var x3 = line2.x1;
    var y3 = line2.y1;
    var x4 = line2.x2;
    var y4 = line2.y2;

    var dx1 = x2 - x1;
    var dy1 = y2 - y1;

    var dx2 = x4 - x3;
    var dy2 = y4 - y3;

    var denom = dy2 * dx1 - dx2 * dy1;

    //  Make sure there is not a division by zero - this also indicates that the lines are parallel.
    //  If numA and numB were both equal to zero the lines would be on top of each other (coincidental).
    //  This check is not done because it is not necessary for this implementation (the parallel check accounts for this).

    if (dx1 === 0 || denom === 0)
    {
        return false;
    }

    var T2 = (dx1 * (y3 - y1) + dy1 * (x1 - x3)) / (dx2 * dy1 - dy2 * dx1);
    var T1 = (x3 + dx2 * T2 - x1) / dx1;

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
        x1 + dx1 * T1,
        y1 + dy1 * T1,
        T1
    );
};

module.exports = GetLineToLine;
