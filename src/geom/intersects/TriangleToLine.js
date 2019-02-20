/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Point = require('../point/Point');
var LineToLine = require('./LineToLine');
var ContainsPoint = require('../triangle/ContainsPoint');

/**
 * Checks if a Triangle and a Line intersect.
 *
 * The Line intersects the Triangle if it starts inside of it, ends inside of it, or crosses any of the Triangle's sides. Thus, the Triangle is considered "solid".
 *
 * @function Phaser.Geom.Intersects.TriangleToLine
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Triangle} triangle - The Triangle to check with.
 * @param {Phaser.Geom.Line} line - The Line to check with.
 * @param {array} [out] - An array in which to optionally store the points of intersection.
 *
 * @return {boolean} `true` if the Triangle and the Line intersect, otherwise `false`.
 */
var TriangleToLine = function (triangle, line, out)
{
    if (out === undefined) { out = []; }
    var oriLength = out.length;

    var lineA = triangle.getLineA();
    var lineB = triangle.getLineB();
    var lineC = triangle.getLineC();

    var output = [ new Point(), new Point(), new Point() ];

    var res = [
        LineToLine(lineA, line, output[0]),
        LineToLine(lineB, line, output[1]),
        LineToLine(lineC, line, output[2])
    ];

    for (var i = 0; i < 3; i++)
    {
        if (res[i] && output !== []) { out.push(output[i]); }
    }

    if (out.length - oriLength > 0) { return true; }
    else if (ContainsPoint(triangle, line.getPointA()) ||
            ContainsPoint(triangle, line.getPointB())) { return true; }
    else { return false; }
};

module.exports = TriangleToLine;
