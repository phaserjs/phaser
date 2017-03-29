var GetPointsOnLine = require('../geom/line/GetPointsOnLine');

var PlaceOnLine = function (items, line)
{
    var points = GetPointsOnLine(line);
    var step = points.length / items.length;
    var p = 0;

    for (var i = 0; i < items.length; i++)
    {
        var item = items[i];
        var point = points[Math.floor(p)];

        item.x = point[0];
        item.y = point[1];

        p += step;
    }

    return items;
};

module.exports = PlaceOnLine;
