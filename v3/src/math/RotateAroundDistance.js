//  p = Point or any object with public x/y properties

var RotateAroundDistance = function (point, x, y, angle, distance)
{
    var t = angle + Math.atan2(point.y - y, point.x - x);

    point.x = x + (distance * Math.cos(t));
    point.y = y + (distance * Math.sin(t));

    return point;
};

module.exports = RotateAroundDistance;
