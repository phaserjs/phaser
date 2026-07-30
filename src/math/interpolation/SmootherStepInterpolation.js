/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var SmootherStep = require('../SmootherStep');

/**
 * An interpolation method based on Ken Perlin's Smoother Step function, which is an improved
 * variant of the standard Smooth Step curve. Unlike Smooth Step, which has zero first derivatives
 * at the endpoints, Smoother Step also has zero second derivatives at the endpoints, resulting in
 * an even smoother S-curve transition between `min` and `max`. Use this when you need particularly
 * fluid easing with no perceivable acceleration or deceleration artifacts at the start or end of
 * the transition.
 *
 * @function Phaser.Math.Interpolation.SmootherStep
 * @since 3.9.0
 * @see {@link https://en.wikipedia.org/wiki/Smoothstep#Variations}
 *
 * @param {number} t - The percentage of interpolation, between 0 and 1.
 * @param {number} min - The minimum value, also known as the 'left edge', assumed smaller than the 'right edge'.
 * @param {number} max - The maximum value, also known as the 'right edge', assumed greater than the 'left edge'.
 *
 * @return {number} The interpolated value.
 */
var SmootherStepInterpolation = function (t, min, max)
{
    return min + (max - min) * SmootherStep(t, 0, 1);
};

module.exports = SmootherStepInterpolation;
