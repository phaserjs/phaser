/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Quintic ease-out.
 *
 * @function Phaser.Math.Easing.Quintic.Out
 * @since 3.0.0
 *
 * @param {number} v - The value to be tweened.
 *
 * @return {number} The tweened value.
 */
var Out = function (v)
{
    return --v * v * v * v * v + 1;
};

module.exports = Out;
