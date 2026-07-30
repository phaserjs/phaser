/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * A stepped easing function that quantizes the input value into a discrete number of evenly-spaced
 * steps, creating a staircase progression rather than a smooth curve. The output jumps instantly
 * between step values instead of interpolating, which is useful for frame-by-frame animations,
 * grid-snapped movement, or any effect that should advance in distinct increments.
 *
 * @function Phaser.Math.Easing.Stepped
 * @since 3.0.0
 *
 * @param {number} v - The value to be eased.
 * @param {number} [steps=1] - The number of steps in the ease.
 *
 * @return {number} The eased value.
 */
var Stepped = function (v, steps)
{
    if (steps === undefined) { steps = 1; }

    if (v <= 0)
    {
        return 0;
    }
    else if (v >= 1)
    {
        return 1;
    }
    else
    {
        return (((steps * v) | 0) + 1) * (1 / steps);
    }
};

module.exports = Stepped;
