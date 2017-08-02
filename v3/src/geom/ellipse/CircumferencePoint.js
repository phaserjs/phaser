/**
* Returns a Point object containing the coordinates of a point on the circumference of the Ellipse based on the given angle.
*/
var CircumferencePoint = function (ellipse, angle, out)
{
    if (out === undefined) { out = { x: 0, y: 0 }; }

    var a = ellipse.width / 2;
    var b = ellipse.height / 2;

    out.x = ellipse.x + a * Math.cos(angle);
    out.y = ellipse.y + b * Math.sin(angle);

    return out;
};

module.exports = CircumferencePoint;
