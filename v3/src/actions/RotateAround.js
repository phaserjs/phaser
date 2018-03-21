var RotateAroundDistance = require('../math/RotateAroundDistance');
var DistanceBetween = require('../math/distance/DistanceBetween');

//  point = any object with public x/y properties

var RotateAround = function (items, point, angle)
{
    var x = point.x;
    var y = point.y;

    for (var i = 0; i < items.length; i++)
    {
        var item = items[i];

        RotateAroundDistance(item, x, y, angle, Math.max(1, DistanceBetween(item.x, item.y, x, y)));
    }

    return items;
};

module.exports = RotateAround;
