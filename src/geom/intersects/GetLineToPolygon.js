/**
 * @author       Richard Davey
 * @copyright    2022 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Vector3 = require('../../math/Vector3');
var Vector4 = require('../../math/Vector4');
var GetLineToPoints = require('./GetLineToPoints');

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
 * @since 3.50.0
 *
 * @param {Phaser.Geom.Line} line - The line segment, or ray, to check. If a ray, set the `isRay` parameter to `true`.
 * @param {Phaser.Geom.Polygon | Phaser.Geom.Polygon[]} polygons - A single polygon, or array of polygons, to check.
 * @param {boolean} [isRay=false] - Is `line` a ray or a line segment?
 * @param {Phaser.Math.Vector4} [out] - A Vector4 to store the intersection results in.
 *
 * @return {Phaser.Math.Vector4} A Vector4 containing the intersection results, or `null`.
 */
var GetLineToPolygon = function (line, polygons, isRay, out)
{
    if (out === undefined) { out = new Vector4(); }

    if (!Array.isArray(polygons))
    {
        polygons = [ polygons ];
    }

    var closestIntersect = false;

    //  Reset our vec4s
    out.set();
    tempIntersect.set();

    for (var i = 0; i < polygons.length; i++)
    {
        if (GetLineToPoints(line, polygons[i].points, isRay, tempIntersect))
        {
            if (!closestIntersect || tempIntersect.z < out.z)
            {
                out.set(tempIntersect.x, tempIntersect.y, tempIntersect.z, i);

                closestIntersect = true;
            }
        }
    }

    return (closestIntersect) ? out : null;
};

module.exports = GetLineToPolygon;
