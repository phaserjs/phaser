var SetBlendMode = function (items, value)
{
    for (var i = 0; i < items.length; i++)
    {
        items[i].setBlendMode(value);
    }

    return items;
};

module.exports = SetBlendMode;
