/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Vector2 = require('../../math/Vector2');

//  Adapted from http://bjornharrtell.github.io/jsts/doc/api/jsts_geom_Triangle.js.html

/**
 * Computes the determinant of a 2x2 matrix. Uses standard double-precision arithmetic, so is susceptible to round-off error.
 *
 * @function det
 * @private
 * @since 3.0.0
 *
 * @param {number} m00 - The [0,0] entry of the matrix.
 * @param {number} m01 - The [0,1] entry of the matrix.
 * @param {number} m10 - The [1,0] entry of the matrix.
 * @param {number} m11 - The [1,1] entry of the matrix.
 *
 * @return {number} the determinant.
 */
function det (m00, m01, m10, m11)
{
    return (m00 * m11) - (m01 * m10);
}

/**
 * Computes the circumcentre of a triangle. The circumcentre is the centre of
 * the circumcircle, the smallest circle which encloses the triangle. It is also
 * the common intersection point of the perpendicular bisectors of the sides of
 * the triangle, and is the only point which has equal distance to all three
 * vertices of the triangle.
 *
 * @function Phaser.Geom.Triangle.CircumCenter
 * @since 3.0.0
 *
 * @generic {Phaser.Math.Vector2} O - [out,$return]
 *
 * @param {Phaser.Geom.Triangle} triangle - The Triangle to get the circumcenter of.
 * @param {Phaser.Math.Vector2} [out] - The Vector2 object to store the position in. If not given, a new Vector2 instance is created.
 *
 * @return {Phaser.Math.Vector2} A Vector2 object holding the coordinates of the circumcenter of the Triangle.
 */
var CircumCenter = function (triangle, out)
{
    if (out === undefined) { out = new Vector2(); }

    var cx = triangle.x3;
    var cy = triangle.y3;

    var ax = triangle.x1 - cx;
    var ay = triangle.y1 - cy;

    var bx = triangle.x2 - cx;
    var by = triangle.y2 - cy;

    var denom = 2 * det(ax, ay, bx, by);
    var numx = det(ay, ax * ax + ay * ay, by, bx * bx + by * by);
    var numy = det(ax, ax * ax + ay * ay, bx, bx * bx + by * by);

    out.x = cx - numx / denom;
    out.y = cy + numy / denom;

    return out;
};

module.exports = CircumCenter;
