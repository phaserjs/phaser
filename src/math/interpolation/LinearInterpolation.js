/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Linear = require('../Linear');

/**
 * A linear interpolation method.
 *
 * @function Phaser.Math.Interpolation.Linear
 * @since 3.0.0
 * @see {@link https://en.wikipedia.org/wiki/Linear_interpolation}
 *
 * @param {number[]} v - The input array of values to interpolate between.
 * @param {!number} k - The percentage of interpolation, between 0 and 1.
 *
 * @return {!number} The interpolated value.
 */
var LinearInterpolation = function (v, k)
{
    var m = v.length - 1;
    var f = m * k;
    var i = Math.floor(f);

    if (k < 0)
    {
        return Linear(v[0], v[1], f);
    }
    else if (k > 1)
    {
        return Linear(v[m], v[m - 1], m - f);
    }
    else
    {
        return Linear(v[i], v[(i + 1 > m) ? m : i + 1], f - i);
    }
};

module.exports = LinearInterpolation;
