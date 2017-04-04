
var LineToCircle = require('./LineToCircle');
var Contains = require('../triangle/Contains');

var TriangleToCircle = function (triangle, circle)
{
     //  First the cheapest ones:

    if (
        triangle.left > circle.right ||
        triangle.right < circle.left ||
        triangle.top > circle.bottom ||
        triangle.bottom < circle.top)
    {
        return false;
    }

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
