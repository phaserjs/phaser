/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

//  http://www.blackpawn.com/texts/pointinpoly/

//  points is an array of Point-like objects with public x/y properties
//  returns an array containing all points that are within the triangle, or an empty array if none
//  if 'returnFirst' is true it will return after the first point within the triangle is found

/**
 * Filters an array of point-like objects to only those contained within a triangle.
 * If `returnFirst` is true, will return an array containing only the first point in the provided array that is within the triangle (or an empty array if there are no such points).
 *
 * @function Phaser.Geom.Triangle.ContainsArray
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Triangle} triangle - The triangle that the points are being checked in.
 * @param {Phaser.Geom.Point[]} points - An array of point-like objects (objects that have an `x` and `y` property)
 * @param {boolean} [returnFirst=false] - If `true`, return an array containing only the first point found that is within the triangle.
 * @param {array} [out] - If provided, the points that are within the triangle will be appended to this array instead of being added to a new array. If `returnFirst` is true, only the first point found within the triangle will be appended. This array will also be returned by this function.
 *
 * @return {Phaser.Geom.Point[]} An array containing all the points from `points` that are within the triangle, if an array was provided as `out`, points will be appended to that array and it will also be returned here.
 */
var ContainsArray = function (triangle, points, returnFirst, out)
{
    if (returnFirst === undefined) { returnFirst = false; }
    if (out === undefined) { out = []; }

    var v0x = triangle.x3 - triangle.x1;
    var v0y = triangle.y3 - triangle.y1;

    var v1x = triangle.x2 - triangle.x1;
    var v1y = triangle.y2 - triangle.y1;

    var dot00 = (v0x * v0x) + (v0y * v0y);
    var dot01 = (v0x * v1x) + (v0y * v1y);
    var dot11 = (v1x * v1x) + (v1y * v1y);

    // Compute barycentric coordinates
    var b = ((dot00 * dot11) - (dot01 * dot01));
    var inv = (b === 0) ? 0 : (1 / b);

    var u;
    var v;
    var v2x;
    var v2y;
    var dot02;
    var dot12;

    var x1 = triangle.x1;
    var y1 = triangle.y1;

    for (var i = 0; i < points.length; i++)
    {
        v2x = points[i].x - x1;
        v2y = points[i].y - y1;

        dot02 = (v0x * v2x) + (v0y * v2y);
        dot12 = (v1x * v2x) + (v1y * v2y);

        u = ((dot11 * dot02) - (dot01 * dot12)) * inv;
        v = ((dot00 * dot12) - (dot01 * dot02)) * inv;
    
        if (u >= 0 && v >= 0 && (u + v < 1))
        {
            out.push({ x: points[i].x, y: points[i].y });

            if (returnFirst)
            {
                break;
            }
        }
    }

    return out;
};

module.exports = ContainsArray;
