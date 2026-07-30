/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Applies a Bounce ease-in/out effect to the given value. This combines both the ease-in and
 * ease-out bounce effects, producing a bouncing animation at the start and end of the tween.
 * The input value should be in the range 0 to 1, where 0 is the start and 1 is the end of the tween.
 *
 * @function Phaser.Math.Easing.Bounce.InOut
 * @since 3.0.0
 *
 * @param {number} v - The value to be eased.
 *
 * @return {number} The eased value.
 */
var InOut = function (v)
{
    var reverse = false;

    if (v < 0.5)
    {
        v = 1 - (v * 2);
        reverse = true;
    }
    else
    {
        v = (v * 2) - 1;
    }

    if (v < 1 / 2.75)
    {
        v = 7.5625 * v * v;
    }
    else if (v < 2 / 2.75)
    {
        v = 7.5625 * (v -= 1.5 / 2.75) * v + 0.75;
    }
    else if (v < 2.5 / 2.75)
    {
        v = 7.5625 * (v -= 2.25 / 2.75) * v + 0.9375;
    }
    else
    {
        v = 7.5625 * (v -= 2.625 / 2.75) * v + 0.984375;
    }

    if (reverse)
    {
        return (1 - v) * 0.5;
    }
    else
    {
        return v * 0.5 + 0.5;
    }
};

module.exports = InOut;
