/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2022 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Quadratic ease-in/out.
 *
 * @function Phaser.Math.Easing.Quadratic.InOut
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
        return 0.5 * v * v;
    }
    else
    {
        return -0.5 * (--v * (v - 2) - 1);
    }
};

module.exports = InOut;
