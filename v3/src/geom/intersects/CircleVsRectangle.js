var CircleVsRectangle = function (circle, rectangle)
{
    var halfWidth = rectangle.width / 2;
    var halfHeight = rectangle.height / 2;

    var cx = Math.abs(circle.x - rectangle.x - halfWidth);
    var xDist = halfWidth + circle.radius;

    if (cx > xDist)
    {
        return false;
    }

    var cy = Math.abs(circle.y - rectangle.y - halfHeight);
    var yDist = halfHeight + circle.radius;

    if (cy > yDist)
    {
        return false;
    }

    if (cx <= halfWidth || cy <= halfHeight)
    {
        return true;
    }

    var xCornerDist = cx - halfWidth;
    var yCornerDist = cy - halfHeight;
    var xCornerDistSq = xCornerDist * xCornerDist;
    var yCornerDistSq = yCornerDist * yCornerDist;
    var maxCornerDistSq = circle.radius * circle.radius;

    return xCornerDistSq + yCornerDistSq <= maxCornerDistSq;
};

module.exports = CircleVsRectangle;
