/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Length = require('../line/Length');
var Line = require('../line/Line');
var Perimeter = require('./Perimeter');

/**
 * Returns an array of Point objects containing the coordinates of the points around the perimeter of the Polygon,
 * based on the given quantity or stepRate values.
 *
 * @function Phaser.Geom.Polygon.GetPoints
 * @since 3.12.0
 *
 * @param {Phaser.Geom.Polygon} polygon - The Polygon to get the points from.
 * @param {integer} quantity - The amount of points to return. If a falsey value the quantity will be derived from the `stepRate` instead.
 * @param {number} [stepRate] - Sets the quantity by getting the perimeter of the Polygon and dividing it by the stepRate.
 * @param {array} [output] - An array to insert the points in to. If not provided a new array will be created.
 *
 * @return {Phaser.Geom.Point[]} An array of Point objects pertaining to the points around the perimeter of the Polygon.
 */
var GetPoints = function (polygon, quantity, stepRate, out)
{
    if (out === undefined) { out = []; }

    var points = polygon.points;
    var perimeter = Perimeter(polygon);

    //  If quantity is a falsey value (false, null, 0, undefined, etc) then we calculate it based on the stepRate instead.
    if (!quantity)
    {
        quantity = perimeter / stepRate;
    }

    for (var i = 0; i < quantity; i++)
    {
        var position = perimeter * (i / quantity);
        var accumulatedPerimeter = 0;

        for (var j = 0; j < points.length; j++)
        {
            var pointA = points[j];
            var pointB = points[(j + 1) % points.length];
            var line = new Line(
                pointA.x,
                pointA.y,
                pointB.x,
                pointB.y
            );
            var length = Length(line);

            if (position < accumulatedPerimeter || position > accumulatedPerimeter + length)
            {
                accumulatedPerimeter += length;
                continue;
            }

            var point = line.getPoint((position - accumulatedPerimeter) / length);
            out.push(point);

            break;
        }
    }

    return out;
};

module.exports = GetPoints;
