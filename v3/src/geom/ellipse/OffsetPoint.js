var OffsetPoint = function (ellipse, point)
{
    ellipse.x += point.x;
    ellipse.y += point.y;

    return ellipse;
};

module.exports = OffsetPoint;
