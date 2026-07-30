/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Cubic ease-in/out. Produces an S-curve that accelerates from zero, reaches
 * maximum speed at the midpoint, then decelerates back to zero. The acceleration
 * and deceleration both follow a cubic (t³) curve, giving a stronger ease than
 * the quadratic equivalent. Typically used to animate values that should start
 * and end smoothly while moving briskly through the middle of the transition.
 *
 * @function Phaser.Math.Easing.Cubic.InOut
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
        return 0.5 * v * v * v;
    }
    else
    {
        return 0.5 * ((v -= 2) * v * v + 2);
    }
};

module.exports = InOut;
