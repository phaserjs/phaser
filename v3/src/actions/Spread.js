var Spread = function (items, property, min, max)
{
    var step = Math.abs(max - min) / items.length;

    for (var i = 0; i < items.length; i++)
    {
        var item = items[i];

        item[property] = i * step;
    }

    return items;
};

module.exports = Spread;
