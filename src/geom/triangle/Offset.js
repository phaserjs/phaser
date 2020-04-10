/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Moves each point (vertex) of a Triangle by a given offset, thus moving the entire Triangle by that offset.
 *
 * @function Phaser.Geom.Triangle.Offset
 * @since 3.0.0
 *
 * @generic {Phaser.Geom.Triangle} O - [triangle,$return]
 *
 * @param {Phaser.Geom.Triangle} triangle - The Triangle to move.
 * @param {number} x - The horizontal offset (distance) by which to move each point. Can be positive or negative.
 * @param {number} y - The vertical offset (distance) by which to move each point. Can be positive or negative.
 *
 * @return {Phaser.Geom.Triangle} The modified Triangle.
 */
var Offset = function (triangle, x, y)
{
    triangle.x1 += x;
    triangle.y1 += y;

    triangle.x2 += x;
    triangle.y2 += y;

    triangle.x3 += x;
    triangle.y3 += y;

    return triangle;
};

module.exports = Offset;
