/**
 * @author       Florian Vazelle
 * @author       Geoffrey Glaive
 * @copyright    2022 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var GetLineToRectangle = require('./GetLineToRectangle');
var RectangleToRectangle = require('./RectangleToRectangle');

/**
 * Checks if two Rectangles intersect and returns the intersection points as a Point object array.
 *
 * A Rectangle intersects another Rectangle if any part of its bounds is within the other Rectangle's bounds. As such, the two Rectangles are considered "solid". A Rectangle with no width or no height will never intersect another Rectangle.
 *
 * @function Phaser.Geom.Intersects.GetRectangleToRectangle
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Rectangle} rectA - The first Rectangle to check for intersection.
 * @param {Phaser.Geom.Rectangle} rectB - The second Rectangle to check for intersection.
 * @param {array} [out] - An optional array in which to store the points of intersection.
 *
 * @return {array} An array with the points of intersection if objects intersect, otherwise an empty array.
 */
var GetRectangleToRectangle = function (rectA, rectB, out)
{
    if (out === undefined) { out = []; }

    if (RectangleToRectangle(rectA, rectB))
    {
        var lineA = rectA.getLineA();
        var lineB = rectA.getLineB();
        var lineC = rectA.getLineC();
        var lineD = rectA.getLineD();

        GetLineToRectangle(lineA, rectB, out);
        GetLineToRectangle(lineB, rectB, out);
        GetLineToRectangle(lineC, rectB, out);
        GetLineToRectangle(lineD, rectB, out);
    }

    return out;
};

module.exports = GetRectangleToRectangle;
