/**
 * @author       Florian Vazelle
 * @author       Geoffrey Glaive
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var RectangleToTriangle = require('./RectangleToTriangle');
var GetLineToRectangle = require('./GetLineToRectangle');

/**
 * Checks for intersection between Rectangle shape and Triangle shape,
 * and returns the intersection points as a Point object array.
 *
 * @function Phaser.Geom.Intersects.GetRectangleToTriangle
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Rectangle} rect - Rectangle object to test.
 * @param {Phaser.Geom.Triangle} triangle - Triangle object to test.
 * @param {array} [out] - An optional array in which to store the points of intersection.
 *
 * @return {array} An array with the points of intersection if objects intersect, otherwise an empty array.
 */
var GetRectangleToTriangle = function (rect, triangle, out)
{
    if (out === undefined) { out = []; }

    if (RectangleToTriangle(rect, triangle))
    {
        var lineA = triangle.getLineA();
        var lineB = triangle.getLineB();
        var lineC = triangle.getLineC();

        GetLineToRectangle(lineA, rect, out);
        GetLineToRectangle(lineB, rect, out);
        GetLineToRectangle(lineC, rect, out);
    }

    return out;
};

module.exports = GetRectangleToTriangle;
