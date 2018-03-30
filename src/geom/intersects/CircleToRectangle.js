/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

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
    var cy = Math.abs(circle.y - rect.y - halfHeight);
    var xDist = halfWidth + circle.radius;
    var yDist = halfHeight + circle.radius;

    if (cx > xDist || cy > yDist)
    {
        return false;
    }
    else if (cx <= halfWidth || cy <= halfHeight)
    {
        return true;
    }
    else
    {
        var xCornerDist = cx - halfWidth;
        var yCornerDist = cy - halfHeight;
        var xCornerDistSq = xCornerDist * xCornerDist;
        var yCornerDistSq = yCornerDist * yCornerDist;
        var maxCornerDistSq = circle.radius * circle.radius;

        return (xCornerDistSq + yCornerDistSq <= maxCornerDistSq);
    }
};

module.exports = CircleToRectangle;
