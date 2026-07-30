/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Translates the top-left corner of a Rectangle by the coordinates of a translation vector.
 *
 * @function Phaser.Geom.Rectangle.OffsetPoint
 * @since 3.0.0
 *
 * @generic {Phaser.Geom.Rectangle} O - [rect,$return]
 *
 * @param {Phaser.Geom.Rectangle} rect - The Rectangle to adjust.
 * @param {Phaser.Math.Vector2} vec - The Vector2 point whose coordinates should be used as an offset.
 *
 * @return {Phaser.Geom.Rectangle} The adjusted Rectangle.
 */
var OffsetPoint = function (rect, vec)
{
    rect.x += vec.x;
    rect.y += vec.y;

    return rect;
};

module.exports = OffsetPoint;
