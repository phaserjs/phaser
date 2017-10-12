/**
 * [description]
 *
 * @function Phaser.Math.Easing.Quadratic.Out
 * @since 3.0.0
 *
 * @param {number} v - [description]
 *
 * @return {number} [description]
 */
var Out = function (v)
{
    return v * (2 - v);
};

module.exports = Out;
