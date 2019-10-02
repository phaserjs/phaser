/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Contains = require('./Contains');

/**
 * [description]
 *
 * @function Phaser.Geom.Polygon.ContainsPoint
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Polygon} polygon - [description]
 * @param {Phaser.Geom.Point} point - [description]
 *
 * @return {boolean} [description]
 */
var ContainsPoint = function (polygon, point)
{
    return Contains(polygon, point.x, point.y);
};

module.exports = ContainsPoint;
