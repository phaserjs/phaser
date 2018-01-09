var Circumference = require('./Circumference');
var CircumferencePoint = require('./CircumferencePoint');
var FromPercent = require('../../math/FromPercent');
var MATH_CONST = require('../../math/const');

var GetPoints = function (ellipse, quantity, stepRate, out)
{
    if (out === undefined) { out = []; }

    //  If quantity is a falsey value (false, null, 0, undefined, etc) then we calculate it based on the stepRate instead.
    if (!quantity)
    {
        quantity = Circumference(ellipse) / stepRate;
    }

    for (var i = 0; i < quantity; i++)
    {
        var angle = FromPercent(i / quantity, 0, MATH_CONST.PI2);

        out.push(CircumferencePoint(ellipse, angle));
    }

    return out;
};

module.exports = GetPoints;
