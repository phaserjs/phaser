/**
 * @author       samme
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Position a `point` at the given `angle` and `distance` to (`x`, `y`).
 *
 * @function Phaser.Math.RotateTo
 * @since 3.24.0
 *
 * @generic {Phaser.Types.Math.Vector2Like} T - [point,$return]
 *
 * @param {Phaser.Types.Math.Vector2Like} point - The point to be positioned.
 * @param {number} x - The horizontal coordinate to position from.
 * @param {number} y - The vertical coordinate to position from.
 * @param {number} angle - The angle of rotation in radians.
 * @param {number} distance - The distance from (x, y) to place the point at.
 *
 * @return {Phaser.Types.Math.Vector2Like} The given point.
 */
var RotateTo = function (point, x, y, angle, distance)
{
    point.x = x + (distance * Math.cos(angle));
    point.y = y + (distance * Math.sin(angle));

    return point;
};

module.exports = RotateTo;
