/**
 * [description]
 *
 * @function Phaser.Math.Fuzzy.Floor
 * @since 3.0.0
 *
 * @param {number} a - [description]
 * @param {number} b - [description]
 * @param {float} [epsilon=0.0001] - [description]
 *
 * @return {number} [description]
 */
var Floor = function (a, b, epsilon)
{
    if (epsilon === undefined) { epsilon = 0.0001; }

    return Math.floor(value + epsilon);
};

module.exports = Floor;
