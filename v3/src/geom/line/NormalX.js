var MATH_CONST = require('../../math/const');
var Angle = require('./Angle');

var NormalX = function (line)
{
    return Math.cos(Angle(line) - MATH_CONST.TAU);
};

module.exports = NormalX;
