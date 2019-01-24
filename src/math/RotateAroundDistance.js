/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * Rotate a `point` around `x` and `y` by the given `angle` and `distance`.
 *
 * @function Phaser.Math.RotateAroundDistance
 * @since 3.0.0
 *
 * @param {(Phaser.Geom.Point|object)} point - The point to be rotated.
 * @param {number} x - The horizontal coordinate to rotate around.
 * @param {number} y - The vertical coordinate to rotate around.
 * @param {number} angle - The angle of rotation in radians.
 * @param {number} distance - The distance from (x, y) to place the point at.
 *
 * @return {Phaser.Geom.Point} The given point.
 */
var RotateAroundDistance = function (point, x, y, angle, distance)
{
    var t = angle + Math.atan2(point.y - y, point.x - x);

    point.x = x + (distance * Math.cos(t));
    point.y = y + (distance * Math.sin(t));

    return point;
};

module.exports = RotateAroundDistance;
