/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Merges a Rectangle with a point by repositioning and/or resizing it so that the point is on or within its bounds.
 *
 * @function Phaser.Geom.Rectangle.MergeXY
 * @since 3.0.0
 *
 * @generic {Phaser.Geom.Rectangle} O - [target,$return]
 *
 * @param {Phaser.Geom.Rectangle} target - The Rectangle which should be merged and modified.
 * @param {number} x - The X coordinate of the point which should be merged.
 * @param {number} y - The Y coordinate of the point which should be merged.
 *
 * @return {Phaser.Geom.Rectangle} The modified `target` Rectangle.
 */
var MergeXY = function (target, x, y)
{
    var minX = Math.min(target.x, x);
    var maxX = Math.max(target.right, x);

    target.x = minX;
    target.width = maxX - minX;

    var minY = Math.min(target.y, y);
    var maxY = Math.max(target.bottom, y);

    target.y = minY;
    target.height = maxY - minY;

    return target;
};

module.exports = MergeXY;
