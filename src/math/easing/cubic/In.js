/**
 * [description]
 *
 * @function Phaser.Math.Easing.Cubic.In
 * @since 3.0.0
 *
 * @param {number} v - [description]
 *
 * @return {number} [description]
 */
var In = function (v)
{
    return v * v * v;
};

module.exports = In;
