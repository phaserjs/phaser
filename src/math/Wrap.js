/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Wrap the given `value` between `min` (inclusive) and `max` (exclusive).
 *
 * When the value exceeds `max` it wraps back around to `min`, and when it falls
 * below `min` it wraps around to just below `max`. This is useful for cycling
 * through a range, such as keeping an angle within 0–360 degrees or looping a
 * tile index within a tileset.
 *
 * @function Phaser.Math.Wrap
 * @since 3.0.0
 *
 * @param {number} value - The value to wrap.
 * @param {number} min - The minimum bound of the range (inclusive).
 * @param {number} max - The maximum bound of the range (exclusive).
 *
 * @return {number} The wrapped value, guaranteed to be within `[min, max)`.
 */
var Wrap = function (value, min, max)
{
    var range = max - min;

    return (min + ((((value - min) % range) + range) % range));
};

module.exports = Wrap;
