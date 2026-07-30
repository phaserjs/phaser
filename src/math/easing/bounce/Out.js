/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Applies a bounce ease-out effect to the given value. The motion starts fast
 * and decelerates toward the end with a bouncing effect, simulating a ball
 * landing and bouncing to a stop. The bounce is achieved through four piecewise
 * quadratic segments that produce three diminishing bounces before settling.
 *
 * @function Phaser.Math.Easing.Bounce.Out
 * @since 3.0.0
 *
 * @param {number} v - The value to be eased.
 *
 * @return {number} The eased value.
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
