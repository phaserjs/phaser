/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * Quartic ease-in/out.
 *
 * @function Phaser.Math.Easing.Quartic.InOut
 * @since 3.0.0
 *
 * @param {number} v - The value to be tweened.
 *
 * @return {number} The tweened value.
 */
var InOut = function (v)
{
    if ((v *= 2) < 1)
    {
        return 0.5 * v * v * v * v;
    }
    else
    {
        return -0.5 * ((v -= 2) * v * v * v - 2);
    }
};

module.exports = InOut;
