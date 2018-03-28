/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Point = require('../point/Point');

//  The three medians (the lines drawn from the vertices to the bisectors of the opposite sides)
//  meet in the centroid or center of mass (center of gravity).
//  The centroid divides each median in a ratio of 2:1

/**
 * [description]
 *
 * @function Phaser.Geom.Triangle.Centroid
 * @since 3.0.0
 *
 * @generic {Phaser.Geom.Point} O - [out,$return]
 *
 * @param {Phaser.Geom.Triangle} triangle - [description]
 * @param {(Phaser.Geom.Point|object)} [out] - [description]
 *
 * @return {(Phaser.Geom.Point|object)} [description]
 */
var Centroid = function (triangle, out)
{
    if (out === undefined) { out = new Point(); }

    out.x = (triangle.x1 + triangle.x2 + triangle.x3) / 3;
    out.y = (triangle.y1 + triangle.y2 + triangle.y3) / 3;

    return out;
};

module.exports = Centroid;
