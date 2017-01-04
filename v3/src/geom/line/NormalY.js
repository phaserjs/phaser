var MATH_CONST = require('../../math/const');
var Angle = require('./Angle');

var NormalY = function (line)
{
    return Math.sin(Angle(line) - MATH_CONST.TAU);
};

module.exports = NormalY;
