/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Snap a value to nearest grid slice, using floor.
 *
 * Example: if you have an interval gap of `5` and a position of `12`... you will snap to `10`.
 * As will `14` snap to `10`... but `16` will snap to `15`.
 *
 * @function Phaser.Math.Snap.Floor
 * @since 3.0.0
 *
 * @param {number} value - The value to snap.
 * @param {number} gap - The interval gap of the grid.
 * @param {number} [start=0] - Optional starting offset for gap.
 * @param {boolean} [divide=false] - If `true` it will divide the snapped value by the gap before returning.
 *
 * @return {number} The snapped value.
 */
var SnapFloor = function (value, gap, start, divide)
{
    if (start === undefined) { start = 0; }

    if (gap === 0)
    {
        return value;
    }

    value -= start;
    value = gap * Math.floor(value / gap);

    return (divide) ? (start + value) / gap : start + value;
};

module.exports = SnapFloor;
