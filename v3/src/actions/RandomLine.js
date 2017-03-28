var Random = require('../geom/line/Random');

var RandomLine = function (items, line)
{
    for (var i = 0; i < items.length; i++)
    {
        Random(line, items[i]);
    }

    return items;
};

module.exports = RandomLine;
