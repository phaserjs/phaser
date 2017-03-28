var SetY = function (items, value, step)
{
    if (step === undefined) { step = 0; }

    for (var i = 0; i < items.length; i++)
    {
        items[i].y = value + (i * step);
    }

    return items;
};

module.exports = SetY;
