/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Rotates an entire Triangle at a given angle about a specific point.
 *
 * @function Phaser.Geom.Triangle.RotateAroundXY
 * @since 3.0.0
 *
 * @generic {Phaser.Geom.Triangle} O - [triangle,$return]
 *
 * @param {Phaser.Geom.Triangle} triangle - The Triangle to rotate.
 * @param {number} x - The X coordinate of the point to rotate the Triangle about.
 * @param {number} y - The Y coordinate of the point to rotate the Triangle about.
 * @param {number} angle - The angle by which to rotate the Triangle, in radians.
 *
 * @return {Phaser.Geom.Triangle} The rotated Triangle.
 */
var RotateAroundXY = function (triangle, x, y, angle)
{
    var c = Math.cos(angle);
    var s = Math.sin(angle);

    var tx = triangle.x1 - x;
    var ty = triangle.y1 - y;

    triangle.x1 = tx * c - ty * s + x;
    triangle.y1 = tx * s + ty * c + y;

    tx = triangle.x2 - x;
    ty = triangle.y2 - y;

    triangle.x2 = tx * c - ty * s + x;
    triangle.y2 = tx * s + ty * c + y;

    tx = triangle.x3 - x;
    ty = triangle.y3 - y;

    triangle.x3 = tx * c - ty * s + x;
    triangle.y3 = tx * s + ty * c + y;

    return triangle;
};

module.exports = RotateAroundXY;
