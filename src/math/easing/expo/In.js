/**
 * [description]
 *
 * @function Phaser.Math.Easing.Expo.In
 * @since 3.0.0
 *
 * @param {number} v - [description]
 *
 * @return {number} [description]
 */
var In = function (v)
{
    return Math.pow(2, 10 * (v - 1)) - 0.001;
};

module.exports = In;
