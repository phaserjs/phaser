/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Back ease-in/out. This easing function applies a back effect to both the
 * start and end of the tween: the value initially pulls back slightly before
 * accelerating forward, then overshoots the target before snapping back to
 * rest, producing a symmetrical spring-like motion. Use this when you want a
 * lively, bouncy feel at both ends of an animation.
 *
 * @function Phaser.Math.Easing.Back.InOut
 * @since 3.0.0
 *
 * @param {number} v - The value to be eased.
 * @param {number} [overshoot=1.70158] - Controls the magnitude of the pull-back and overshoot. Higher values produce a more pronounced effect. The default produces approximately 10% overshoot at each end.
 *
 * @return {number} The eased value.
 */
var InOut = function (v, overshoot)
{
    if (overshoot === undefined) { overshoot = 1.70158; }

    var s = overshoot * 1.525;

    if ((v *= 2) < 1)
    {
        return 0.5 * (v * v * ((s + 1) * v - s));
    }
    else
    {
        return 0.5 * ((v -= 2) * v * ((s + 1) * v + s) + 2);
    }
};

module.exports = InOut;
