/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

//  This is based off an explanation and expanded math presented by Paul Bourke:
//  See http://paulbourke.net/geometry/pointlineplane/

/**
 * Checks if two Lines intersect. If the Lines are identical, they will be treated as parallel and thus non-intersecting.
 *
 * @function Phaser.Geom.Intersects.LineToLine
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Line} line1 - The first Line to check.
 * @param {Phaser.Geom.Line} line2 - The second Line to check.
 * @param {Phaser.Types.Math.Vector2Like} [out] - An optional point-like object in which to store the coordinates of intersection, if needed.
 *
 * @return {boolean} `true` if the two Lines intersect, and the `out` object will be populated, if given. Otherwise, `false`.
 */
var LineToLine = function (line1, line2, out)
{
    var x1 = line1.x1;
    var y1 = line1.y1;
    var x2 = line1.x2;
    var y2 = line1.y2;

    var x3 = line2.x1;
    var y3 = line2.y1;
    var x4 = line2.x2;
    var y4 = line2.y2;

    //  Check that none of the lines are length zero
    if ((x1 === x2 && y1 === y2) || (x3 === x4 && y3 === y4))
    {
        return false;
    }

    var denom = ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));

    //  Make sure there is not a division by zero - this also indicates that the lines are parallel.
    //  If numA and numB were both equal to zero the lines would be on top of each other (coincidental).
    //  This check is not done because it is not necessary for this implementation (the parallel check accounts for this).

    if (denom === 0)
    {
        //  Lines are parallel
        return false;
    }

    //  Calculate the intermediate fractional point that the lines potentially intersect.

    var ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denom;
    var ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denom;

    //  The fractional point will be between 0 and 1 inclusive if the lines intersect.
    //  If the fractional calculation is larger than 1 or smaller than 0 the lines would need to be longer to intersect.

    if (ua < 0 || ua > 1 || ub < 0 || ub > 1)
    {
        return false;
    }
    else
    {
        if (out)
        {
            out.x = x1 + ua * (x2 - x1);
            out.y = y1 + ua * (y2 - y1);
        }

        return true;
    }
};

module.exports = LineToLine;
