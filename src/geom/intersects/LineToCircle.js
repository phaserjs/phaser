/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
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
 * @param {array} [out] - An array in which to optionally store the points of intersection.
 *
 * @return {boolean} `true` if the two objects intersect, otherwise `false`.
 */
var LineToCircle = function (line, circle, nearest, out)
{
    if (nearest === undefined) { nearest = tmp; }
    if (out === undefined) { out = []; }

    var lx0 = line.x1;
    var ly0 = line.y1;

    var lx1 = line.x2;
    var ly1 = line.y2;

    var cx = circle.x;
    var cy = circle.y;
    var cr = circle.radius;

    var output = false;

    // define nearest
    if (Contains(circle, lx0, ly0))
    {
        nearest.x = lx0;
        nearest.y = ly0;

        output = true;
    }
    else if (Contains(circle, lx1, ly1))
    {
        nearest.x = lx1;
        nearest.y = ly1;

        output = true;
    }
    else
    {
        var dx = lx1 - lx0;
        var dy = ly1 - ly0;

        var lcx = cx - lx0;
        var lcy = cy - ly0;

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

        nearest.x = lx0 + px;
        nearest.y = ly0 + py;

        //  len2 of p
        var pLen2 = (px * px) + (py * py);

        output = (pLen2 <= dLen2 &&
            ((px * dx) + (py * dy)) >= 0 &&
            Contains(circle, nearest.x, nearest.y));
    }

    if (!output) { return output; }

    // We determine the line equation

    var m, p;

    if (lx0 === lx1)
    {
        m = lx0;
        p = 0;
    }
    else
    {
        m = (ly1 - ly0) / (lx1 - lx0);
        p = ly0 - m * lx0;
    }

    var a = (m * m) + 1;
    var b = (-2 * cx) - (2 * cy * m) + (2 * m * p);
    var c = (cx * cx) + (cy * cy) + (p * p) - (cr * cr) - (2 * cy * p);

    var lambda = (b * b) - (4 * a * c);

    var x, y;

    var minx = Math.min(lx0, lx1);
    var miny = Math.min(ly0, ly1);

    var maxx = Math.max(lx0, lx1);
    var maxy = Math.max(ly0, ly1);

    if (lambda === 0)
    {
        x = (-b / (2 * a));
        y = ((m * x) + p);
        if (Math.min(minx, x) === minx &&
            Math.min(miny, y) === miny &&
            Math.max(maxx, x) === maxx &&
            Math.max(maxy, y) === maxy)
        {
            out.push(new Point(x, y));
            output = true;
        }
    }
    else if (lambda > 0)
    {
        x = (-b + Math.sqrt(lambda)) / (2 * a);
        y = ((m * x) + p);
        if (Math.min(minx, x) === minx &&
            Math.min(miny, y) === miny &&
            Math.max(maxx, x) === maxx &&
            Math.max(maxy, y) === maxy)
        {
            out.push(new Point(x, y));
            output = true;
        }

        x = (-b - Math.sqrt(lambda)) / (2 * a);
        y = ((m * x) + p);
        if (Math.min(minx, x) === minx &&
            Math.min(miny, y) === miny &&
            Math.max(maxx, x) === maxx &&
            Math.max(maxy, y) === maxy)
        {
            out.push(new Point(x, y));
            output = true;
        }
    }
    return output;
};

module.exports = LineToCircle;
