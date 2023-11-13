/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2013-2023 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Length = require('./Length');
var Point = require('../point/Point');

/**
 * Get a number of points along a line's length.
 *
 * Provide a `quantity` to get an exact number of points along the line.
 *
 * Provide a `stepRate` to ensure a specific distance between each point on the line. Set `quantity` to `0` when
 * providing a `stepRate`.
 *
 * @function Phaser.Geom.Line.GetPoints
 * @since 3.0.0
 *
 * @generic {Phaser.Geom.Point[]} O - [out,$return]
 *
 * @param {Phaser.Geom.Line} line - The line.
 * @param {number} quantity - The number of points to place on the line. Set to `0` to use `stepRate` instead.
 * @param {number} [stepRate] - The distance between each point on the line. When set, `quantity` is implied and should be set to `0`.
 * @param {(array|Phaser.Geom.Point[])} [out] - An optional array of Points, or point-like objects, to store the coordinates of the points on the line.
 *
 * @return {(array|Phaser.Geom.Point[])} An array of Points, or point-like objects, containing the coordinates of the points on the line.
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

    var dx = x2 - x1;
    var dy = y2 - y1;

    var distance = Math.sqrt(dx * dx + dy * dy);
    var stepSize = distance / (quantity - 1);

    for (var i = 0; i < quantity; i++)
    {
        var x = x1 + (dx / distance) * (stepSize * i);
        var y = y1 + (dy / distance) * (stepSize * i);

        out.push(new Point(x, y));
    }

    return out;
};

module.exports = GetPoints;
