/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Equals = require('../triangle/Equals');
var TriangleToLine = require('./TriangleToLine');

/**
 * Checks if two Triangles intersect.
 *
 * A Triangle intersects another Triangle if any pair of their lines intersects or if any point of one Triangle is within the other Triangle. Thus, the Triangles are considered "solid".
 *
 * @function Phaser.Geom.Intersects.TriangleToTriangle
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Triangle} triangleA - The first Triangle to check for intersection.
 * @param {Phaser.Geom.Triangle} triangleB - The second Triangle to check for intersection.
 * @param {array} [out] - An array in which to optionally store the points of intersection.
 *
 * @return {boolean} `true` if the Triangles intersect, otherwise `false`.
 */
var TriangleToTriangle = function (triangleA, triangleB, out)
{
    if (out === undefined) { out = []; }

    if (triangleA.left > triangleB.right ||
        triangleA.right < triangleB.left ||
        triangleA.top > triangleB.bottom ||
        triangleA.bottom < triangleB.top)
    {
        return false;
    }

    if (Equals(triangleA, triangleB)) { return false; }

    var oriLength = out.length;

    var lineA = triangleB.getLineA();
    var lineB = triangleB.getLineB();
    var lineC = triangleB.getLineC();

    var output = [ [], [], [] ];

    var res = [
        TriangleToLine(triangleA, lineA, output[0]),
        TriangleToLine(triangleA, lineB, output[1]),
        TriangleToLine(triangleA, lineC, output[2])
    ];

    for (var i = 0; i < 3; i++)
    {
        if (res[i] && output[i] !== []) { out.concat(output[i]); }
    }

    if (out.length - oriLength > 0) { return true; }
    else if (res[0] || res[1] || res[2]) { return true; }
    else { return false; }
};

module.exports = TriangleToTriangle;
