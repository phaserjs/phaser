/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Triangle = require('./Triangle');

//  Builds a right triangle, with one 90 degree angle and two acute angles
//  The x/y is the coordinate of the 90 degree angle (and will map to x1/y1 in the resulting Triangle)
//  w/h can be positive or negative and represent the length of each side

/**
 * Builds a right triangle, i.e. one which has a 90-degree angle and two acute angles.
 *
 * @function Phaser.Geom.Triangle.BuildRight
 * @since 3.0.0
 *
 * @param {number} x - The X coordinate of the right angle, which will also be the first X coordinate of the constructed Triangle.
 * @param {number} y - The Y coordinate of the right angle, which will also be the first Y coordinate of the constructed Triangle.
 * @param {number} width - The length of the side which is to the left or to the right of the right angle.
 * @param {number} height - The length of the side which is above or below the right angle.
 *
 * @return {Phaser.Geom.Triangle} The constructed right Triangle.
 */
var BuildRight = function (x, y, width, height)
{
    if (height === undefined) { height = width; }

    //  90 degree angle
    var x1 = x;
    var y1 = y;

    var x2 = x;
    var y2 = y - height;

    var x3 = x + width;
    var y3 = y;

    return new Triangle(x1, y1, x2, y2, x3, y3);
};

module.exports = BuildRight;
