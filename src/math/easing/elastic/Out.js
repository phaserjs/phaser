/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * [description]
 *
 * @function Phaser.Math.Easing.Elastic.Out
 * @since 3.0.0
 *
 * @param {number} v - [description]
 * @param {float} [amplitude=0.1] - [description]
 * @param {float} [period=0.1] - [description]
 *
 * @return {number} [description]
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
