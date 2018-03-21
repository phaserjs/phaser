var ScaleY = function (items, value)
{
    for (var i = 0; i < items.length; i++)
    {
        items[i].scaleY += value;
    }

    return items;
};

module.exports = ScaleY;
