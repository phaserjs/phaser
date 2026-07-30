/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Back ease-in. This easing function starts the tween by briefly pulling back in the
 * opposite direction before moving forward, creating an anticipation effect at the
 * beginning of the transition. The higher the `overshoot` value, the further back the
 * value pulls before proceeding.
 *
 * @function Phaser.Math.Easing.Back.In
 * @since 3.0.0
 *
 * @param {number} v - The normalized time value to ease, between 0 and 1.
 * @param {number} [overshoot=1.70158] - The overshoot amount. Controls how far back the value pulls before moving forward. Higher values produce a more pronounced pullback effect.
 *
 * @return {number} The eased value.
 */
var In = function (v, overshoot)
{
    if (overshoot === undefined) { overshoot = 1.70158; }

    return v * v * ((overshoot + 1) * v - overshoot);
};

module.exports = In;
