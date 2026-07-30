/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Linear = require('../Linear');

/**
 * Performs linear interpolation across an array of values.
 *
 * Given an array of values `v` and a progress factor `k` in the range 0 to 1,
 * this function maps `k` to a position along the array and returns the linearly
 * interpolated value between the two nearest array elements. A `k` of 0 returns
 * a value near the first element, while a `k` of 1 returns a value near the last.
 * Values of `k` outside the range 0 to 1 are extrapolated beyond the ends of the array.
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
