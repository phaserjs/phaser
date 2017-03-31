
var LineToCircle = require('./LineToCircle');
var Contains = require('../triangle/Contains');

var TriangleToCircle = function (triangle, circle)
{
    if (Contains(triangle, circle))
    {
        return true;
    }

    if (LineToCircle(triangle.getLineA(), circle))
    {
        return true;
    }

    if (LineToCircle(triangle.getLineB(), circle))
    {
        return true;
    }

    if (LineToCircle(triangle.getLineC(), circle))
    {
        return true;
    }

    return false;
};

module.exports = TriangleToCircle;
