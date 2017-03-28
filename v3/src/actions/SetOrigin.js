var SetOrigin = function (items, x, y)
{
    for (var i = 0; i < items.length; i++)
    {
        items[i].setOrigin(x, y);
    }

    return items;
};

module.exports = SetOrigin;
