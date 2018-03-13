/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * [description]
 *
 * @function Phaser.Geom.Rectangle.MergeXY
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Rectangle} target - [description]
 * @param {number} x - [description]
 * @param {number} y - [description]
 *
 * @return {Phaser.Geom.Rectangle} [description]
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
