/**
 * [description]
 *
 * @function Phaser.Math.Easing.Circular.Out
 * @since 3.0.0
 *
 * @param {number} v - [description]
 *
 * @return {number} [description]
 */
var Out = function (v)
{
    return Math.sqrt(1 - (--v * v));
};

module.exports = Out;
