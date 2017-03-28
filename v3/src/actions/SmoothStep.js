var MathSmoothStep = require('../math/SmoothStep');

var SmoothStep = function (items, property, min, max)
{
    var step = Math.abs(max - min) / items.length;

    for (var i = 0; i < items.length; i++)
    {
        var item = items[i];

        item[property] = MathSmoothStep(i * step, min, max);
    }

    return items;
};

module.exports = SmoothStep;
