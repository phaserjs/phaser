/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * Back ease-in/out.
 *
 * @function Phaser.Math.Easing.Back.InOut
 * @since 3.0.0
 *
 * @param {number} v - The value to be tweened.
 * @param {number} [overshoot=1.70158] - The overshoot amount.
 *
 * @return {number} The tweened value.
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
