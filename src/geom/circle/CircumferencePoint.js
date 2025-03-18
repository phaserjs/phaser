/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Vector2 = require('../../math/Vector2');

/**
 * Returns a Vector2 object containing the coordinates of a point on the circumference of the Circle based on the given angle.
 *
 * @function Phaser.Geom.Circle.CircumferencePoint
 * @since 3.0.0
 *
 * @generic {Phaser.Math.Vector2} O - [out,$return]
 *
 * @param {Phaser.Geom.Circle} circle - The Circle to get the circumference point on.
 * @param {number} angle - The angle from the center of the Circle to the circumference to return the point from. Given in radians.
 * @param {Phaser.Math.Vector2} [out] - A Vector2 to store the results in. If not given a Point will be created.
 *
 * @return {Phaser.Math.Vector2} A Vector2 object where the `x` and `y` properties are the point on the circumference.
 */
var CircumferencePoint = function (circle, angle, out)
{
    if (out === undefined) { out = new Vector2(); }

    out.x = circle.x + (circle.radius * Math.cos(angle));
    out.y = circle.y + (circle.radius * Math.sin(angle));

    return out;
};

module.exports = CircumferencePoint;
