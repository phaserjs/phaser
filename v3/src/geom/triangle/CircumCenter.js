//  Adapted from http://bjornharrtell.github.io/jsts/doc/api/jsts_geom_Triangle.js.html

/**
 * Computes the determinant of a 2x2 matrix. Uses standard double-precision
 * arithmetic, so is susceptible to round-off error.
 *
 * @param {Number}
 *          m00 the [0,0] entry of the matrix.
 * @param {Number}
 *          m01 the [0,1] entry of the matrix.
 * @param {Number}
 *          m10 the [1,0] entry of the matrix.
 * @param {Number}
 *          m11 the [1,1] entry of the matrix.
 * @return {Number} the determinant.
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
 * <p>
 * This method uses an algorithm due to J.R.Shewchuk which uses normalization to
 * the origin to improve the accuracy of computation. (See <i>Lecture Notes on
 * Geometric Robustness</i>, Jonathan Richard Shewchuk, 1999).
 */
var CircumCenter = function (triangle, out)
{
    if (out === undefined) { out = { x: 0, y: 0 }; }

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
