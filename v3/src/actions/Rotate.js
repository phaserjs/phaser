var Rotate = function (items, value, step)
{
    if (step === undefined) { step = 0; }

    for (var i = 0; i < items.length; i++)
    {
        items[i].rotation += value + (i * step);
    }

    return items;
};

module.exports = Rotate;
