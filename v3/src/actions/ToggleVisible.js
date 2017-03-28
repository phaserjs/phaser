var ToggleVisible = function (items)
{
    for (var i = 0; i < items.length; i++)
    {
        items[i].visible = !items[i].visible;
    }

    return items;
};

module.exports = ToggleVisible;
