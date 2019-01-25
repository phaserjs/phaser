/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * Offsets the Polygon by the values given.
 *
 * @function Phaser.Geom.Polygon.Offset
 * @since 3.16.0
 *
 * @generic {Phaser.Geom.Polygon} O - [polygon,$return]
 *
 * @param {Phaser.Geom.Polygon} polygon - The Polygon to be offset (translated.)
 * @param {number} x - The amount to horizontally offset the Polygon by.
 * @param {number} y - The amount to vertically offset the Polygon by.
 *
 * @return {Phaser.Geom.Polygon} The Polygon that was offset.
 */
var Offset = function (polygon, x, y)
{
    var points = polygon.points;
    for (var i = 0; i < points.length; i++)
    {
        points[i].x += x;
        points[i].y += y;
    }
    return polygon;
};

module.exports = Offset;
