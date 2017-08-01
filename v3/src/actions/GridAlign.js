var CONST = require('../utils/align/const');
var AlignIn = require('../utils/align/AlignIn');
var Zone = require('../gameobjects/zone/Zone');
var GetValue = require('../utils/object/GetValue');

var tempZone = new Zone({ sys: { sortChildrenFlag: false }}, 0, 0, 1, 1);

var GridAlign = function (items, options)
{
    var width = GetValue(options, 'width', -1);
    var height = GetValue(options, 'height', -1);
    var cellWidth = GetValue(options, 'cellWidth', 1);
    var cellHeight = GetValue(options, 'cellHeight', cellWidth);
    var position = GetValue(options, 'position', CONST.TOP_LEFT);
    var x = GetValue(options, 'x', 0);
    var y = GetValue(options, 'y', 0);
    // var centerX = GetValue(options, 'centerX', null);
    // var centerY = GetValue(options, 'centerY', null);

    var cx = 0;
    var cy = 0;
    var w = (width * cellWidth);
    var h = (height * cellHeight);

    //  If the Grid is centered on a position then we need to calculate it now
    // if (centerX !== null && centerY !== null)
    // {
        // 
    // }

    tempZone.setPosition(x, y);
    tempZone.setSize(cellWidth, cellHeight);

    for (var i = 0; i < items.length; i++)
    {
        AlignIn(items[i], tempZone, position);

        if (width === -1)
        {
            //  We keep laying them out horizontally until we've done them all
            cy += cellHeight;
            tempZone.y += cellHeight;

            if (cy === h)
            {
                cy = 0;
                tempZone.x += cellWidth;
                tempZone.y = y;
            }
        }
        else if (height === -1)
        {
            //  We keep laying them out vertically until we've done them all
            cx += cellWidth;
            tempZone.x += cellWidth;

            if (cx === w)
            {
                cx = 0;
                tempZone.x = x;
                tempZone.y += cellHeight;
            }
        }
        else
        {
            //  We keep laying them out until we hit the column limit
            cx += cellWidth;
            tempZone.x += cellWidth;

            if (cx === w)
            {
                cx = 0;
                cy += cellHeight;
                tempZone.x = x;
                tempZone.y += cellHeight;

                if (cy === h)
                {
                    //  We've hit the column limit, so return, even if there are items left
                    break;
                }
            }
        }
    }

    return items;
};

module.exports = GridAlign;
