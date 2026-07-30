/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * An elastic ease-in, where the value oscillates back and forth with a spring-like motion before
 * accelerating toward the target. The effect begins with a series of small oscillations that
 * grow in magnitude, simulating a stretched elastic band being released. Use this when you want
 * a tween to feel springy or bouncy at its start before snapping into motion.
 *
 * @function Phaser.Math.Easing.Elastic.In
 * @since 3.0.0
 *
 * @param {number} v - The value to be eased, between 0 and 1.
 * @param {number} [amplitude=0.1] - The amplitude of the elastic oscillation. Values below 1 are clamped to 1. Higher values produce a wider oscillation arc.
 * @param {number} [period=0.1] - Controls how tight the sine-wave oscillation is. Smaller values produce tighter, more frequent cycles; larger values produce wider, slower oscillations.
 *
 * @return {number} The eased value.
 */
var In = function (v, amplitude, period)
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

        return -(amplitude * Math.pow(2, 10 * (v -= 1)) * Math.sin((v - s) * (2 * Math.PI) / period));
    }
};

module.exports = In;
