/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Snaps a value to the nearest grid slice, using rounding. Values that fall exactly halfway between two slices will snap to the higher slice.
 *
 * Example: if you have an interval gap of `5` and a position of `12`... you will snap to `10` whereas `14` will snap to `15`.
 *
 * @function Phaser.Math.Snap.To
 * @since 3.0.0
 *
 * @param {number} value - The value to snap.
 * @param {number} gap - The interval gap of the grid.
 * @param {number} [start=0] - Optional starting offset for the grid, allowing grid alignment to begin at a value other than zero.
 * @param {boolean} [divide=false] - If `true` it will divide the snapped value by the gap before returning.
 *
 * @return {number} The snapped value.
 */
var SnapTo = function (value, gap, start, divide)
{
    if (start === undefined) { start = 0; }

    if (gap === 0)
    {
        return value;
    }

    value -= start;
    value = gap * Math.round(value / gap);

    return (divide) ? (start + value) / gap : start + value;
};

module.exports = SnapTo;
