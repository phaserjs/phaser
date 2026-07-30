/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Vector2 = require('./Vector2');

/**
 * Get the centroid or geometric center of a plane figure (the arithmetic mean position of all the points in the figure).
 * Informally, it is the point at which a cutout of the shape could be perfectly balanced on the tip of a pin.
 *
 * @function Phaser.Math.GetCentroid
 * @since 4.0.0
 *
 * @generic {Phaser.Math.Vector2} O - [out,$return]
 *
 * @param {Phaser.Types.Math.Vector2Like[]} points - An array of Vector2Like objects to get the geometric center of.
 * @param {Phaser.Math.Vector2} [out] - A Vector2 object to store the output coordinates in. If not given, a new Vector2 instance is created.
 *
 * @return {Phaser.Math.Vector2} A Vector2 object representing the geometric center of the given points.
 */
var GetCentroid = function (points, out)
{
    if (out === undefined) { out = new Vector2(); }

    var len = points.length;

    if (!Array.isArray(points) || len === 0)
    {
        throw new Error('GetCentroid points be a non-empty array');
    }

    if (len === 1)
    {
        out.x = points[0].x;
        out.y = points[0].y;
    }
    else
    {
        for (var i = 0; i < len; i++)
        {
            out.x += points[i].x;
            out.y += points[i].y;
        }

        out.x /= len;
        out.y /= len;
    }

    return out;
};

module.exports = GetCentroid;
