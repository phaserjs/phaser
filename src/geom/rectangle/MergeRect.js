/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

//  Merges source rectangle into target rectangle and returns target
//  Neither rect should have negative widths or heights

/**
 * Merges the source rectangle into the target rectangle and returns the target.
 * Neither rectangle should have a negative width or height.
 *
 * @function Phaser.Geom.Rectangle.MergeRect
 * @since 3.0.0
 *
 * @generic {Phaser.Geom.Rectangle} O - [target,$return]
 *
 * @param {Phaser.Geom.Rectangle} target - Target rectangle. Will be modified to include source rectangle.
 * @param {Phaser.Geom.Rectangle} source - Rectangle that will be merged into target rectangle.
 *
 * @return {Phaser.Geom.Rectangle} Modified target rectangle that contains source rectangle.
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
