/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * [description]
 *
 * @function Phaser.Math.RotateAround
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Point|object} point - [description]
 * @param {number} x - [description]
 * @param {number} y - [description]
 * @param {number} angle - [description]
 *
 * @return {Phaser.Geom.Point} [description]
 */
var RotateAround = function (point, x, y, angle)
{
    var c = Math.cos(angle);
    var s = Math.sin(angle);

    var tx = point.x - x;
    var ty = point.y - y;

    point.x = tx * c - ty * s + x;
    point.y = tx * s + ty * c + y;

    return point;
};

module.exports = RotateAround;
