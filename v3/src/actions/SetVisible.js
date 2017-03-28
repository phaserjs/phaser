var SetVisible = function (items, value)
{
    for (var i = 0; i < items.length; i++)
    {
        items[i].visible = value;
    }

    return items;
};

module.exports = SetVisible;
