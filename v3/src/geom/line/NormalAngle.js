var MATH_CONST = require('../../math/const');
var Wrap = require('../../math/Wrap');
var Angle = require('./Angle');

var NormalAngle = function (line)
{
    var angle = Angle(line) - MATH_CONST.TAU;

    return Wrap(angle, -Math.PI, Math.PI);
};

module.exports = NormalAngle;
