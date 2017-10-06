var CONST = require('./const');

/**
 * [description]
 *
 * @function Phaser.Math.DegToRad
 * @since 3.0.0
 *
 * @param {integer} degrees - [description]
 *
 * @return {float} [description]
 */
var DegToRad = function (degrees)
{
    return degrees * CONST.DEG_TO_RAD;
};

module.exports = DegToRad;
