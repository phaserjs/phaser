/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Force a value within the boundaries by clamping it to the range `min`, `max`.
 *
 * @function Phaser.Math.Clamp
 * @since 3.0.0
 *
 * @param {number} value - The value to be clamped.
 * @param {number} min - The minimum bounds.
 * @param {number} max - The maximum bounds.
 *
 * @return {number} The clamped value.
 */
var Clamp = function (value, min, max)
{
    return Math.max(min, Math.min(max, value));
};

module.exports = Clamp;
