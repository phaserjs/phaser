/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Contains = require('./Contains');

/**
 * Check to see if the Circle contains the given Point object.
 *
 * @function Phaser.Geom.Circle.ContainsPoint
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Circle} circle - The Circle to check.
 * @param {(Phaser.Geom.Point|object)} point - The Point object to check if it's within the Circle or not.
 *
 * @return {boolean} True if the Point coordinates are within the circle, otherwise false.
 */
var ContainsPoint = function (circle, point)
{
    return Contains(circle, point.x, point.y);
};

module.exports = ContainsPoint;
