/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var LineToCircle = require('./LineToCircle');

/**
 * Checks if a Triangle and a Circle intersect.
 *
 * A Circle intersects a Triangle if its center is located within it or if any of the Triangle's sides intersect the Circle. As such, the Triangle and the Circle are considered "solid" for the intersection.
 *
 * @function Phaser.Geom.Intersects.TriangleToCircle
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Triangle} triangle - The Triangle to check for intersection.
 * @param {Phaser.Geom.Circle} circle - The Circle to check for intersection.
 * @param {array} [out] - An array in which to optionally store the points of intersection.
 *
 * @return {boolean} `true` if the Triangle and the `Circle` intersect, otherwise `false`.
 */
var TriangleToCircle = function (triangle, circle, out)
{
    if (out === undefined) { out = []; }

    if (triangle.left > circle.right ||
        triangle.right < circle.left ||
        triangle.top > circle.bottom ||
        triangle.bottom < circle.top)
    {
        return false;
    }

    var oriLength = out.length;

    var lineA = triangle.getLineA();
    var lineB = triangle.getLineB();
    var lineC = triangle.getLineC();

    var output = [ [], [], [] ];

    var res = [
        LineToCircle(lineA, circle, output[0]),
        LineToCircle(lineB, circle, output[1]),
        LineToCircle(lineC, circle, output[2])
    ];

    for (var i = 0; i < 3; i++)
    {
        if (res[i] && output !== []) { out.concat(output[i]); }
    }

    if (out.length - oriLength > 0) { return true; }
    else if (res[0] || res[1] || res[2]) { return true; }
    else { return false; }
};

module.exports = TriangleToCircle;
