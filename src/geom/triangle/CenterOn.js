/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Centroid = require('./Centroid');
var Offset = require('./Offset');

/**
 * [description]
 *
 * @function Phaser.Geom.Triangle.CenterOn
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Triangle} triangle - [description]
 * @param {number} x - [description]
 * @param {number} y - [description]
 * @param {function} [centerFunc] - [description]
 *
 * @return {Phaser.Geom.Triangle} [description]
 */
var CenterOn = function (triangle, x, y, centerFunc)
{
    if (centerFunc === undefined) { centerFunc = Centroid; }

    //  Get the center of the triangle
    var center = centerFunc(triangle);

    //  Difference
    var diffX = x - center.x;
    var diffY = y - center.y;

    return Offset(triangle, diffX, diffY);
};

module.exports = CenterOn;
