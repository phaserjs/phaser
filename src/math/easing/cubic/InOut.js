/**
 * [description]
 *
 * @function Phaser.Math.Easing.Cubic.InOut
 * @since 3.0.0
 *
 * @param {number} v - [description]
 *
 * @return {number} [description]
 */
var InOut = function (v)
{
    if ((v *= 2) < 1)
    {
        return 0.5 * v * v * v;
    }
    else
    {
        return 0.5 * ((v -= 2) * v * v + 2);
    }
};

module.exports = InOut;
