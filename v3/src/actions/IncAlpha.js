var IncAlpha = function (items, value)
{
    for (var i = 0; i < items.length; i++)
    {
        items[i].alpha += value;
    }

    return items;
};

module.exports = IncAlpha;
