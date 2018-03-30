/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * [description]
 *
 * @function Phaser.Math.Easing.Back.InOut
 * @since 3.0.0
 *
 * @param {number} v - [description]
 * @param {number} [overshoot=1.70158] - [description]
 *
 * @return {number} [description]
 */
var InOut = function (v, overshoot)
{
    if (overshoot === undefined) { overshoot = 1.70158; }

    var s = overshoot * 1.525;

    if ((v *= 2) < 1)
    {
        return 0.5 * (v * v * ((s + 1) * v - s));
    }
    else
    {
        return 0.5 * ((v -= 2) * v * ((s + 1) * v + s) + 2);
    }
};

module.exports = InOut;
