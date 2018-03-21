var GetMagnitude = require('./GetMagnitude');

var Normalize = function (point)
{
    if (point.x !== 0 && point.y !== 0)
    {
        var m = GetMagnitude(point);

        point.x /= m;
        point.y /= m;
    }

    return point;
};

module.exports = Normalize;
