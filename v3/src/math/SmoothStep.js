/**
 * [description]
 *
 * @function Phaser.Math.SmoothStep
 * @since 3.0.0
 *
 * @param {number} x - [description]
 * @param {number} min - [description]
 * @param {number} max - [description]
 *
 * @return {number} [description]
 */
var SmoothStep = function (x, min, max)
{
    x = Math.max(0, Math.min(1, (x - min) / (max - min)));

    return x * x * (3 - 2 * x);
};

module.exports = SmoothStep;
