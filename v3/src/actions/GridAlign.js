var CONST = require('../utils/align/const');
var AlignIn = require('../utils/align/AlignIn');
var Zone = require('../gameobjects/zone/Zone');
var GetValue = require('../utils/object/GetValue');

var tempZone = new Zone({}, 0, 0, 1, 1);

/**
* This method iterates through all children in the Group (regardless if they are visible or exist)
* and then changes their position so they are arranged in a Grid formation. Children must have
* the `alignTo` method in order to be positioned by this call. All default Phaser Game Objects have
* this.
*
* The grid dimensions are determined by the first four arguments. The `width` and `height` arguments
* relate to the width and height of the grid respectively.
*
* For example if the Group had 100 children in it:
*
* `Group.align(10, 10, 32, 32)`
*
* This will align all of the children into a grid formation of 10x10, using 32 pixels per
* grid cell. If you want a wider grid, you could do:
* 
* `Group.align(25, 4, 32, 32)`
*
* This will align the children into a grid of 25x4, again using 32 pixels per grid cell.
*
* You can choose to set _either_ the `width` or `height` value to -1. Doing so tells the method
* to keep on aligning children until there are no children left. For example if this Group had
* 48 children in it, the following:
*
* `Group.align(-1, 8, 32, 32)`
*
* ... will align the children so that there are 8 children vertically (the second argument), 
* and each row will contain 6 sprites, except the last one, which will contain 5 (totaling 48)
*
* You can also do:
* 
* `Group.align(10, -1, 32, 32)`
*
* In this case it will create a grid 10 wide, and as tall as it needs to be in order to fit
* all of the children in.
*
* The `position` property allows you to control where in each grid cell the child is positioned.
* This is a constant and can be one of `Phaser.TOP_LEFT` (default), `Phaser.TOP_CENTER`, 
* `Phaser.TOP_RIGHT`, `Phaser.LEFT_CENTER`, `Phaser.CENTER`, `Phaser.RIGHT_CENTER`, 
* `Phaser.BOTTOM_LEFT`, `Phaser.BOTTOM_CENTER` or `Phaser.BOTTOM_RIGHT`.
*
* The final argument; `offset` lets you start the alignment from a specific child index.
*
* @method Phaser.Group#align
* @param {integer} width - The width of the grid in items (not pixels). Set to -1 for a dynamic width. If -1 then you must set an explicit height value.
* @param {integer} height - The height of the grid in items (not pixels). Set to -1 for a dynamic height. If -1 then you must set an explicit width value.
* @param {integer} cellWidth - The width of each grid cell, in pixels.
* @param {integer} cellHeight - The height of each grid cell, in pixels.
* @param {integer} [position] - The position constant. One of `Phaser.TOP_LEFT` (default), `Phaser.TOP_CENTER`, `Phaser.TOP_RIGHT`, `Phaser.LEFT_CENTER`, `Phaser.CENTER`, `Phaser.RIGHT_CENTER`, `Phaser.BOTTOM_LEFT`, `Phaser.BOTTOM_CENTER` or `Phaser.BOTTOM_RIGHT`.
* @return {boolean} True if the Group children were aligned, otherwise false.
*/
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
