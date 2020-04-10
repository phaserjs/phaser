/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Point = require('../point/Point');

// The three angle bisectors of a triangle meet in one point called the incenter.
// It is the center of the incircle, the circle inscribed in the triangle.

function getLength (x1, y1, x2, y2)
{
    var x = x1 - x2;
    var y = y1 - y2;
    var magnitude = (x * x) + (y * y);

    return Math.sqrt(magnitude);
}

/**
 * Calculates the position of the incenter of a Triangle object. This is the point where its three angle bisectors meet and it's also the center of the incircle, which is the circle inscribed in the triangle.
 *
 * @function Phaser.Geom.Triangle.InCenter
 * @since 3.0.0
 *
 * @generic {Phaser.Geom.Point} O - [out,$return]
 *
 * @param {Phaser.Geom.Triangle} triangle - The Triangle to find the incenter of.
 * @param {Phaser.Geom.Point} [out] - An optional Point in which to store the coordinates.
 *
 * @return {Phaser.Geom.Point} Point (x, y) of the center pixel of the triangle.
 */
var InCenter = function (triangle, out)
{
    if (out === undefined) { out = new Point(); }

    var x1 = triangle.x1;
    var y1 = triangle.y1;

    var x2 = triangle.x2;
    var y2 = triangle.y2;

    var x3 = triangle.x3;
    var y3 = triangle.y3;

    var d1 = getLength(x3, y3, x2, y2);
    var d2 = getLength(x1, y1, x3, y3);
    var d3 = getLength(x2, y2, x1, y1);

    var p = d1 + d2 + d3;

    out.x = (x1 * d1 + x2 * d2 + x3 * d3) / p;
    out.y = (y1 * d1 + y2 * d2 + y3 * d3) / p;

    return out;
};

module.exports = InCenter;
