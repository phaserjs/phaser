/**
 * [description]
 *
 * @function Phaser.Math.Easing.Cubic.Out
 * @since 3.0.0
 *
 * @param {number} v - [description]
 *
 * @return {number} [description]
 */
var Out = function (v)
{
    return --v * v * v + 1;
};

module.exports = Out;
