/**
 * @author       Richard Davey
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Vector3 = require('../../math/Vector3');
var Vector4 = require('../../math/Vector4');
var GetLineToLine = require('./GetLineToLine');
var Line = require('../line/Line');

//  Temp calculation segment
var segment = new Line();

//  Temp vec3
var tempIntersect = new Vector3();

/**
 * Checks for the closest point of intersection between a line segment and an array of polygons.
 *
 * If no intersection is found, this function returns `null`.
 *
 * If intersection was found, a Vector4 is returned with the following properties:
 *
 * The `x` and `y` components contain the point of the intersection.
 * The `z` component contains the closest distance.
 * The `w` component contains the index of the polygon, in the given array, that triggered the intersection.
 *
 * @function Phaser.Geom.Intersects.GetLineToPolygon
 * @since 3.25.0
 *
 * @param {Phaser.Geom.Line} line - The line segment to check.
 * @param {Phaser.Geom.Polygon | Phaser.Geom.Polygon[]} polygons - A single polygon, or array of polygons, to check.
 * @param {Phaser.Math.Vector4} [out] - A Vector4 to store the intersection results in.
 *
 * @return {Phaser.Math.Vector4} A Vector4 containing the intersection results, or `null`.
 */
var GetLineToPolygon = function (line, polygons, out)
{
    if (out === undefined)
    {
        out = new Vector4();
    }

    if (!Array.isArray(polygons))
    {
        polygons = [ polygons ];
    }

    var closestIntersect = false;

    //  Reset our temporary vec4
    tempIntersect.set();

    for (var p = 0; p < polygons.length; p++)
    {
        var points = polygons[p].points;

        var prev = points[0];

        for (var i = 1; i < points.length; i++)
        {
            var current = points[i];

            segment.setTo(prev.x, prev.y, current.x, current.y);

            prev = current;

            if (!GetLineToLine(line, segment, tempIntersect))
            {
                //  No intersection? Carry on ...
                continue;
            }

            if (!closestIntersect || tempIntersect.z < out.z)
            {
                out.set(tempIntersect.x, tempIntersect.y, tempIntersect.z, p);

                closestIntersect = true;
            }
        }
    }

    return (closestIntersect) ? out : null;
};

module.exports = GetLineToPolygon;
