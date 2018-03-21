var IncXY = function (items, x, y)
{
    for (var i = 0; i < items.length; i++)
    {
        items[i].x += x;
        items[i].y += y;
    }

    return items;
};

module.exports = IncXY;
