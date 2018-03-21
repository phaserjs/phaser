var Random = require('../geom/rectangle/Random');

var RandomRectangle = function (items, rect)
{
    for (var i = 0; i < items.length; i++)
    {
        Random(rect, items[i]);
    }

    return items;
};

module.exports = RandomRectangle;
