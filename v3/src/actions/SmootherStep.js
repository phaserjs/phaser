var MathSmootherStep = require('../math/SmootherStep');

var SmootherStep = function (items, property, min, max)
{
    var step = Math.abs(max - min) / items.length;

    for (var i = 0; i < items.length; i++)
    {
        var item = items[i];

        item[property] = MathSmootherStep(i * step, min, max);
    }

    return items;
};

module.exports = SmootherStep;
