/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Back ease-out. The tween moves quickly at first, then overshoots its final
 * value before settling back to the target. The overshoot occurs at the end of
 * the transition, giving a slight 'bounce past and return' effect.
 *
 * @function Phaser.Math.Easing.Back.Out
 * @since 3.0.0
 *
 * @param {number} v - The value to be eased, typically in the range [0, 1].
 * @param {number} [overshoot=1.70158] - The overshoot amount. Higher values produce a more pronounced overshoot.
 *
 * @return {number} The eased value.
 */
var Out = function (v, overshoot)
{
    if (overshoot === undefined) { overshoot = 1.70158; }

    return --v * v * ((overshoot + 1) * v + overshoot) + 1;
};

module.exports = Out;
