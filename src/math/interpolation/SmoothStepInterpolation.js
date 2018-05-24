/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var SmoothStep = require('../SmoothStep');

/**
 * A Smooth Step interpolation method.
 *
 * @function Phaser.Math.Interpolation.SmoothStep
 * @since 3.9.0
 * @see https://en.wikipedia.org/wiki/Smoothstep
 *
 * @param {number} x - The input value.
 * @param {number} min - The minimum value, also known as the 'left edge', assumed smaller than the 'right edge'.
 * @param {number} max - The maximum value, also known as the 'right edge', assumed greater than the 'left edge'.
 *
 * @return {number} The interpolated value.
 */
var SmoothStepInterpolation = function (x, min, max)
{
    var t = SmoothStep(x, min, max);

    return (max - min) * t + min;
};

module.exports = SmoothStepInterpolation;
