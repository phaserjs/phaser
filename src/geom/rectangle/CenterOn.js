/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

// Centers this Rectangle so that the center coordinates match the given x and y values.

/**
 * Moves the top-left corner of a Rectangle so that its center is at the given coordinates.
 *
 * @function Phaser.Geom.Rectangle.CenterOn
 * @since 3.0.0
 *
 * @generic {Phaser.Geom.Rectangle} O - [rect,$return]
 *
 * @param {Phaser.Geom.Rectangle} rect - The Rectangle to be centered.
 * @param {number} x - The X coordinate of the Rectangle's center.
 * @param {number} y - The Y coordinate of the Rectangle's center.
 *
 * @return {Phaser.Geom.Rectangle} The centered rectangle.
 */
var CenterOn = function (rect, x, y)
{
    rect.x = x - (rect.width / 2);
    rect.y = y - (rect.height / 2);

    return rect;
};

module.exports = CenterOn;
