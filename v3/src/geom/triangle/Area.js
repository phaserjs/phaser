// The 2D area of a triangle. The area value is always non-negative.

var Area = function (triangle)
{
    var x1 = triangle.x1;
    var y1 = triangle.y1;

    var x2 = triangle.x2;
    var y2 = triangle.y2;

    var x3 = triangle.x3;
    var y3 = triangle.y3;

    return Math.abs(((x3 - x1) * (y2 - y1) - (x2 - x1) * (y3 - y1)) / 2);
};

module.exports = Area;
