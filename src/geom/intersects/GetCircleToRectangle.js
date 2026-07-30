/**
 * @author       Florian Vazelle
 * @author       Geoffrey Glaive
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var GetLineToCircle = require('./GetLineToCircle');
var CircleToRectangle = require('./CircleToRectangle');

/**
 * Checks for intersection between a circle and a rectangle, and returns the
 * intersection points as an array of Point objects. If the shapes do not intersect,
 * an empty array is returned. If they do intersect, each of the rectangle's four
 * edges is tested against the circle and any intersection points found are added to
 * the output array.
 *
 * @function Phaser.Geom.Intersects.GetCircleToRectangle
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Circle} circle - The circle to be checked.
 * @param {Phaser.Geom.Rectangle} rect - The rectangle to be checked.
 * @param {array} [out] - An optional array in which to store the points of intersection.
 *
 * @return {array} An array with the points of intersection if objects intersect, otherwise an empty array.
 */
var GetCircleToRectangle = function (circle, rect, out)
{
    if (out === undefined) { out = []; }

    if (CircleToRectangle(circle, rect))
    {
        var lineA = rect.getLineA();
        var lineB = rect.getLineB();
        var lineC = rect.getLineC();
        var lineD = rect.getLineD();

        GetLineToCircle(lineA, circle, out);
        GetLineToCircle(lineB, circle, out);
        GetLineToCircle(lineC, circle, out);
        GetLineToCircle(lineD, circle, out);
    }

    return out;
};

module.exports = GetCircleToRectangle;
