/**
* Returns a Point object containing the coordinates of a point on the circumference of the Circle based on the given angle.
*/
var CircumferencePoint = function (circle, angle, out)
{
    if (out === undefined) { out = { x: 0, y: 0 }; }

    out.x = circle.x + (circle.radius * Math.cos(angle));
    out.y = circle.y + (circle.radius * Math.sin(angle));

    return out;
};

module.exports = CircumferencePoint;
