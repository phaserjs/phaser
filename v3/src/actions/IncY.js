var IncY = function (items, value)
{
    for (var i = 0; i < items.length; i++)
    {
        items[i].y += value;
    }

    return items;
};

module.exports = IncY;
