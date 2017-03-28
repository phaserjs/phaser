var Angle = function (items, value)
{
    for (var i = 0; i < items.length; i++)
    {
        items[i].angle += value;
    }

    return items;
};

module.exports = Angle;
