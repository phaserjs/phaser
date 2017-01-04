var MATH_CONST = require('../../math/const');
var Angle = require('./Angle');
var Point = require('../point/Point');

var GetNormal = function (line, out)
{
    if (out === undefined) { out = new Point(); }

    var a = Angle(line) - MATH_CONST.TAU;

    out.x = Math.cos(a);
    out.y = Math.sin(a);

    return out;
};

module.exports = GetNormal;
