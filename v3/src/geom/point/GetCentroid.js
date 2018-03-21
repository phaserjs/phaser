var Point = require('./Point');

var GetCentroid = function (points, out)
{
    if (out === undefined) { out = new Point(); }

    if (!Array.isArray(points))
    {
        throw new Error('GetCentroid points argument must be an array');
    }

    var len = points.length;

    if (len < 1)
    {
        throw new Error('GetCentroid points array must not be empty');
    }
    else if (len === 1)
    {
        out.x = points[0].x;
        out.y = points[0].y;
    }
    else
    {
        for (var i = 0; i < len; i++)
        {
            out.x += points[i].x;
            out.y += points[i].y;
        }

        out.x /= len;
        out.y /= len;
    }

    return out;
};

module.exports = GetCentroid;
