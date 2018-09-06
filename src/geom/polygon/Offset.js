/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * [description]
 *
 * @function Phaser.Geom.Polygon.Offset
 * @since 3.13.0
 *
 * @generic {Phaser.Geom.Polygon} O - [rect,$return]
 *
 * @param {Phaser.Geom.Polygon} polygon - [description]
 * @param {number} x - [description]
 * @param {number} y - [description]
 *
 * @return {Phaser.Geom.Polygon} [description]
 */
var Offset = function (polygon, x, y)
{
    var points = polygon.points;

    for (var i = 0; i < points.length; i++)
    {
        var point = points[i];
        point.x += x;
        point.y += y;
    }

    return polygon;
};

module.exports = Offset;
