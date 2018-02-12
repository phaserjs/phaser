/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Linear = require('../Linear');

/**
 * [description]
 *
 * @function Phaser.Math.Interpolation.Linear
 * @since 3.0.0
 *
 * @param {float} v - [description]
 * @param {number} k - [description]
 *
 * @return {number} [description]
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

    if (k > 1)
    {
        return Linear(v[m], v[m - 1], m - f);
    }

    return Linear(v[i], v[(i + 1 > m) ? m : i + 1], f - i);
};

module.exports = LinearInterpolation;
