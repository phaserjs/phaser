var CircumferencePoint = require('./CircumferencePoint');
var FromPercent = require('../../math/FromPercent');
var MATH_CONST = require('../../math/const');
var Point = require('../point/Point');

var GetPoints = function (circle, steps, out)
{
    if (out === undefined) { out = []; }

    var t = 0;
    var inc = MATH_CONST.PI2 / steps;

    for (var i = 0; i < steps; i++)
    {
        var angle = FromPercent(i / steps, 0, MATH_CONST.PI2);

        out.push(CircumferencePoint(circle, angle));

        t += inc;
    }

    return out;
};

module.exports = GetPoints;
