var FromPercent = require('../../math/FromPercent');
var MATH_CONST = require('../../math/const');
var Point = require('../point/Point');

var GetPoints = function (line, steps, out)
{
    if (out === undefined) { out = []; }

    var x1 = line.x1;
    var y1 = line.y1;

    var x2 = line.x2;
    var y2 = line.y2;

    for (var i = 0; i < steps; i++)
    {
        var position = i / steps;

        var x = x1 + (x2 - x1) * position;
        var y = y1 + (y2 - y1) * position;

        out.push(new Point(x, y));
    }

    return out;
};

module.exports = GetPoints;
