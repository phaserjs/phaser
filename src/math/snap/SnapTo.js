/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * Snap a value to nearest grid slice, using rounding.
 *
 * Example: if you have an interval gap of `5` and a position of `12`... you will snap to `10` whereas `14` will snap to `15`.
 *
 * @function Phaser.Math.Snap.To
 * @since 3.0.0
 *
 * @param {number} value - The value to snap.
 * @param {number} gap - The interval gap of the grid.
 * @param {number} [start=0] - Optional starting offset for gap.
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
