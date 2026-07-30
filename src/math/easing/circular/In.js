/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Applies a circular ease-in to the given value. This easing is based on the equation of a circle,
 * producing a curve that starts very slowly and then accelerates sharply toward the end. It is the
 * complement of `Circular.Out` and is commonly used for animations that need a hesitant start before
 * snapping into motion.
 *
 * @function Phaser.Math.Easing.Circular.In
 * @since 3.0.0
 *
 * @param {number} v - The value to be eased.
 *
 * @return {number} The eased value.
 */
var In = function (v)
{
    return 1 - Math.sqrt(1 - v * v);
};

module.exports = In;
