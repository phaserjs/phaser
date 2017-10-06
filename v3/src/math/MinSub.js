/**
 * [description]
 *
 * @function Phaser.Math.MinSub
 * @since 3.0.0
 *
 * @param {number} value - [description]
 * @param {number} amount - [description]
 * @param {number} min - [description]
 *
 * @return {number} [description]
 */
var MinSub = function (value, amount, min)
{
    return Math.max(value - amount, min);
};

module.exports = MinSub;
