/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

//  http://www.blackpawn.com/texts/pointinpoly/

/**
 * Checks if a point (as a pair of coordinates) is inside a Triangle's bounds.
 *
 * @function Phaser.Geom.Triangle.Contains
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Triangle} triangle - The Triangle to check.
 * @param {number} x - The X coordinate of the point to check.
 * @param {number} y - The Y coordinate of the point to check.
 *
 * @return {boolean} `true` if the point is inside the Triangle, otherwise `false`.
 */
var Contains = function (triangle, x, y)
{
    var v0x = triangle.x3 - triangle.x1;
    var v0y = triangle.y3 - triangle.y1;

    var v1x = triangle.x2 - triangle.x1;
    var v1y = triangle.y2 - triangle.y1;

    var v2x = x - triangle.x1;
    var v2y = y - triangle.y1;

    var dot00 = (v0x * v0x) + (v0y * v0y);
    var dot01 = (v0x * v1x) + (v0y * v1y);
    var dot02 = (v0x * v2x) + (v0y * v2y);
    var dot11 = (v1x * v1x) + (v1y * v1y);
    var dot12 = (v1x * v2x) + (v1y * v2y);

    // Compute barycentric coordinates
    var b = ((dot00 * dot11) - (dot01 * dot01));
    var inv = (b === 0) ? 0 : (1 / b);
    var u = ((dot11 * dot02) - (dot01 * dot12)) * inv;
    var v = ((dot00 * dot12) - (dot01 * dot02)) * inv;

    return (u >= 0 && v >= 0 && (u + v < 1));
};

module.exports = Contains;
