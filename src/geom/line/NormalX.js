var MATH_CONST = require('../../math/const');
var Angle = require('./Angle');

/**
 * [description]
 *
 * @function Phaser.Geom.Line.NormalX
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Line} line - [description]
 *
 * @return {number} [description]
 */
var NormalX = function (line)
{
    return Math.cos(Angle(line) - MATH_CONST.TAU);
};

module.exports = NormalX;
