/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Offset = require('./Offset');

/**
 * [description]
 *
 * @function Phaser.Geom.Polygon.OffsetPoint
 * @since 3.13.0
 *
 * @generic {Phaser.Geom.Polygon} O - [polygon,$return]
 *
 * @param {Phaser.Geom.Polygon} polygon - [description]
 * @param {Phaser.Geom.Point} point - [description]
 *
 * @return {Phaser.Geom.Polygon} [description]
 */
var OffsetPoint = function (polygon, point)
{
    return Offset(polygon, point.x, point.y);
};

module.exports = OffsetPoint;
