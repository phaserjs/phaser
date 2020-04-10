/**
 * @author       Florian Vazelle
 * @author       Geoffrey Glaive
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
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

        var lDirX = lx2 - lx1;
        var lDirY = ly2 - ly1;
        var oDirX = lx1 - cx;
        var oDirY = ly1 - cy;

        var coefficientA = lDirX * lDirX + lDirY * lDirY;
        var coefficientB = 2 * (lDirX * oDirX + lDirY * oDirY);
        var coefficientC = oDirX * oDirX + oDirY * oDirY - cr * cr;

        var lambda = (coefficientB * coefficientB) - (4 * coefficientA * coefficientC);

        var x, y;

        if (lambda === 0)
        {
            var root = -coefficientB / (2 * coefficientA);
            x = lx1 + root * lDirX;
            y = ly1 + root * lDirY;
            if (root >= 0 && root <= 1)
            {
                out.push(new Point(x, y));
            }
        }
        else if (lambda > 0)
        {
            var root1 = (-coefficientB - Math.sqrt(lambda)) / (2 * coefficientA);
            x = lx1 + root1 * lDirX;
            y = ly1 + root1 * lDirY;
            if (root1 >= 0 && root1 <= 1)
            {
                out.push(new Point(x, y));
            }

            var root2 = (-coefficientB + Math.sqrt(lambda)) / (2 * coefficientA);
            x = lx1 + root2 * lDirX;
            y = ly1 + root2 * lDirY;
            if (root2 >= 0 && root2 <= 1)
            {
                out.push(new Point(x, y));
            }
        }
    }

    return out;
};

module.exports = GetLineToCircle;
