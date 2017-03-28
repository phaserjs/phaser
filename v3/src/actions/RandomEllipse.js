var Random = require('../geom/ellipse/Random');

var RandomEllipse = function (items, ellipse)
{
    for (var i = 0; i < items.length; i++)
    {
        Random(ellipse, items[i]);
    }

    return items;
};

module.exports = RandomEllipse;
