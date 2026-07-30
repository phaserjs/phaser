/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Translates a Rectangle by the given horizontal and vertical amounts, moving its position while preserving its size.
 *
 * @function Phaser.Geom.Rectangle.Offset
 * @since 3.0.0
 *
 * @generic {Phaser.Geom.Rectangle} O - [rect,$return]
 *
 * @param {Phaser.Geom.Rectangle} rect - The Rectangle to adjust.
 * @param {number} x - The distance to move the Rectangle horizontally.
 * @param {number} y - The distance to move the Rectangle vertically.
 *
 * @return {Phaser.Geom.Rectangle} The adjusted Rectangle.
 */
var Offset = function (rect, x, y)
{
    rect.x += x;
    rect.y += y;

    return rect;
};

module.exports = Offset;
