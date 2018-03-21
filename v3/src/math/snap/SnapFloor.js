var SnapFloor = function (value, gap, start)
{
    if (start === undefined) { start = 0; }

    if (gap === 0)
    {
        return value;
    }

    value -= start;
    value = gap * Math.floor(value / gap);

    return start + value;
};

module.exports = SnapFloor;
