/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Back ease-in.
 *
 * @function Phaser.Math.Easing.Back.In
 * @since 3.0.0
 *
 * @param {number} v - The value to be tweened.
 * @param {number} [overshoot=1.70158] - The overshoot amount.
 *
 * @return {number} The tweened value.
 */
var In = function (v, overshoot)
{
    if (overshoot === undefined) { overshoot = 1.70158; }

    return v * v * ((overshoot + 1) * v - overshoot);
};

module.exports = In;
