/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Triangle = require('./Triangle');

//  Builds a right triangle, with one 90 degree angle and two acute angles
//  The x/y is the coordinate of the 90 degree angle (and will map to x1/y1 in the resulting Triangle)
//  w/h can be positive or negative and represent the length of each side

/**
 * [description]
 *
 * @function Phaser.Geom.Triangle.BuildRight
 * @since 3.0.0
 *
 * @param {number} x - [description]
 * @param {number} y - [description]
 * @param {number} width - [description]
 * @param {number} height - [description]
 *
 * @return {Phaser.Geom.Triangle} [description]
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
