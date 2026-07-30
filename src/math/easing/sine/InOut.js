/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Applies a sinusoidal ease-in/out to the given value. The motion starts slowly,
 * accelerates through the midpoint, and decelerates back to a stop at the end,
 * producing a smooth S-curve transition. This is useful for animations that
 * need a natural, symmetrical feel with gentle starts and endings.
 *
 * @function Phaser.Math.Easing.Sine.InOut
 * @since 3.0.0
 *
 * @param {number} v - The value to be eased, in the range [0, 1].
 *
 * @return {number} The eased value, in the range [0, 1].
 */
var InOut = function (v)
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
        return 0.5 * (1 - Math.cos(Math.PI * v));
    }
};

module.exports = InOut;
