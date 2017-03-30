var GetPointsOnLine = require('../geom/line/GetPointsOnLine');

var PlaceOnTriangle = function (items, triangle, stepRate)
{
    var p1 = GetPointsOnLine({ x1: triangle.x1, y1: triangle.y1, x2: triangle.x2, y2: triangle.y2 }, stepRate);
    var p2 = GetPointsOnLine({ x1: triangle.x2, y1: triangle.y2, x2: triangle.x3, y2: triangle.y3 }, stepRate);
    var p3 = GetPointsOnLine({ x1: triangle.x3, y1: triangle.y3, x2: triangle.x1, y2: triangle.y1 }, stepRate);

    //  Remove overlaps
    p1.pop();
    p2.pop();
    p3.pop();

    p1 = p1.concat(p2, p3);

    var step = p1.length / items.length;
    var p = 0;

    for (var i = 0; i < items.length; i++)
    {
        var item = items[i];
        var point = p1[Math.floor(p)];

        item.x = point[0];
        item.y = point[1];

        p += step;
    }

    return items;
};

module.exports = PlaceOnTriangle;
