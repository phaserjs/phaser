var SetXY = function (items, x, y, stepX, stepY)
{
    if (stepX === undefined) { stepX = 0; }
    if (stepY === undefined) { stepY = 0; }

    for (var i = 0; i < items.length; i++)
    {
        items[i].x = x + (i * stepX);
        items[i].y = y + (i * stepY);
    }

    return items;
};

module.exports = SetXY;
