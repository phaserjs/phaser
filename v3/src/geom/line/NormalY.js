var MATH_CONST = require('../../math/const');
var Angle = require('./Angle');

/**
 * [description]
 *
 * @function Phaser.Geom.Line.NormalY
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Line} line - [description]
 *
 * @return {number} [description]
 */
var NormalY = function (line)
{
    return Math.sin(Angle(line) - MATH_CONST.TAU);
};

module.exports = NormalY;
