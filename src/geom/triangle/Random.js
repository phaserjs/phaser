/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Point = require('../point/Point');

/**
 * Returns a random Point from within the area of the given Triangle.
 *
 * @function Phaser.Geom.Triangle.Random
 * @since 3.0.0
 *
 * @generic {Phaser.Geom.Point} O - [out,$return]
 *
 * @param {Phaser.Geom.Triangle} triangle - The Triangle to get a random point from.
 * @param {Phaser.Geom.Point} [out] - The Point object to store the position in. If not given, a new Point instance is created.
 *
 * @return {Phaser.Geom.Point} A Point object holding the coordinates of a random position within the Triangle.
 */
var Random = function (triangle, out)
{
    if (out === undefined) { out = new Point(); }

    //  Basis vectors
    var ux = triangle.x2 - triangle.x1;
    var uy = triangle.y2 - triangle.y1;

    var vx = triangle.x3 - triangle.x1;
    var vy = triangle.y3 - triangle.y1;

    //  Random point within the unit square
    var r = Math.random();
    var s = Math.random();

    //  Point outside the triangle? Remap it.
    if (r + s >= 1)
    {
        r = 1 - r;
        s = 1 - s;
    }

    out.x = triangle.x1 + ((ux * r) + (vx * s));
    out.y = triangle.y1 + ((uy * r) + (vy * s));

    return out;
};

module.exports = Random;
