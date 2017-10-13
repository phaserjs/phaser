/**
 * [description]
 *
 * @function Phaser.Geom.Intersects.CircleToRectangle
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Circle} circle - [description]
 * @param {Phaser.Geom.Rectangle} rect - [description]
 *
 * @return {boolean} [description]
 */
var CircleToRectangle = function (circle, rect)
{
    var halfWidth = rect.width / 2;
    var halfHeight = rect.height / 2;

    var cx = Math.abs(circle.x - rect.x - halfWidth);
    var xDist = halfWidth + circle.radius;

    if (cx <= halfWidth || cx > xDist)
    {
        return false;
    }

    var cy = Math.abs(circle.y - rect.y - halfHeight);
    var yDist = halfHeight + circle.radius;

    if (cy <= halfHeight || cy > yDist)
    {
        return false;
    }

    var xCornerDist = cx - halfWidth;
    var yCornerDist = cy - halfHeight;
    var xCornerDistSq = xCornerDist * xCornerDist;
    var yCornerDistSq = yCornerDist * yCornerDist;
    var maxCornerDistSq = circle.radius * circle.radius;

    return (xCornerDistSq + yCornerDistSq <= maxCornerDistSq);
};

module.exports = CircleToRectangle;
