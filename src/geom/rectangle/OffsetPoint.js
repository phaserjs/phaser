/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Nudges (translates) the top-left corner of a Rectangle by the coordinates of a point (translation vector).
 *
 * @function Phaser.Geom.Rectangle.OffsetPoint
 * @since 3.0.0
 *
 * @generic {Phaser.Geom.Rectangle} O - [rect,$return]
 *
 * @param {Phaser.Geom.Rectangle} rect - The Rectangle to adjust.
 * @param {(Phaser.Geom.Point|Phaser.Math.Vector2)} point - The point whose coordinates should be used as an offset.
 *
 * @return {Phaser.Geom.Rectangle} The adjusted Rectangle.
 */
var OffsetPoint = function (rect, point)
{
    rect.x += point.x;
    rect.y += point.y;

    return rect;
};

module.exports = OffsetPoint;
