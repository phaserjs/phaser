var Rectangle = require('../rectangle/Rectangle');

/**
* Calculates the Axis Aligned Bounding Box (or aabb) from an array of points.
*
* @method Phaser.Rectangle#aabb
* @param {Phaser.Point[]} points - The array of one or more points.
* @param {Phaser.Rectangle} [out] - Optional Rectangle to store the value in, if not supplied a new Rectangle object will be created.
* @return {Phaser.Rectangle} The new Rectangle object.
* @static
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
