/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * Merges a Rectangle with a list of points by repositioning and/or resizing it such that all points are located on or within its bounds.
 *
 * @function Phaser.Geom.Rectangle.MergePoints
 * @since 3.0.0
 *
 * @generic {Phaser.Geom.Rectangle} O - [target,$return]
 *
 * @param {Phaser.Geom.Rectangle} target - The Rectangle which should be merged.
 * @param {Phaser.Geom.Point[]} points - An array of Points (or any object with public `x` and `y` properties) which should be merged with the Rectangle.
 *
 * @return {Phaser.Geom.Rectangle} The modified Rectangle.
 */
var MergePoints = function (target, points)
{
    var minX = target.x;
    var maxX = target.right;
    var minY = target.y;
    var maxY = target.bottom;

    for (var i = 0; i < points.length; i++)
    {
        minX = Math.min(minX, points[i].x);
        maxX = Math.max(maxX, points[i].x);
        minY = Math.min(minY, points[i].y);
        maxY = Math.max(maxY, points[i].y);
    }

    target.x = minX;
    target.y = minY;
    target.width = maxX - minX;
    target.height = maxY - minY;

    return target;
};

module.exports = MergePoints;
