/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2013-2023 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Point = require('../point/Point');

//  The three medians (the lines drawn from the vertices to the bisectors of the opposite sides)
//  meet in the centroid or center of mass (center of gravity).
//  The centroid divides each median in a ratio of 2:1

/**
 * Calculates the position of a Triangle's centroid, which is also its center of mass (center of gravity).
 *
 * The centroid is the point in a Triangle at which its three medians (the lines drawn from the vertices to the bisectors of the opposite sides) meet. It divides each one in a 2:1 ratio.
 *
 * @function Phaser.Geom.Triangle.Centroid
 * @since 3.0.0
 *
 * @generic {Phaser.Geom.Point} O - [out,$return]
 *
 * @param {Phaser.Geom.Triangle} triangle - The Triangle to use.
 * @param {(Phaser.Geom.Point|object)} [out] - An object to store the coordinates in.
 *
 * @return {(Phaser.Geom.Point|object)} The `out` object with modified `x` and `y` properties, or a new Point if none was provided.
 */
var Centroid = function (triangle, out)
{
    if (out === undefined) { out = new Point(); }

    out.x = (triangle.x1 + triangle.x2 + triangle.x3) / 3;
    out.y = (triangle.y1 + triangle.y2 + triangle.y3) / 3;

    return out;
};

module.exports = Centroid;
