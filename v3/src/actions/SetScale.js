var SetScale = function (items, x, y, stepX, stepY)
{
    if (stepX === undefined) { stepX = 0; }
    if (stepY === undefined) { stepY = 0; }

    for (var i = 0; i < items.length; i++)
    {
        items[i].setScale(
            x + (i * stepX),
            y + (i * stepY)
        );
    }

    return items;
};

module.exports = SetScale;
