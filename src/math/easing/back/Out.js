/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * Back ease-out.
 *
 * @function Phaser.Math.Easing.Back.Out
 * @since 3.0.0
 *
 * @param {number} v - The value to be tweened.
 * @param {number} [overshoot=1.70158] - The overshoot amount.
 *
 * @return {number} The tweened value.
 */
var Out = function (v, overshoot)
{
    if (overshoot === undefined) { overshoot = 1.70158; }

    return --v * v * ((overshoot + 1) * v + overshoot) + 1;
};

module.exports = Out;
