/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Point = require('../point/Point');
var LineToLine = require('./LineToLine');
var ContainsPoint = require('../rectangle/ContainsPoint');

/**
 * Checks for intersection between the Line and a Rectangle shape, or a rectangle-like
 * object, with public `x`, `y`, `right` and `bottom` properties, such as a Sprite or Body.
 *
 * An intersection is considered valid if:
 *
 * The line starts within, or ends within, the Rectangle.
 * The line segment intersects one of the 4 rectangle edges.
 *
 * The for the purposes of this function rectangles are considered 'solid'.
 *
 * @function Phaser.Geom.Intersects.LineToRectangle
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Line} line - The Line to check for intersection.
 * @param {(Phaser.Geom.Rectangle|object)} rect - The Rectangle to check for intersection.
 * @param {array} [out] - An array in which to optionally store the points of intersection.
 *
 * @return {boolean} `true` if the Line and the Rectangle intersect, `false` otherwise.
 */
var LineToRectangle = function (line, rect, out)
{
    if (out === undefined) { out = []; }

    var oriLength = out.length;

    var lineA = rect.getLineA();
    var lineB = rect.getLineB();
    var lineC = rect.getLineC();
    var lineD = rect.getLineD();

    var output = [ new Point(), new Point(), new Point(), new Point() ];

    var res = [
        LineToLine(lineA, line, output[0]),
        LineToLine(lineB, line, output[1]),
        LineToLine(lineC, line, output[2]),
        LineToLine(lineD, line, output[3])
    ];

    for (var i = 0; i < 4; i++)
    {
        if (res[i]) { out.push(output[i]); }
    }

    if (out.length - oriLength > 0) { return true; }
    else if (ContainsPoint(rect, line.getPointA()) ||
             ContainsPoint(rect, line.getPointB())) { return true; }
    else { return false; }
};

module.exports = LineToRectangle;
