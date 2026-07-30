/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Exponential ease-in/out. Produces a curve that accelerates sharply from zero
 * using an exponential curve in the first half, then decelerates symmetrically
 * to a smooth stop. The result is a pronounced S-shaped curve that starts and
 * ends slowly with a rapid transition through the midpoint. Useful for dramatic
 * animations where a strong snap-in and snap-out effect is desired.
 *
 * @function Phaser.Math.Easing.Expo.InOut
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
        return 0.5 * Math.pow(2, 10 * (v - 1));
    }
    else
    {
        return 0.5 * (2 - Math.pow(2, -10 * (v - 1)));
    }
};

module.exports = InOut;
