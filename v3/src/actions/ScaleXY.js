var ScaleXY = function (items, x, y)
{
    for (var i = 0; i < items.length; i++)
    {
        items[i].scaleX += x;
        items[i].scaleY += y;
    }

    return items;
};

module.exports = ScaleXY;
