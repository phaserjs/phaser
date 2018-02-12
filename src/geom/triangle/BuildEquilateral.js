/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Triangle = require('./Triangle');

// Builds an equilateral triangle.
// In the equilateral triangle, all the sides are the same length (congruent)
// and all the angles are the same size (congruent).

//  The x/y specifies the top-middle of the triangle (x1/y1) and length
//  is the length of each side

/**
 * [description]
 *
 * @function Phaser.Geom.Triangle.BuildEquilateral
 * @since 3.0.0
 *
 * @param {number} x - [description]
 * @param {number} y - [description]
 * @param {number} length - [description]
 *
 * @return {Phaser.Geom.Triangle} [description]
 */
var BuildEquilateral = function (x, y, length)
{
    var height = length * (Math.sqrt(3) / 2);

    var x1 = x;
    var y1 = y;

    var x2 = x + (length / 2);
    var y2 = y + height;

    var x3 = x - (length / 2);
    var y3 = y + height;

    return new Triangle(x1, y1, x2, y2, x3, y3);
};

module.exports = BuildEquilateral;
