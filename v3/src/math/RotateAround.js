//  p = Point or any object with public x/y properties
var RotateAround = function (p, cx, cy, angle)
{
    var c = Math.cos(angle);
    var s = Math.sin(angle);

    var x = p.x - cx;
    var y = p.y - cy;

    p.x = x * c - y * s + cx;
    p.y = x * s + y * c + cy;

    return p;
};

module.exports = RotateAround;
