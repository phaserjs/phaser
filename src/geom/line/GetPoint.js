/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Vector2 = require('../../math/Vector2');

/**
 * Get a point on a line that's a given percentage along its length.
 *
 * @function Phaser.Geom.Line.GetPoint
 * @since 3.0.0
 *
 * @generic {Phaser.Math.Vector2} O - [out,$return]
 *
 * @param {Phaser.Geom.Line} line - The line.
 * @param {number} position - A value between 0 and 1, where 0 is the start, 0.5 is the middle and 1 is the end of the line.
 * @param {Phaser.Math.Vector2} [out] - An optional Vector2 object to store the coordinates of the point on the line.
 *
 * @return {Phaser.Math.Vector2} The point on the line.
 */
var GetPoint = function (line, position, out)
{
    if (out === undefined) { out = new Vector2(); }

    out.x = line.x1 + (line.x2 - line.x1) * position;
    out.y = line.y1 + (line.y2 - line.y1) * position;

    return out;
};

module.exports = GetPoint;
