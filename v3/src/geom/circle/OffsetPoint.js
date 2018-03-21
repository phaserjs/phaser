var OffsetPoint = function (circle, point)
{
    circle.x += point.x;
    circle.y += point.y;

    return circle;
};

module.exports = OffsetPoint;
