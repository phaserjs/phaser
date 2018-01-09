/**
 * [description]
 *
 * @function Phaser.Math.Easing.Expo.Out
 * @since 3.0.0
 *
 * @param {number} v - [description]
 *
 * @return {number} [description]
 */
var Out = function (v)
{
    return 1 - Math.pow(2, -10 * v);
};

module.exports = Out;
