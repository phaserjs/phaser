var FloatBetween = require('../FloatBetween');

/**
 * Returns a random angle in the range [0, 360].
 *
 * @function Phaser.Math.Angle.RandomDegrees
 * @since 3.23.0
 *
 * @return {number} The angle, in degrees.
 */
var RandomDegrees = function ()
{
    return FloatBetween(0, 360);
};

module.exports = RandomDegrees;
