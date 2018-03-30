/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

//  Merges source rectangle into target rectangle and returns target
//  Neither rect should have negative widths or heights

/**
 * [description]
 *
 * @function Phaser.Geom.Rectangle.MergeRect
 * @since 3.0.0
 *
 * @generic {Phaser.Geom.Rectangle} O - [target,$return]
 *
 * @param {Phaser.Geom.Rectangle} target - [description]
 * @param {Phaser.Geom.Rectangle} source - [description]
 *
 * @return {Phaser.Geom.Rectangle} [description]
 */
var MergeRect = function (target, source)
{
    var minX = Math.min(target.x, source.x);
    var maxX = Math.max(target.right, source.right);

    target.x = minX;
    target.width = maxX - minX;

    var minY = Math.min(target.y, source.y);
    var maxY = Math.max(target.bottom, source.bottom);

    target.y = minY;
    target.height = maxY - minY;

    return target;
};

module.exports = MergeRect;
