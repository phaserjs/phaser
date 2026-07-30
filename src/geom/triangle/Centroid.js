/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Vector2 = require('../../math/Vector2');

/**
 * Calculates the position of a Triangle's centroid, which is also its center of mass (center of gravity).
 *
 * The centroid is the point in a Triangle at which its three medians (the lines drawn from the vertices to the bisectors of the opposite sides) meet. It divides each one in a 2:1 ratio.
 *
 * @function Phaser.Geom.Triangle.Centroid
 * @since 3.0.0
 *
 * @generic {Phaser.Math.Vector2} O - [out,$return]
 *
 * @param {Phaser.Geom.Triangle} triangle - The Triangle to use.
 * @param {Phaser.Math.Vector2} [out] - A Vector2 object to store the coordinates in.
 *
 * @return {Phaser.Math.Vector2} The `out` object with modified `x` and `y` properties, or a new Vector2 if none was provided.
 */
var Centroid = function (triangle, out)
{
    if (out === undefined) { out = new Vector2(); }

    out.x = (triangle.x1 + triangle.x2 + triangle.x3) / 3;
    out.y = (triangle.y1 + triangle.y2 + triangle.y3) / 3;

    return out;
};

module.exports = Centroid;
