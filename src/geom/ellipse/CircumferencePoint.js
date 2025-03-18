/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Vector2 = require('../../math/Vector2');

/**
 * Returns a Vector2 containing the coordinates of a point on the circumference of the Ellipse based on the given angle.
 *
 * @function Phaser.Geom.Ellipse.CircumferencePoint
 * @since 3.0.0
 *
 * @generic {Phaser.Math.Vector2} O - [out,$return]
 *
 * @param {Phaser.Geom.Ellipse} ellipse - The Ellipse to get the circumference point on.
 * @param {number} angle - The angle from the center of the Ellipse to the circumference to return the point from. Given in radians.
 * @param {Phaser.Math.Vector2} [out] - A Vector2 to store the results in. If not given a Point will be created.
 *
 * @return {Phaser.Math.Vector2} A Vector2 object where the `x` and `y` properties are the point on the circumference.
 */
var CircumferencePoint = function (ellipse, angle, out)
{
    if (out === undefined) { out = new Vector2(); }

    var halfWidth = ellipse.width / 2;
    var halfHeight = ellipse.height / 2;

    out.x = ellipse.x + halfWidth * Math.cos(angle);
    out.y = ellipse.y + halfHeight * Math.sin(angle);

    return out;
};

module.exports = CircumferencePoint;
