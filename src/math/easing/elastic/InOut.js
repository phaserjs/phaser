/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * An Elastic ease-in/out, combining both the ease-in and ease-out elastic effects.
 * This easing function produces a spring-like oscillation at both the start and end
 * of the tween, overshooting the target value before settling. It is useful for
 * animations that need a bouncy, elastic feel at both ends of the transition.
 *
 * @function Phaser.Math.Easing.Elastic.InOut
 * @since 3.0.0
 *
 * @param {number} v - The value to be eased, typically in the range [0, 1].
 * @param {number} [amplitude=0.1] - The amplitude of the elastic oscillation. Values below 1 are clamped to 1.
 * @param {number} [period=0.1] - Controls how tight the sine-wave oscillation is. Smaller values produce tighter waves with more cycles.
 *
 * @return {number} The eased value.
 */
var InOut = function (v, amplitude, period)
{
    if (amplitude === undefined) { amplitude = 0.1; }
    if (period === undefined) { period = 0.1; }

    if (v === 0)
    {
        return 0;
    }
    else if (v === 1)
    {
        return 1;
    }
    else
    {
        var s = period / 4;

        if (amplitude < 1)
        {
            amplitude = 1;
        }
        else
        {
            s = period * Math.asin(1 / amplitude) / (2 * Math.PI);
        }

        if ((v *= 2) < 1)
        {
            return -0.5 * (amplitude * Math.pow(2, 10 * (v -= 1)) * Math.sin((v - s) * (2 * Math.PI) / period));
        }
        else
        {
            return amplitude * Math.pow(2, -10 * (v -= 1)) * Math.sin((v - s) * (2 * Math.PI) / period) * 0.5 + 1;
        }
    }
};

module.exports = InOut;
