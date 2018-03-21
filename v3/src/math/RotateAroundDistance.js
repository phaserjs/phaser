//  p = Point or any object with public x/y properties, the item to be rotated
//  x/y = the coordinate to rotate around
//  angle = radians
//  distance = in px

var RotateAroundDistance = function (point, x, y, angle, distance)
{
    var t = angle + Math.atan2(point.y - y, point.x - x);

    point.x = x + (distance * Math.cos(t));
    point.y = y + (distance * Math.sin(t));

    return point;
};

module.exports = RotateAroundDistance;
