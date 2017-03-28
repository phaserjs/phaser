var Rotate = function (items, value)
{
    for (var i = 0; i < items.length; i++)
    {
        items[i].rotation += value;
    }

    return items;
};

module.exports = Rotate;
