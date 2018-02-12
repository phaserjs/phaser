/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * [description]
 *
 * @function Phaser.Geom.Triangle.Offset
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Triangle} triangle - [description]
 * @param {number} x - [description]
 * @param {number} y - [description]
 *
 * @return {Phaser.Geom.Triangle} [description]
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
