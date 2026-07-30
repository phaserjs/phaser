/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Applies a circular ease-out effect to `v`, based on the equation of a unit circle.
 * The motion starts at full speed and decelerates smoothly to a stop, following the
 * curve of a quarter-circle. `v` should be in the range 0 to 1.
 *
 * @function Phaser.Math.Easing.Circular.Out
 * @since 3.0.0
 *
 * @param {number} v - The value to be eased, in the range 0 to 1.
 *
 * @return {number} The eased value, in the range 0 to 1.
 */
var Out = function (v)
{
    return Math.sqrt(1 - (--v * v));
};

module.exports = Out;
