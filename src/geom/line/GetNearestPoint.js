/**
 * @author       Richard Davey <rich@phaser.io>
 * @author       Florian Mertens
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Vector2 = require('../../math/Vector2');

/**
 * Get the nearest point on a line perpendicular to the given point.
 *
 * @function Phaser.Geom.Line.GetNearestPoint
 * @since 3.16.0
 *
 * @generic {Phaser.Math.Vector2} O - [out,$return]
 *
 * @param {Phaser.Geom.Line} line - The line to get the nearest point on.
 * @param {Phaser.Math.Vector2} vec - The Vector2 to get the nearest point to.
 * @param {Phaser.Math.Vector2} [out] - An optional Vector2 object, to store the coordinates of the nearest point on the line.
 *
 * @return {Phaser.Math.Vector2} The nearest point on the line.
 */
var GetNearestPoint = function (line, vec, out)
{
    if (out === undefined) { out = new Vector2(); }

    var x1 = line.x1;
    var y1 = line.y1;

    var x2 = line.x2;
    var y2 = line.y2;

    var L2 = (((x2 - x1) * (x2 - x1)) + ((y2 - y1) * (y2 - y1)));

    if (L2 === 0)
    {
        return out;
    }

    var r = (((vec.x - x1) * (x2 - x1)) + ((vec.y - y1) * (y2 - y1))) / L2;

    out.x = x1 + (r * (x2 - x1));
    out.y = y1 + (r * (y2 - y1));

    return out;
};

module.exports = GetNearestPoint;
