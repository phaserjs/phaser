/**
 * @author       Florian Vazelle
 * @author       Geoffrey Glaive
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Point = require('../point/Point');
var LineToCircle = require('./LineToCircle');

/**
 * Checks for intersection between the line segment and circle,
 * and returns the intersection points as a Point object array.
 *
 * @function Phaser.Geom.Intersects.GetLineToCircle
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Line} line - The line segment to check.
 * @param {Phaser.Geom.Circle} circle - The circle to check against the line.
 * @param {array} [out] - An optional array in which to store the points of intersection.
 *
 * @return {array} An array with the points of intersection if objects intersect, otherwise an empty array.
 */
var GetLineToCircle = function (line, circle, out)
{
    if (out === undefined) { out = []; }

    if (LineToCircle(line, circle))
    {
        var lx1 = line.x1;
        var ly1 = line.y1;

        var lx2 = line.x2;
        var ly2 = line.y2;

        var cx = circle.x;
        var cy = circle.y;
        var cr = circle.radius;

        // We determine the line equation
        var leadingCoefficient, originOrdinate;

        if (lx1 === lx2)
        {
        // Linear function
            leadingCoefficient = lx1;
            originOrdinate = 0;
        }
        else
        {
        // Constant function
            leadingCoefficient = (ly2 - ly1) / (lx2 - lx1);
            originOrdinate = ly1 - leadingCoefficient * lx1;
        }

        var coefficientA = (leadingCoefficient * leadingCoefficient) + 1;
        var coefficientB = (-2 * cx) - (2 * cy * leadingCoefficient) + (2 * leadingCoefficient * originOrdinate);
        var coefficientC = (cx * cx) + (cy * cy) + (originOrdinate * originOrdinate) - (cr * cr) - (2 * cy * originOrdinate);

        var lambda = (coefficientB * coefficientB) - (4 * coefficientA * coefficientC);

        var x, y;

        var xMin = Math.min(lx1, lx2);
        var yMin = Math.min(ly1, ly2);

        var xMax = Math.max(lx1, lx2);
        var yMax = Math.max(ly1, ly2);

        if (lambda === 0)
        {
            x = (-coefficientB / (2 * coefficientA));
            y = ((leadingCoefficient * x) + originOrdinate);
            if (Math.min(xMin, x) === xMin &&
            Math.min(yMin, y) === yMin &&
            Math.max(xMax, x) === xMax &&
            Math.max(yMax, y) === yMax)
            {
                out.push(new Point(x, y));
            }
        }
        else if (lambda > 0)
        {
            x = (-coefficientB + Math.sqrt(lambda)) / (2 * coefficientA);
            y = ((leadingCoefficient * x) + originOrdinate);
            if (Math.min(xMin, x) === xMin &&
            Math.min(yMin, y) === yMin &&
            Math.max(xMax, x) === xMax &&
            Math.max(yMax, y) === yMax)
            {
                out.push(new Point(x, y));
            }

            x = (-coefficientB - Math.sqrt(lambda)) / (2 * coefficientA);
            y = ((leadingCoefficient * x) + originOrdinate);
            if (Math.min(xMin, x) === xMin &&
            Math.min(yMin, y) === yMin &&
            Math.max(xMax, x) === xMax &&
            Math.max(yMax, y) === yMax)
            {
                out.push(new Point(x, y));
            }
        }
    }

    return out;
};

module.exports = GetLineToCircle;
