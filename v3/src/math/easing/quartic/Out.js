/**
 * [description]
 *
 * @function Phaser.Math.Easing.Quartic.Out
 * @since 3.0.0
 *
 * @param {number} v - [description]
 *
 * @return {number} [description]
 */
var Out = function (v)
{
    return 1 - (--v * v * v * v);
};

module.exports = Out;
