/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Rectangle = require('../rectangle/Rectangle');

/**
 * Calculates the Axis Aligned Bounding Box (or aabb) from an array of points.
 *
 * @function Phaser.Geom.Point.GetRectangleFromPoints
 * @since 3.0.0
 *
 * @generic {Phaser.Geom.Rectangle} O - [out,$return]
 *
 * @param {Phaser.Geom.Point[]} points - [description]
 * @param {Phaser.Geom.Rectangle} [out] - [description]
 *
 * @return {Phaser.Geom.Rectangle} [description]
 */
var GetRectangleFromPoints = function (points, out)
{
    if (out === undefined) { out = new Rectangle(); }

    var xMax = Number.NEGATIVE_INFINITY;
    var xMin = Number.POSITIVE_INFINITY;
    var yMax = Number.NEGATIVE_INFINITY;
    var yMin = Number.POSITIVE_INFINITY;

    for (var i = 0; i < points.length; i++)
    {
        var point = points[i];

        if (point.x > xMax)
        {
            xMax = point.x;
        }

        if (point.x < xMin)
        {
            xMin = point.x;
        }

        if (point.y > yMax)
        {
            yMax = point.y;
        }

        if (point.y < yMin)
        {
            yMin = point.y;
        }
    }

    out.x = xMin;
    out.y = yMin;
    out.width = xMax - xMin;
    out.height = yMax - yMin;

    return out;
};

module.exports = GetRectangleFromPoints;
