/**
 * [description]
 *
 * @function Phaser.Math.Easing.Sine.In
 * @since 3.0.0
 *
 * @param {number} v - [description]
 *
 * @return {number} [description]
 */
var In = function (v)
{
    if (v === 0)
    {
        return 0;
    }
    else if (v === 1)
    {
        return 1;
    }
    else
    {
        return 1 - Math.cos(v * Math.PI / 2);
    }
};

module.exports = In;
