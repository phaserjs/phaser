/**
 * [description]
 *
 * @function Phaser.Math.Easing.Back.In
 * @since 3.0.0
 *
 * @param {number} v - [description]
 * @param {number} [overshoot=1.70158] - [description]
 *
 * @return {number} [description]
 */
var In = function (v, overshoot)
{
    if (overshoot === undefined) { overshoot = 1.70158; }

    return v * v * ((overshoot + 1) * v - overshoot);
};

module.exports = In;
