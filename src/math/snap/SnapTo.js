/**
 * [description]
 *
 * @function Phaser.Math.Snap.To
 * @since 3.0.0
 *
 * @param {number} value - [description]
 * @param {number} gap - [description]
 * @param {number} [start=0] - [description]
 *
 * @return {number} [description]
 */
var SnapTo = function (value, gap, start)
{
    if (start === undefined) { start = 0; }

    if (gap === 0)
    {
        return value;
    }

    value -= start;
    value = gap * Math.round(value / gap);

    return start + value;
};

module.exports = SnapTo;
