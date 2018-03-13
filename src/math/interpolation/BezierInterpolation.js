/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Bernstein = require('../Bernstein');

/**
 * [description]
 *
 * @function Phaser.Math.Interpolation.Bezier
 * @since 3.0.0
 *
 * @param {number} v - [description]
 * @param {number} k - [description]
 *
 * @return {number} [description]
 */
var BezierInterpolation = function (v, k)
{
    var b = 0;
    var n = v.length - 1;

    for (var i = 0; i <= n; i++)
    {
        b += Math.pow(1 - k, n - i) * Math.pow(k, i) * v[i] * Bernstein(n, i);
    }

    return b;
};

module.exports = BezierInterpolation;
