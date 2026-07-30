/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Circular ease-in/out. Applies a circular easing curve that starts slow, accelerates
 * through the midpoint, then decelerates to a smooth stop. The shape of the curve is
 * derived from the arc of a circle, producing a natural-feeling motion that is more
 * gradual than a sine ease but sharper than a quadratic ease. Combining ease-in and
 * ease-out makes the transition symmetrical: the first half eases in using a circular
 * arc and the second half eases out using a mirrored arc.
 *
 * @function Phaser.Math.Easing.Circular.InOut
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
        return -0.5 * (Math.sqrt(1 - v * v) - 1);
    }
    else
    {
        return 0.5 * (Math.sqrt(1 - (v -= 2) * v) + 1);
    }
};

module.exports = InOut;
