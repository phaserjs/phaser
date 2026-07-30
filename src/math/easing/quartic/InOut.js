/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Quartic ease-in/out. Applies a quartic (fourth-power) curve that accelerates
 * sharply from the start, then decelerates sharply into the end. The motion
 * is symmetric: the first half mirrors the ease-in, and the second half mirrors
 * the ease-out. This produces a more dramatic acceleration and deceleration than
 * quadratic or cubic easing, making it suitable for snappy, high-energy transitions.
 *
 * @function Phaser.Math.Easing.Quartic.InOut
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
        return 0.5 * v * v * v * v;
    }
    else
    {
        return -0.5 * ((v -= 2) * v * v * v - 2);
    }
};

module.exports = InOut;
