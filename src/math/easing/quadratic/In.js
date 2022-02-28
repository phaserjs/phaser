/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2022 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Quadratic ease-in.
 *
 * @function Phaser.Math.Easing.Quadratic.In
 * @since 3.0.0
 *
 * @param {number} v - The value to be tweened.
 *
 * @return {number} The tweened value.
 */
var In = function (v)
{
    return v * v;
};

module.exports = In;
