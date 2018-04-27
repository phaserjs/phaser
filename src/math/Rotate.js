/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * Rotate a given point by a given angle around the origin (0, 0), in an anti-clockwise direction.
 *
 * @function Phaser.Math.Rotate
 * @since 3.0.0
 *
 * @param {(Phaser.Geom.Point|object)} point - The point to be rotated.
 * @param {number} angle - The angle to be rotated by in an anticlockwise direction.
 *
 * @return {Phaser.Geom.Point} The given point, rotated by the given angle in an anticlockwise direction.
 */
var Rotate = function (point, angle)
{
    var x = point.x;
    var y = point.y;

    point.x = (x * Math.cos(angle)) - (y * Math.sin(angle));
    point.y = (x * Math.sin(angle)) + (y * Math.cos(angle));

    return point;
};

module.exports = Rotate;
