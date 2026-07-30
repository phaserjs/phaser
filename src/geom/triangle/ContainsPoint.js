/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Contains = require('./Contains');

/**
 * Tests if a triangle contains a point.
 *
 * @function Phaser.Geom.Triangle.ContainsPoint
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Triangle} triangle - The triangle.
 * @param {Phaser.Math.Vector2} vec - The Vector2 point to test if it's within the triangle.
 *
 * @return {boolean} `true` if the point is within the triangle, otherwise `false`.
 */
var ContainsPoint = function (triangle, vec)
{
    return Contains(triangle, vec.x, vec.y);
};

module.exports = ContainsPoint;
