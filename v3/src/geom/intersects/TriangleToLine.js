
var LineToLine = require('./LineToLine');
var Contains = require('../triangle/Contains');

var TriangleToLine = function (triangle, line)
{
    //  If the Triangle contains either the start or end point of the line, it intersects
    if (Contains(triangle, line.getPointA()) || Contains(triangle, line.getPointB()))
    {
        return true;
    }

    //  Now check the line against each line of the Triangle
    if (LineToLine(triangle.getLineA(), line))
    {
        return true;
    }

    if (LineToLine(triangle.getLineB(), line))
    {
        return true;
    }

    if (LineToLine(triangle.getLineC(), line))
    {
        return true;
    }

    return false;
};

module.exports = TriangleToLine;
