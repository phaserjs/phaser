/**
 * @author       Florian Vazelle
 * @author       Geoffrey Glaive
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Point = require('../point/Point');
var LineToLine = require('./LineToLine');
var LineToRectangle = require('./LineToRectangle');

/**
 * Checks for intersection between the Line and a Rectangle shape,
 * and returns the intersection points as a Point object array.
 *
 * @function Phaser.Geom.Intersects.GetLineToRectangle
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Line} line - The Line to check for intersection.
 * @param {(Phaser.Geom.Rectangle|object)} rect - The Rectangle to check for intersection.
 * @param {array} [out] - An optional array in which to store the points of intersection.
 *
 * @return {array} An array with the points of intersection if objects intersect, otherwise an empty array.
 */
var GetLineToRectangle = function (line, rect, out)
{
    if (out === undefined) { out = []; }

    if (LineToRectangle(line, rect))
    {
        var lineA = rect.getLineA();
        var lineB = rect.getLineB();
        var lineC = rect.getLineC();
        var lineD = rect.getLineD();

        var output = [ new Point(), new Point(), new Point(), new Point() ];

        var result = [
            LineToLine(lineA, line, output[0]),
            LineToLine(lineB, line, output[1]),
            LineToLine(lineC, line, output[2]),
            LineToLine(lineD, line, output[3])
        ];

        for (var i = 0; i < 4; i++)
        {
            if (result[i]) { out.push(output[i]); }
        }
    }

    return out;
};

module.exports = GetLineToRectangle;
