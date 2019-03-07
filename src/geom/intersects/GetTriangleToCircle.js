/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var GetLineToCircle = require('./GetLineToCircle');
var TriangleToCircle = require('./TriangleToCircle');

/**
 * Checks if a Triangle and a Circle intersect, and returns the intersection points as a Point object array.
 *
 * A Circle intersects a Triangle if its center is located within it or if any of the Triangle's sides intersect the Circle. As such, the Triangle and the Circle are considered "solid" for the intersection.
 *
 * @function Phaser.Geom.Intersects.GetTriangleToCircle
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Triangle} triangle - The Triangle to check for intersection.
 * @param {Phaser.Geom.Circle} circle - The Circle to check for intersection.
 * @param {array} [out] - An optional array in which to store the points of intersection.
 *
 * @return {array} An array with the points of intersection if objects intersect, otherwise an empty array.
 */
var GetTriangleToCircle = function (triangle, circle, out)
{
    if (out === undefined) { out = []; }

    if (TriangleToCircle(triangle, circle))
    {
        var lineA = triangle.getLineA();
        var lineB = triangle.getLineB();
        var lineC = triangle.getLineC();

        var output = [ [], [], [] ];

        var result = [
            GetLineToCircle(lineA, circle, output[0]),
            GetLineToCircle(lineB, circle, output[1]),
            GetLineToCircle(lineC, circle, output[2])
        ];

        for (var i = 0; i < 3; i++)
        {
            if (result[i] && output !== []) { out.concat(output[i]); }
        }
    }

    return out;
};

module.exports = GetTriangleToCircle;
