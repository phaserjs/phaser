/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Rectangle = require('../rectangle/Rectangle');

/**
 * Calculates the bounding AABB rectangle of a polygon.
 *
 * @function Phaser.Geom.Polygon.GetAABB
 * @since 3.0.0
 *
 * @generic {Phaser.Geom.Rectangle} O - [out,$return]
 *
 * @param {Phaser.Geom.Polygon} polygon - The polygon that should be calculated.
 * @param {(Phaser.Geom.Rectangle|object)} [out] - The rectangle or object that has x, y, width, and height properties to store the result. Optional.
 *
 * @return {(Phaser.Geom.Rectangle|object)} The resulting rectangle or object that is passed in with position and dimensions of the polygon's AABB.
 */
var GetAABB = function (polygon, out)
{
    if (out === undefined) { out = new Rectangle(); }

    var minX = Infinity;
    var minY = Infinity;
    var maxX = -minX;
    var maxY = -minY;
    var p;

    for (var i = 0; i < polygon.points.length; i++)
    {
        p = polygon.points[i];

        minX = Math.min(minX, p.x);
        minY = Math.min(minY, p.y);
        maxX = Math.max(maxX, p.x);
        maxY = Math.max(maxY, p.y);
    }

    out.x = minX;
    out.y = minY;
    out.width = maxX - minX;
    out.height = maxY - minY;

    return out;
};

module.exports = GetAABB;
