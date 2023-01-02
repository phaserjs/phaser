/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2013-2023 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Circle = require('../circle/Circle');

//  Adapted from https://gist.github.com/mutoo/5617691

/**
 * Finds the circumscribed circle (circumcircle) of a Triangle object. The circumcircle is the circle which touches all of the triangle's vertices.
 *
 * @function Phaser.Geom.Triangle.CircumCircle
 * @since 3.0.0
 *
 * @generic {Phaser.Geom.Circle} O - [out,$return]
 *
 * @param {Phaser.Geom.Triangle} triangle - The Triangle to use as input.
 * @param {Phaser.Geom.Circle} [out] - An optional Circle to store the result in.
 *
 * @return {Phaser.Geom.Circle} The updated `out` Circle, or a new Circle if none was provided.
 */
var CircumCircle = function (triangle, out)
{
    if (out === undefined) { out = new Circle(); }

    //  A
    var x1 = triangle.x1;
    var y1 = triangle.y1;

    //  B
    var x2 = triangle.x2;
    var y2 = triangle.y2;

    //  C
    var x3 = triangle.x3;
    var y3 = triangle.y3;

    var A = x2 - x1;
    var B = y2 - y1;
    var C = x3 - x1;
    var D = y3 - y1;
    var E = A * (x1 + x2) + B * (y1 + y2);
    var F = C * (x1 + x3) + D * (y1 + y3);
    var G = 2 * (A * (y3 - y2) - B * (x3 - x2));

    var dx;
    var dy;

    //  If the points of the triangle are collinear, then just find the
    //  extremes and use the midpoint as the center of the circumcircle.

    if (Math.abs(G) < 0.000001)
    {
        var minX = Math.min(x1, x2, x3);
        var minY = Math.min(y1, y2, y3);
        dx = (Math.max(x1, x2, x3) - minX) * 0.5;
        dy = (Math.max(y1, y2, y3) - minY) * 0.5;

        out.x = minX + dx;
        out.y = minY + dy;
        out.radius = Math.sqrt(dx * dx + dy * dy);
    }
    else
    {
        out.x = (D * E - B * F) / G;
        out.y = (A * F - C * E) / G;
        dx = out.x - x1;
        dy = out.y - y1;
        out.radius = Math.sqrt(dx * dx + dy * dy);
    }

    return out;
};

module.exports = CircumCircle;
