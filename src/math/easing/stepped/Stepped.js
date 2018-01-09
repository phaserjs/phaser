/**
 * [description]
 *
 * @function Phaser.Math.Easing.Stepped
 * @since 3.0.0
 *
 * @param {number} v - [description]
 * @param {float} [steps=1] - [description]
 *
 * @return {number} [description]
 */
var Stepped = function (v, steps)
{
    if (steps === undefined) { steps = 1; }

    if (v <= 0)
    {
        return 0;
    }
    else if (v >= 1)
    {
        return 1;
    }
    else
    {
        return (((steps * v) | 0) + 1) * (1 / steps);
    }
};

module.exports = Stepped;
