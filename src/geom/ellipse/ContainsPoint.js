/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Contains = require('./Contains');

/**
 * Check to see if the Ellipse contains the given x and y coordinates as stored in the Vector2.
 *
 * @function Phaser.Geom.Ellipse.ContainsPoint
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Ellipse} ellipse - The Ellipse to check.
 * @param {Phaser.Math.Vector2} vec - The Vector2 object to check if its coordinates are within the Ellipse or not.
 *
 * @return {boolean} True if the Vector2 coordinates are within the ellipse, otherwise false.
 */
var ContainsPoint = function (ellipse, vec)
{
    return Contains(ellipse, vec.x, vec.y);
};

module.exports = ContainsPoint;
