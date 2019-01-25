/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Offset = require('./Offset');

/**
 * Offsets the Polygon by the values given in the `x` and `y` properties of the Point object.
 *
 * @function Phaser.Geom.Polygon.OffsetPoint
 * @since 3.16.0
 *
 * @generic {Phaser.Geom.Polygon} O - [polygon,$return]
 *
 * @param {Phaser.Geom.Polygon} polygon - The Polygon to be offset (translated.)
 * @param {(Phaser.Geom.Point|object)} point - The Point object containing the values to offset the Polygon by.
 *
 * @return {Phaser.Geom.Polygon} The Polygon that was offset.
 */
var OffsetPoint = function (polygon, point)
{
    return Offset(polygon, point.x, point.y);
};

module.exports = OffsetPoint;
