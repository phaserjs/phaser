/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * [description]
 *
 * @function Phaser.Math.Easing.Bounce.In
 * @since 3.0.0
 *
 * @param {number} v - [description]
 *
 * @return {number} [description]
 */
var In = function (v)
{
    v = 1 - v;

    if (v < 1 / 2.75)
    {
        return 1 - (7.5625 * v * v);
    }
    else if (v < 2 / 2.75)
    {
        return 1 - (7.5625 * (v -= 1.5 / 2.75) * v + 0.75);
    }
    else if (v < 2.5 / 2.75)
    {
        return 1 - (7.5625 * (v -= 2.25 / 2.75) * v + 0.9375);
    }
    else
    {
        return 1 - (7.5625 * (v -= 2.625 / 2.75) * v + 0.984375);
    }
};

module.exports = In;
