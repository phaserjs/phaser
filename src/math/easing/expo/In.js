/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2022 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Exponential ease-in.
 *
 * @function Phaser.Math.Easing.Expo.In
 * @since 3.0.0
 *
 * @param {number} v - The value to be tweened.
 *
 * @return {number} The tweened value.
 */
var In = function (v)
{
    return Math.pow(2, 10 * (v - 1)) - 0.001;
};

module.exports = In;
