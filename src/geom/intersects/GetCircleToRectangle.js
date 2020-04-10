/**
 * @author       Florian Vazelle
 * @author       Geoffrey Glaive
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var GetLineToCircle = require('./GetLineToCircle');
var CircleToRectangle = require('./CircleToRectangle');

/**
 * Checks for intersection between a circle and a rectangle,
 * and returns the intersection points as a Point object array.
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
