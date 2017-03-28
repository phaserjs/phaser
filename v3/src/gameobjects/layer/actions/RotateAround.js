var RotateAroundDistance = require('../../../math/RotateAroundDistance');
var DistanceBetween = require('../../../math/distance/DistanceBetween');

//  point = any object with public x/y properties

var RotateAround = function (point, angle)
{
    var x = point.x;
    var y = point.y;
    var children = this.children.entries;

    for (var i = 0; i < children.length; i++)
    {
        var child = children[i];

        RotateAroundDistance(child, x, y, angle, Math.max(1, DistanceBetween(child.x, child.y, x, y)));
    }

    return this;
};

module.exports = RotateAround;
