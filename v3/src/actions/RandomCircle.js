var Random = require('../geom/circle/Random');

var RandomCircle = function (items, circle)
{
    for (var i = 0; i < items.length; i++)
    {
        Random(circle, items[i]);
    }

    return items;
};

module.exports = RandomCircle;
