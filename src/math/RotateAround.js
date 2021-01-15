/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Rotate a `point` around `x` and `y` to the given `angle`, at the same distance.
 *
 * In polar notation, this maps a point from (r, t) to (r, angle), vs. the origin (x, y).
 *
 * @function Phaser.Math.RotateAround
 * @since 3.0.0
 *
 * @generic {Phaser.Types.Math.Vector2Like} T - [point,$return]
 *
 * @param {(Phaser.Geom.Point|object)} point - The point to be rotated.
 * @param {number} x - The horizontal coordinate to rotate around.
 * @param {number} y - The vertical coordinate to rotate around.
 * @param {number} angle - The angle of rotation in radians.
 * @param {number} [skewX=0] - The angle of skew in the horizontal direction.
 * @param {number} [skewY=0] - The angle of skew in the vertical direction.
 *
 * @return {Phaser.Types.Math.Vector2Like} The given point.
 */
var RotateAround = function (point, x, y, angle, skewX, skewY)
{
    if (skewX === undefined) { skewX = 0; }
    if (skewY === undefined) { skewY = 0; }


    var tx = point.x - x;
    var ty = point.y - y;

    point.x = tx * Math.cos(angle - skewY) - ty * Math.sin(angle + skewX) + x;
    point.y = tx * Math.sin(angle - skewY) + ty * Math.cos(angle + skewX) + y;

    return point;
};

module.exports = RotateAround;
