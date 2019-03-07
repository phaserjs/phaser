/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Equals = require('../TriangleToTriangle');
var TriangleToLine = require('./GetTriangleToLine');

/**
 * Checks if two Triangles intersect, and returns the intersection points as a Point object array.
 *
 * A Triangle intersects another Triangle if any pair of their lines intersects or if any point of one Triangle is within the other Triangle. Thus, the Triangles are considered "solid".
 *
 * @function Phaser.Geom.Intersects.GetTriangleToTriangle
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Triangle} triangleA - The first Triangle to check for intersection.
 * @param {Phaser.Geom.Triangle} triangleB - The second Triangle to check for intersection.
 * @param {array} [out] - An optional array in which to store the points of intersection.
 *
 * @return {array} An array with the points of intersection if objects intersect, otherwise an empty array.
 */
var GetTriangleToTriangle = function (triangleA, triangleB, out)
{
    if (out === undefined) { out = []; }

    if (TriangleToTriangle(triangleA, triangleB))
    {
        var lineA = triangleB.getLineA();
        var lineB = triangleB.getLineB();
        var lineC = triangleB.getLineC();

        var output = [ [], [], [] ];

        var result = [
            GetTriangleToLine(triangleA, lineA, output[0]),
            GetTriangleToLine(triangleA, lineB, output[1]),
            GetTriangleToLine(triangleA, lineC, output[2])
        ];

        for (var i = 0; i < 3; i++)
        {
            if (result[i] && output[i] !== []) { out.concat(output[i]); }
        }
    }

    return out;
};

module.exports = GetTriangleToTriangle;
