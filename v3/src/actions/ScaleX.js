var ScaleX = function (items, value)
{
    for (var i = 0; i < items.length; i++)
    {
        items[i].scaleX += value;
    }

    return items;
};

module.exports = ScaleX;
