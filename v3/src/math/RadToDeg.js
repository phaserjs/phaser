var CONST = require('./const');

/**
 * [description]
 *
 * @function Phaser.Math.RadToDeg
 * @since 3.0.0
 *
 * @param {float} radians - [description]
 *
 * @return {integer} [description]
 */
var RadToDeg = function (radians)
{
    return radians * CONST.RAD_TO_DEG;
};

module.exports = RadToDeg;
