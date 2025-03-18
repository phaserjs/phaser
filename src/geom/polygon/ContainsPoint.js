/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Contains = require('./Contains');

/**
 * Checks the given Point again the Polygon to see if the Point lays within its vertices.
 *
 * @function Phaser.Geom.Polygon.ContainsPoint
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Polygon} polygon - The Polygon to check.
 * @param {Phaser.Math.Vector2} vec - The Vector2 point to check if it's within the Polygon.
 *
 * @return {boolean} `true` if the point is within the Polygon, otherwise `false`.
 */
var ContainsPoint = function (polygon, vec)
{
    return Contains(polygon, vec.x, vec.y);
};

module.exports = ContainsPoint;
