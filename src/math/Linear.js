/**
 * [description]
 *
 * @function Phaser.Math.Linear
 * @since 3.0.0
 *
 * @param {number} p0 - [description]
 * @param {number} p1 - [description]
 * @param {float} t - [description]
 *
 * @return {number} [description]
 */
var Linear = function (p0, p1, t)
{
    return (p1 - p0) * t + p0;
};

module.exports = Linear;
