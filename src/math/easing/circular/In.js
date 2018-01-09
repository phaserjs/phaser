/**
 * [description]
 *
 * @function Phaser.Math.Easing.Circular.In
 * @since 3.0.0
 *
 * @param {number} v - [description]
 *
 * @return {number} [description]
 */
var In = function (v)
{
    return 1 - Math.sqrt(1 - v * v);
};

module.exports = In;
