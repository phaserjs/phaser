var IncX = function (items, value)
{
    for (var i = 0; i < items.length; i++)
    {
        items[i].x += value;
    }

    return items;
};

module.exports = IncX;
