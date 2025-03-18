/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var EarCut = require('../polygon/Earcut');
var Triangle = require('./Triangle');

/**
 * Takes an array of vertex coordinates, and optionally an array of hole indices, then returns an array
 * of Triangle instances, where the given vertices have been decomposed into a series of triangles.
 *
 * @function Phaser.Geom.Triangle.BuildFromPolygon
 * @since 3.0.0
 *
 * @generic {Phaser.Geom.Triangle[]} O - [out,$return]
 *
 * @param {array} data - A flat array of vertex coordinates like [x0,y0, x1,y1, x2,y2, ...]
 * @param {array} [holes=null] - An array of hole indices if any (e.g. [5, 8] for a 12-vertex input would mean one hole with vertices 5–7 and another with 8–11).
 * @param {number} [scaleX=1] - Horizontal scale factor to multiply the resulting points by.
 * @param {number} [scaleY=1] - Vertical scale factor to multiply the resulting points by.
 * @param {(array|Phaser.Geom.Triangle[])} [out] - An array to store the resulting Triangle instances in. If not provided, a new array is created.
 *
 * @return {(array|Phaser.Geom.Triangle[])} An array of Triangle instances, where each triangle is based on the decomposed vertices data.
 */
var BuildFromPolygon = function (data, holes, scaleX, scaleY, out)
{
    if (holes === undefined) { holes = null; }
    if (scaleX === undefined) { scaleX = 1; }
    if (scaleY === undefined) { scaleY = 1; }
    if (out === undefined) { out = []; }

    var tris = EarCut(data, holes);

    var a;
    var b;
    var c;

    var x1;
    var y1;

    var x2;
    var y2;

    var x3;
    var y3;

    for (var i = 0; i < tris.length; i += 3)
    {
        a = tris[i];
        b = tris[i + 1];
        c = tris[i + 2];

        x1 = data[a * 2] * scaleX;
        y1 = data[(a * 2) + 1] * scaleY;

        x2 = data[b * 2] * scaleX;
        y2 = data[(b * 2) + 1] * scaleY;

        x3 = data[c * 2] * scaleX;
        y3 = data[(c * 2) + 1] * scaleY;

        out.push(new Triangle(x1, y1, x2, y2, x3, y3));
    }

    return out;
};

module.exports = BuildFromPolygon;
