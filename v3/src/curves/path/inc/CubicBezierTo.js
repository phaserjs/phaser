var CubicBezierCurve = require('../../cubicbezier/CubicBezierCurve');
var Vector2 = require('../../../math/Vector2');

//  Creates a cubic bezier curve starting at the previous end point and ending at p3, using p1 and p2 as control points

var CubicBezierTo = function (x, y, control1X, control1Y, control2X, control2Y)
{
    var p0 = this.getEndPoint();
    var p1;
    var p2;
    var p3;

    //  Assume they're all vec2s
    if (x instanceof Vector2)
    {
        p1 = x;
        p2 = y;
        p3 = control1X;
    }
    else
    {
        p1 = new Vector2(control1X, control1Y);
        p2 = new Vector2(control2X, control2Y);
        p3 = new Vector2(x, y);
    }

    return this.add(new CubicBezierCurve(p0, p1, p2, p3));
};

module.exports = CubicBezierTo;
