//  p = Point or any object with public x/y properties

var RotateAround = function (point, x, y, angle)
{
    var c = Math.cos(angle);
    var s = Math.sin(angle);

    var tx = point.x - x;
    var ty = point.y - y;

    point.x = tx * c - ty * s + x;
    point.y = tx * s + ty * c + y;

    return point;
};

module.exports = RotateAround;
