/**
 * [description]
 *
 * @function Phaser.Math.FloatBetween
 * @since 3.0.0
 *
 * @param {float} min - [description]
 * @param {float} max - [description]
 *
 * @return {float} [description]
 */
var FloatBetween = function (min, max)
{
    return Math.random() * (max - min) + min;
};

module.exports = FloatBetween;
