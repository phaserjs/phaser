var EarCut = require('../polygon/Earcut');
var Triangle = require('./Triangle');

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
