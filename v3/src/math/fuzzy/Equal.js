/**
 * [description]
 *
 * @function Phaser.Math.Fuzzy.Equal
 * @since 3.0.0
 *
 * @param {number} a - [description]
 * @param {number} b - [description]
 * @param {float} [epsilon=0.0001] - [description]
 *
 * @return {boolean} [description]
 */
var Equal = function (a, b, epsilon)
{
    if (epsilon === undefined) { epsilon = 0.0001; }

    return Math.abs(a - b) < epsilon;
};

module.exports = Equal;
