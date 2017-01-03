var Dot = require('./Dot');
var Point = require('./Point');
var GetMagnitudeSq = require('./GetMagnitudeSq');

var Project = function (pointA, pointB, out)
{
    if (out === undefined) { out = new Point(); }

    var amt = Dot(pointA, pointB) / GetMagnitudeSq(pointB);

    if (amt !== 0)
    {
        out.x = amt * pointB.x;
        out.y = amt * pointB.y;
    }

    return out;
};

module.exports = Project;
