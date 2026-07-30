/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Applies a sinusoidal ease-in curve to the given value. The motion starts slowly
 * and accelerates toward the end, following the shape of a sine wave. This produces
 * a gentler start than most other ease-in functions, making it well suited for subtle
 * animations such as fading in UI elements or smoothly beginning a camera pan.
 *
 * The input value `v` should be in the range 0 to 1, where 0 represents the start
 * and 1 the end of the tween. Values outside this range are not clamped.
 *
 * @function Phaser.Math.Easing.Sine.In
 * @since 3.0.0
 *
 * @param {number} v - The value to be eased, typically in the range 0 to 1.
 *
 * @return {number} The eased value, in the range 0 to 1.
 */
var In = function (v)
{
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
        return 1 - Math.cos(v * Math.PI / 2);
    }
};

module.exports = In;
