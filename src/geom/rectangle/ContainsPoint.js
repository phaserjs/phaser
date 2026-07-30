/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Contains = require('./Contains');

/**
 * Determines whether the specified point is contained within the rectangular region defined by this Rectangle object.
 *
 * @function Phaser.Geom.Rectangle.ContainsPoint
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Rectangle} rect - The Rectangle object.
 * @param {Phaser.Math.Vector2} vec - The Vector2 object to check the coordinates of.
 *
 * @return {boolean} A value of true if the Rectangle object contains the specified point, otherwise false.
 */
var ContainsPoint = function (rect, vec)
{
    return Contains(rect, vec.x, vec.y);
};

module.exports = ContainsPoint;
