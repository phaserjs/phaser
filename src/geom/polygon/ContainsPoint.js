/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2013-2023 Photon Storm Ltd.
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
 * @param {Phaser.Geom.Point} point - The Point to check if it's within the Polygon.
 *
 * @return {boolean} `true` if the Point is within the Polygon, otherwise `false`.
 */
var ContainsPoint = function (polygon, point)
{
    return Contains(polygon, point.x, point.y);
};

module.exports = ContainsPoint;
