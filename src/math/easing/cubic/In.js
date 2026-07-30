/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Cubic ease-in. Starts slowly and accelerates sharply, following a cubic curve (v³).
 * This produces a gradual start that builds into a fast finish, making it well suited
 * for animations where an object should appear to gather momentum from rest.
 *
 * @function Phaser.Math.Easing.Cubic.In
 * @since 3.0.0
 *
 * @param {number} v - The value to be eased, typically in the range [0, 1].
 *
 * @return {number} The eased value, in the range [0, 1].
 */
var In = function (v)
{
    return v * v * v;
};

module.exports = In;
