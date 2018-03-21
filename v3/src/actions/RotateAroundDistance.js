var MathRotateAroundDistance = require('../math/RotateAroundDistance');

//  point = any object with public x/y properties
//  angle = radians
//  distance = px

var RotateAroundDistance = function (items, point, angle, distance)
{
    var x = point.x;
    var y = point.y;

    for (var i = 0; i < items.length; i++)
    {
        MathRotateAroundDistance(items[i], x, y, angle, distance);
    }

    return items;
};

module.exports = RotateAroundDistance;
