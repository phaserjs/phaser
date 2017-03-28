var MathRotateAroundDistance = require('../../../math/RotateAroundDistance');

//  point = any object with public x/y properties
//  angle = radians
//  distance = px

var RotateAroundDistance = function (point, angle, distance)
{
    var x = point.x;
    var y = point.y;
    var children = this.children.entries;

    for (var i = 0; i < children.length; i++)
    {
        MathRotateAroundDistance(children[i], x, y, angle, distance);
    }

    return this;
};

module.exports = RotateAroundDistance;
