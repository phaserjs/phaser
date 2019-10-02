/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Nudges (translates) the top left corner of a Rectangle by a given offset.
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
