var Spread = function (items, property, min, max, inc)
{
    if (inc === undefined) { inc = false; }

    var step = Math.abs(max - min) / items.length;
    var i;

    if (inc)
    {
        for (i = 0; i < items.length; i++)
        {
            items[i][property] += i * step;
        }
    }
    else
    {
        for (i = 0; i < items.length; i++)
        {
            items[i][property] = i * step;
        }
    }

    return items;
};

module.exports = Spread;
