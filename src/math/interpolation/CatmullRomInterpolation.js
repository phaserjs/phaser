/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var CatmullRom = require('../CatmullRom');

/**
 * Performs a Catmull-Rom spline interpolation over an array of values, producing a smooth
 * curve that passes through every control point. The `k` parameter (0 to 1) determines
 * the position along the full curve.
 *
 * If the first and last values in `v` are equal, the curve is treated as closed (looping),
 * and the interpolation wraps around seamlessly. Otherwise, the curve is treated as open,
 * and values of `k` outside the 0 to 1 range will extrapolate beyond the endpoints.
 *
 * @function Phaser.Math.Interpolation.CatmullRom
 * @since 3.0.0
 *
 * @param {number[]} v - The input array of control point values to interpolate between.
 * @param {number} k - The percentage of interpolation, between 0 and 1. Values outside this range extrapolate on an open curve, or wrap on a closed curve.
 *
 * @return {number} The interpolated value.
 */
var CatmullRomInterpolation = function (v, k)
{
    var m = v.length - 1;
    var f = m * k;
    var i = Math.floor(f);

    if (v[0] === v[m])
    {
        if (k < 0)
        {
            i = Math.floor(f = m * (1 + k));
        }

        return CatmullRom(f - i, v[(i - 1 + m) % m], v[i], v[(i + 1) % m], v[(i + 2) % m]);
    }
    else
    {
        if (k < 0)
        {
            return v[0] - (CatmullRom(-f, v[0], v[0], v[1], v[1]) - v[0]);
        }

        if (k > 1)
        {
            return v[m] - (CatmullRom(f - m, v[m], v[m], v[m - 1], v[m - 1]) - v[m]);
        }

        return CatmullRom(f - i, v[i ? i - 1 : 0], v[i], v[m < i + 1 ? m : i + 1], v[m < i + 2 ? m : i + 2]);
    }
};

module.exports = CatmullRomInterpolation;
