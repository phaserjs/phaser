/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Contains = require('./Contains');

/**
 * Check to see if the Ellipse contains the given Point object.
 *
 * @function Phaser.Geom.Ellipse.ContainsPoint
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Ellipse} ellipse - The Ellipse to check.
 * @param {(Phaser.Geom.Point|object)} point - The Point object to check if it's within the Circle or not.
 *
 * @return {boolean} True if the Point coordinates are within the circle, otherwise false.
 */
var ContainsPoint = function (ellipse, point)
{
    return Contains(ellipse, point.x, point.y);
};

module.exports = ContainsPoint;
