/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Returns true if two triangles have the same coordinates.
 *
 * @function Phaser.Geom.Triangle.Equals
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Triangle} triangle - The first triangle to check.
 * @param {Phaser.Geom.Triangle} toCompare - The second triangle to check.
 *
 * @return {boolean} `true` if the two given triangles have the exact same coordinates, otherwise `false`.
 */
var Equals = function (triangle, toCompare)
{
    return (
        triangle.x1 === toCompare.x1 &&
        triangle.y1 === toCompare.y1 &&
        triangle.x2 === toCompare.x2 &&
        triangle.y2 === toCompare.y2 &&
        triangle.x3 === toCompare.x3 &&
        triangle.y3 === toCompare.y3
    );
};

module.exports = Equals;
