/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
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
 * [description]
 *
 * @function Phaser.Geom.Triangle.InCenter
 * @since 3.0.0
 *
 * @generic {Phaser.Geom.Point} O - [out,$return]
 *
 * @param {Phaser.Geom.Triangle} triangle - [description]
 * @param {Phaser.Geom.Point} [out] - [description]
 *
 * @return {Phaser.Geom.Point} [description]
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
