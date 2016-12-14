//  p = Point or any object with public x/y properties
var Rotate = function (p, angle)
{
    var x = p.x;
    var y = p.y;

    p.x = x * Math.cos(angle) - y * Math.sin(angle);
    p.y = x * Math.sin(angle) + y * Math.cos(angle);

    return p;
};

module.exports = Rotate;
