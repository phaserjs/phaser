var PerimeterPoint = require('../geom/rectangle/PerimeterPoint');

var PlaceOnRectangle = function (items, rect)
{
    var angle = 0;
    var step = 360 / items.length;

    for (var i = 0; i < items.length; i++)
    {
        PerimeterPoint(rect, angle, items[i]);

        angle += step;
    }

    return items;
};

module.exports = PlaceOnRectangle;
