/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2013-2023 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Bounce ease-out.
 *
 * @function Phaser.Math.Easing.Bounce.Out
 * @since 3.0.0
 *
 * @param {number} v - The value to be tweened.
 *
 * @return {number} The tweened value.
 */
var Out = function (v)
{
    if (v < 1 / 2.75)
    {
        return 7.5625 * v * v;
    }
    else if (v < 2 / 2.75)
    {
        return 7.5625 * (v -= 1.5 / 2.75) * v + 0.75;
    }
    else if (v < 2.5 / 2.75)
    {
        return 7.5625 * (v -= 2.25 / 2.75) * v + 0.9375;
    }
    else
    {
        return 7.5625 * (v -= 2.625 / 2.75) * v + 0.984375;
    }
};

module.exports = Out;
