/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Checks for intersection between the Line and a Rectangle shape, or a rectangle-like
 * object, with public `x`, `y`, `right` and `bottom` properties, such as a Sprite or Body.
 *
 * An intersection is considered valid if:
 *
 * The line starts within, or ends within, the Rectangle.
 * The line segment intersects one of the 4 rectangle edges.
 *
 * The for the purposes of this function rectangles are considered 'solid'.
 *
 * @function Phaser.Geom.Intersects.LineToRectangle
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Line} line - The Line to check for intersection.
 * @param {(Phaser.Geom.Rectangle|object)} rect - The Rectangle to check for intersection.
 *
 * @return {boolean} `true` if the Line and the Rectangle intersect, `false` otherwise.
 */
var LineToRectangle = function (line, rect)
{
    var x1 = line.x1;
    var y1 = line.y1;

    var x2 = line.x2;
    var y2 = line.y2;

    var bx1 = rect.x;
    var by1 = rect.y;
    var bx2 = rect.right;
    var by2 = rect.bottom;

    var t = 0;

    //  If the start or end of the line is inside the rect then we assume
    //  collision, as rects are solid for our use-case.

    if ((x1 >= bx1 && x1 <= bx2 && y1 >= by1 && y1 <= by2) ||
        (x2 >= bx1 && x2 <= bx2 && y2 >= by1 && y2 <= by2))
    {
        return true;
    }

    if (x1 < bx1 && x2 >= bx1)
    {
        //  Left edge
        t = y1 + (y2 - y1) * (bx1 - x1) / (x2 - x1);

        if (t > by1 && t <= by2)
        {
            return true;
        }
    }
    else if (x1 > bx2 && x2 <= bx2)
    {
        //  Right edge
        t = y1 + (y2 - y1) * (bx2 - x1) / (x2 - x1);

        if (t >= by1 && t <= by2)
        {
            return true;
        }
    }

    if (y1 < by1 && y2 >= by1)
    {
        //  Top edge
        t = x1 + (x2 - x1) * (by1 - y1) / (y2 - y1);

        if (t >= bx1 && t <= bx2)
        {
            return true;
        }
    }
    else if (y1 > by2 && y2 <= by2)
    {
        //  Bottom edge
        t = x1 + (x2 - x1) * (by2 - y1) / (y2 - y1);

        if (t >= bx1 && t <= bx2)
        {
            return true;
        }
    }

    return false;
};

module.exports = LineToRectangle;
