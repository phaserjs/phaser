/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * An Elastic ease-out, where the value overshoots its target and oscillates with a decaying sine wave
 * before settling at the final value. The elastic effect occurs at the end of the transition, making
 * the motion appear to bounce or spring into place. Accepts a normalized input value `v` in the range 0 to 1.
 *
 * @function Phaser.Math.Easing.Elastic.Out
 * @since 3.0.0
 *
 * @param {number} v - The normalized value to be tweened, typically in the range [0, 1].
 * @param {number} [amplitude=0.1] - The amplitude of the elastic overshoot. Values above 1 increase the size of the overshoot.
 * @param {number} [period=0.1] - Controls how tight the sine-wave oscillation is. Smaller values produce tighter waves with more rapid oscillations.
 *
 * @return {number} The eased value.
 */
var Out = function (v, amplitude, period)
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

        return (amplitude * Math.pow(2, -10 * v) * Math.sin((v - s) * (2 * Math.PI) / period) + 1);
    }
};

module.exports = Out;
