/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2013-2023 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Quartic ease-out.
 *
 * @function Phaser.Math.Easing.Quartic.Out
 * @since 3.0.0
 *
 * @param {number} v - The value to be tweened.
 *
 * @return {number} The tweened value.
 */
var Out = function (v)
{
    return 1 - (--v * v * v * v);
};

module.exports = Out;
