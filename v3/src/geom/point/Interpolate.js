var Point = require('./Point');

var Interpolate = function (pointA, pointB, t, out)
{
    if (t === undefined) { t = 0; }
    if (out === undefined) { out = new Point(); }

    out.x = pointA.x + ((pointB.x - pointA.x) * t);
    out.y = pointA.y + ((pointB.y - pointA.y) * t);

    return out;
};

module.exports = Interpolate;
