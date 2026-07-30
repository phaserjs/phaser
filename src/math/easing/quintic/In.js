/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Applies a quintic ease-in curve to the given value. The value starts changing
 * very slowly and accelerates sharply toward the end, following a fifth-power (v^5)
 * curve. This produces a more pronounced acceleration effect than cubic or quartic
 * ease-in functions, making it suitable for animations that need to start with
 * near-zero velocity and build up to full speed very rapidly.
 *
 * @function Phaser.Math.Easing.Quintic.In
 * @since 3.0.0
 *
 * @param {number} v - The value to be eased.
 *
 * @return {number} The eased value.
 */
var In = function (v)
{
    return v * v * v * v * v;
};

module.exports = In;
