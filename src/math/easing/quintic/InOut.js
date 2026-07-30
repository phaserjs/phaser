/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Applies a Quintic ease-in/out function to the given value. The motion begins slowly,
 * accelerates sharply through the midpoint, then decelerates back to a slow stop. The
 * quintic curve (raised to the 5th power) produces a more dramatic acceleration and
 * deceleration compared to cubic or quartic easings, making it well suited for animations
 * that require a strong, punchy feel with smooth start and end transitions.
 *
 * @function Phaser.Math.Easing.Quintic.InOut
 * @since 3.0.0
 *
 * @param {number} v - The value to be eased, in the range [0, 1].
 *
 * @return {number} The eased value, in the range [0, 1].
 */
var InOut = function (v)
{
    if ((v *= 2) < 1)
    {
        return 0.5 * v * v * v * v * v;
    }
    else
    {
        return 0.5 * ((v -= 2) * v * v * v * v + 2);
    }
};

module.exports = InOut;
