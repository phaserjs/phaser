/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Applies a bounce easing to the start of the tween. The eased value will
 * 'bounce' several times near the origin before accelerating toward the target,
 * simulating the effect of a ball bouncing as it begins to move. This is the
 * ease-in variant, meaning the bounce effect occurs at the beginning of the
 * transition rather than the end.
 *
 * @function Phaser.Math.Easing.Bounce.In
 * @since 3.0.0
 *
 * @param {number} v - The value to be eased, in the range 0 to 1.
 *
 * @return {number} The eased value, in the range 0 to 1.
 */
var In = function (v)
{
    v = 1 - v;

    if (v < 1 / 2.75)
    {
        return 1 - (7.5625 * v * v);
    }
    else if (v < 2 / 2.75)
    {
        return 1 - (7.5625 * (v -= 1.5 / 2.75) * v + 0.75);
    }
    else if (v < 2.5 / 2.75)
    {
        return 1 - (7.5625 * (v -= 2.25 / 2.75) * v + 0.9375);
    }
    else
    {
        return 1 - (7.5625 * (v -= 2.625 / 2.75) * v + 0.984375);
    }
};

module.exports = In;
