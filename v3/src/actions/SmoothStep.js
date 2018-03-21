var MathSmoothStep = require('../math/SmoothStep');

var SmoothStep = function (items, property, min, max, inc)
{
    if (inc === undefined) { inc = false; }

    var step = Math.abs(max - min) / items.length;
    var i;

    if (inc)
    {
        for (i = 0; i < items.length; i++)
        {
            items[i][property] += MathSmoothStep(i * step, min, max);
        }
    }
    else
    {
        for (i = 0; i < items.length; i++)
        {
            items[i][property] = MathSmoothStep(i * step, min, max);
        }
    }

    return items;
};

module.exports = SmoothStep;
