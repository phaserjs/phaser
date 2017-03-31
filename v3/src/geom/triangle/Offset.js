var Offset = function (triangle, x, y)
{
    triangle.x1 += x;
    triangle.y1 += y;

    triangle.x2 += x;
    triangle.y2 += y;

    triangle.x3 += x;
    triangle.y3 += y;

    return triangle;
};

module.exports = Offset;
