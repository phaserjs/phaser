var GetPointsOnLine = require('../geom/line/GetPointsOnLine');

/**
 * [description]
 *
 * @function Phaser.Actions.PlaceOnLine
 * @since 3.0.0
 * 
 * @param {array} items - An array of Game Objects. The contents of this array are updated by this Action.
 * @param {Phaser.Geom.Line} line - [description]
 *
 * @return {array} The array of Game Objects that was passed to this Action.
 */
var PlaceOnLine = function (items, line)
{
    var points = GetPointsOnLine(line);
    var step = points.length / items.length;
    var p = 0;

    for (var i = 0; i < items.length; i++)
    {
        var item = items[i];
        var point = points[Math.floor(p)];

        item.x = point[0];
        item.y = point[1];

        p += step;
    }

    return items;
};

module.exports = PlaceOnLine;
