/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2022 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Rounds a Rectangle's position and size up to the smallest integer greater than or equal to each respective value.
 *
 * @function Phaser.Geom.Rectangle.CeilAll
 * @since 3.0.0
 *
 * @generic {Phaser.Geom.Rectangle} O - [rect,$return]
 *
 * @param {Phaser.Geom.Rectangle} rect - The Rectangle to modify.
 *
 * @return {Phaser.Geom.Rectangle} The modified Rectangle.
 */
var CeilAll = function (rect)
{
    rect.x = Math.ceil(rect.x);
    rect.y = Math.ceil(rect.y);
    rect.width = Math.ceil(rect.width);
    rect.height = Math.ceil(rect.height);

    return rect;
};

module.exports = CeilAll;
