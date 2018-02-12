/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

//  Merges the target Rectangle with a list of points.
//  The points is an array of objects with public x/y properties.

/**
 * [description]
 *
 * @function Phaser.Geom.Rectangle.MergePoints
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Rectangle} target - [description]
 * @param {Phaser.Geom.Point[]} points - [description]
 *
 * @return {Phaser.Geom.Rectangle} [description]
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
