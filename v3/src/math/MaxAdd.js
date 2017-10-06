/**
 * [description]
 *
 * @function Phaser.Math.MaxAdd
 * @since 3.0.0
 *
 * @param {number} value - [description]
 * @param {number} amount - [description]
 * @param {number} max - [description]
 *
 * @return {number} [description]
 */
var MaxAdd = function (value, amount, max)
{
    return Math.min(value + amount, max);
};

module.exports = MaxAdd;
