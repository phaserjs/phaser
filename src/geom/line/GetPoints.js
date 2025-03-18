/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Length = require('./Length');
var Vector2 = require('../../math/Vector2');

/**
 * Get a number of points along a line's length.
 *
 * Provide a `quantity` to get an exact number of points along the line.
 *
 * Provide a `stepRate` to ensure a specific distance between each point on the line. Set `quantity` to `0` when
 * providing a `stepRate`.
 *
 * See also `GetEasedPoints` for a way to distribute the points across the line according to an ease type or input function.
 *
 * @function Phaser.Geom.Line.GetPoints
 * @since 3.0.0
 *
 * @generic {Phaser.Math.Vector2[]} O - [out,$return]
 *
 * @param {Phaser.Geom.Line} line - The line.
 * @param {number} quantity - The number of points to place on the line. Set to `0` to use `stepRate` instead.
 * @param {number} [stepRate] - The distance between each point on the line. When set, `quantity` is implied and should be set to `0`.
 * @param {Phaser.Math.Vector2[]} [out] - An optional array of Vector2 objects to store the coordinates of the points on the line.
 *
 * @return {Phaser.Math.Vector2[]} An array of Vector2 objects containing the coordinates of the points on the line.
 */
var GetPoints = function (line, quantity, stepRate, out)
{
    if (out === undefined) { out = []; }

    //  If quantity is a falsey value (false, null, 0, undefined, etc) then we calculate it based on the stepRate instead.
    if (!quantity && stepRate > 0)
    {
        quantity = Length(line) / stepRate;
    }

    var x1 = line.x1;
    var y1 = line.y1;

    var x2 = line.x2;
    var y2 = line.y2;

    for (var i = 0; i < quantity; i++)
    {
        var position = i / quantity;

        var x = x1 + (x2 - x1) * position;
        var y = y1 + (y2 - y1) * position;

        out.push(new Vector2(x, y));
    }

    return out;
};

module.exports = GetPoints;
