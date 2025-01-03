/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Contains = require('../circle/Contains');
var Point = require('../point/Point');

var tmp = new Point();

/**
 * Checks for intersection between the line segment and circle.
 *
 * Based on code by [Matt DesLauriers](https://github.com/mattdesl/line-circle-collision/blob/master/LICENSE.md).
 *
 * @function Phaser.Geom.Intersects.LineToCircle
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Line} line - The line segment to check.
 * @param {Phaser.Geom.Circle} circle - The circle to check against the line.
 * @param {(Phaser.Geom.Point|any)} [nearest] - An optional Point-like object. If given the closest point on the Line where the circle intersects will be stored in this object.
 *
 * @return {boolean} `true` if the two objects intersect, otherwise `false`.
 */
var LineToCircle = function (line, circle, nearest)
{
    if (nearest === undefined) { nearest = tmp; }

    if (Contains(circle, line.x1, line.y1))
    {
        nearest.x = line.x1;
        nearest.y = line.y1;

        return true;
    }

    if (Contains(circle, line.x2, line.y2))
    {
        nearest.x = line.x2;
        nearest.y = line.y2;

        return true;
    }

    var dx = line.x2 - line.x1;
    var dy = line.y2 - line.y1;

    var lcx = circle.x - line.x1;
    var lcy = circle.y - line.y1;

    //  project lc onto d, resulting in vector p
    var dLen2 = (dx * dx) + (dy * dy);
    var px = dx;
    var py = dy;

    if (dLen2 > 0)
    {
        var dp = ((lcx * dx) + (lcy * dy)) / dLen2;

        px *= dp;
        py *= dp;
    }

    nearest.x = line.x1 + px;
    nearest.y = line.y1 + py;

    //  len2 of p
    var pLen2 = (px * px) + (py * py);

    return (
        pLen2 <= dLen2 &&
        ((px * dx) + (py * dy)) >= 0 &&
        Contains(circle, nearest.x, nearest.y)
    );
};

module.exports = LineToCircle;
