var FloatBetween = require('../FloatBetween');
var CONST = require('../const');

/**
 * Returns a random angle in the range [0, 2pi].
 *
 * @function Phaser.Math.Angle.Random
 * @since 3.23.0
 *
 * @return {number} The angle, in radians.
 */
var Random = function ()
{
    return FloatBetween(0, CONST.PI2);
};

module.exports = Random;
