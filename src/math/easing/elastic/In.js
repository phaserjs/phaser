/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2013-2023 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Elastic ease-in.
 *
 * @function Phaser.Math.Easing.Elastic.In
 * @since 3.0.0
 *
 * @param {number} v - The value to be tweened.
 * @param {number} [amplitude=0.1] - The amplitude of the elastic ease.
 * @param {number} [period=0.1] - Sets how tight the sine-wave is, where smaller values are tighter waves, which result in more cycles.
 *
 * @return {number} The tweened value.
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
