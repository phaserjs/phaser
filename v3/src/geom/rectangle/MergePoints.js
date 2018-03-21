//  Merges the target Rectangle with a list of points.
//  The points is an array of objects with public x/y properties.

var MergePoints = function (target, points)
{
    var minX = target.x;
    var maxX = target.right;
    var minY = target.y;
    var maxY = target.bottom;

    for (var i = 0; i < points.length; i++)
    {
        minX = Math.min(minX, points[i].x);
        maxX = Math.max(maxX, points[i].x);
        minY = Math.min(minY, points[i].y);
        maxY = Math.max(maxY, points[i].y);
    }

    target.x = minX;
    target.y = minY;
    target.width = maxX - minX;
    target.height = maxY - minY;

    return target;
};

module.exports = MergePoints;
