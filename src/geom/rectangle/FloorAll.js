/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Rounds a Rectangle's position and size down to the largest integer less than or equal to each current coordinate or dimension.
 *
 * @function Phaser.Geom.Rectangle.FloorAll
 * @since 3.0.0
 *
 * @generic {Phaser.Geom.Rectangle} O - [rect,$return]
 *
 * @param {Phaser.Geom.Rectangle} rect - The Rectangle to adjust.
 *
 * @return {Phaser.Geom.Rectangle} The adjusted Rectangle.
 */
var FloorAll = function (rect)
{
    rect.x = Math.floor(rect.x);
    rect.y = Math.floor(rect.y);
    rect.width = Math.floor(rect.width);
    rect.height = Math.floor(rect.height);

    return rect;
};

module.exports = FloorAll;
