/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Contains = require('./Contains');

/**
 * Check to see if the Circle contains the given x and y coordinates as stored in the Vector2.
 *
 * @function Phaser.Geom.Circle.ContainsPoint
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Circle} circle - The Circle to check.
 * @param {Phaser.Math.Vector2} vec - The Vector2 object to check if its coordinates are within the Circle or not.
 *
 * @return {boolean} True if the Vector2 coordinates are within the circle, otherwise false.
 */
var ContainsPoint = function (circle, vec)
{
    return Contains(circle, vec.x, vec.y);
};

module.exports = ContainsPoint;
