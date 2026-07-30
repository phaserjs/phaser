/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var AlignIn = require('../display/align/in/QuickSet');
var CONST = require('../display/align/const');
var GetFastValue = require('../utils/object/GetFastValue');
var NOOP = require('../utils/NOOP');
var Zone = require('../gameobjects/zone/Zone');

var tempZone = new Zone({ sys: { queueDepthSort: NOOP, events: { once: NOOP } } }, 0, 0, 1, 1).setOrigin(0, 0);

/**
 * Takes an array of Game Objects, or any objects that have public `x` and `y` properties,
 * and positions them in a grid layout based on the configuration provided.
 *
 * The grid is defined by a `width` (number of columns) and/or `height` (number of rows).
 * Each cell in the grid has a size defined by `cellWidth` and `cellHeight`, in pixels.
 * Items are placed into cells starting from the top-left origin (`x`, `y`) and filling
 * left-to-right, top-to-bottom by default. If only `width` is set to -1, items are laid
 * out in a single horizontal row. If only `height` is set to -1, items are laid out in a
 * single vertical column. When both `width` and `height` are set, the grid fills
 * row-by-row, stopping early if the grid is full before all items have been placed.
 *
 * The `position` option controls how each item is aligned within its cell, using one of
 * the `Phaser.Display.Align` constants such as `CENTER` or `TOP_LEFT`.
 *
 * @function Phaser.Actions.GridAlign
 * @since 3.0.0
 *
 * @generic {Phaser.GameObjects.GameObject[]} G - [items,$return]
 *
 * @param {(array|Phaser.GameObjects.GameObject[])} items - The array of items to be updated by this action.
 * @param {Phaser.Types.Actions.GridAlignConfig} options - The GridAlign Configuration object.
 *
 * @return {(array|Phaser.GameObjects.GameObject[])} The array of objects that were passed to this Action.
 */
var GridAlign = function (items, options)
{
    if (options === undefined) { options = {}; }

    var widthSet = options.hasOwnProperty('width');
    var heightSet = options.hasOwnProperty('height');

    var width = GetFastValue(options, 'width', -1);
    var height = GetFastValue(options, 'height', -1);

    var cellWidth = GetFastValue(options, 'cellWidth', 1);
    var cellHeight = GetFastValue(options, 'cellHeight', cellWidth);

    var position = GetFastValue(options, 'position', CONST.TOP_LEFT);
    var x = GetFastValue(options, 'x', 0);
    var y = GetFastValue(options, 'y', 0);

    var cx = 0;
    var cy = 0;
    var w = (width * cellWidth);
    var h = (height * cellHeight);

    tempZone.setPosition(x, y);
    tempZone.setSize(cellWidth, cellHeight);

    for (var i = 0; i < items.length; i++)
    {
        AlignIn(items[i], tempZone, position);

        if (widthSet && width === -1)
        {
            //  We keep laying them out horizontally until we've done them all
            tempZone.x += cellWidth;
        }
        else if (heightSet && height === -1)
        {
            //  We keep laying them out vertically until we've done them all
            tempZone.y += cellHeight;
        }
        else if (heightSet && !widthSet)
        {
            //  We keep laying them out until we hit the column limit
            cy += cellHeight;
            tempZone.y += cellHeight;

            if (cy === h)
            {
                cy = 0;
                cx += cellWidth;
                tempZone.y = y;
                tempZone.x += cellWidth;

                if (cx === w)
                {
                    //  We've hit the column limit, so return, even if there are items left
                    break;
                }
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
