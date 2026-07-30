/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var SmoothStep = require('../SmoothStep');

/**
 * A Smooth Step interpolation method that uses the Smoothstep function to produce a smooth, S-shaped
 * transition between the `min` and `max` values. Unlike linear interpolation, Smooth Step eases in
 * and out at both edges, resulting in a gradual start and end to the transition. This makes it
 * well-suited for animations and transitions where abrupt changes at the boundaries would look unnatural.
 *
 * The interpolation parameter `t` is first remapped via the Smoothstep curve (which clamps and applies
 * a cubic Hermite function), and the result is then used to linearly interpolate between `min` and `max`.
 *
 * @function Phaser.Math.Interpolation.SmoothStep
 * @since 3.9.0
 * @see {@link https://en.wikipedia.org/wiki/Smoothstep}
 *
 * @param {number} t - The percentage of interpolation, between 0 and 1.
 * @param {number} min - The minimum value, also known as the 'left edge', assumed smaller than the 'right edge'.
 * @param {number} max - The maximum value, also known as the 'right edge', assumed greater than the 'left edge'.
 *
 * @return {number} The interpolated value.
 */
var SmoothStepInterpolation = function (t, min, max)
{
    return min + (max - min) * SmoothStep(t, 0, 1);
};

module.exports = SmoothStepInterpolation;
