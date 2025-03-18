/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Snap a value to nearest grid slice, using ceil.
 *
 * Example: if you have an interval gap of `5` and a position of `12`... you will snap to `15`.
 * As will `14` snap to `15`... but `16` will snap to `20`.
 *
 * @function Phaser.Math.Snap.Ceil
 * @since 3.0.0
 *
 * @param {number} value - The value to snap.
 * @param {number} gap - The interval gap of the grid.
 * @param {number} [start=0] - Optional starting offset for gap.
 * @param {boolean} [divide=false] - If `true` it will divide the snapped value by the gap before returning.
 *
 * @return {number} The snapped value.
 */
var SnapCeil = function (value, gap, start, divide)
{
    if (start === undefined) { start = 0; }

    if (gap === 0)
    {
        return value;
    }

    value -= start;
    value = gap * Math.ceil(value / gap);

    return (divide) ? (start + value) / gap : start + value;
};

module.exports = SnapCeil;
