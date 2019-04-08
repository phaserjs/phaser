/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Length = require('../line/Length');
var Line = require('../line/Line');

/**
 * Returns the perimeter of the given Polygon.
 *
 * @function Phaser.Geom.Polygon.Perimeter
 * @since 3.12.0
 *
 * @param {Phaser.Geom.Polygon} polygon - The Polygon to get the perimeter of.
 *
 * @return {number} The perimeter of the Polygon.
 */
var Perimeter = function (polygon)
{
    var points = polygon.points;
    var perimeter = 0;

    for (var i = 0; i < points.length; i++)
    {
        var pointA = points[i];
        var pointB = points[(i + 1) % points.length];
        var line = new Line(
            pointA.x,
            pointA.y,
            pointB.x,
            pointB.y
        );

        perimeter += Length(line);
    }

    return perimeter;
};

module.exports = Perimeter;
