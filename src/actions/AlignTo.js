/**
 * @author       samme
 * @copyright    2013-2023 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var QuickSet = require('../display/align/to/QuickSet');

/**
 * Takes an array of Game Objects, or any objects that have public `x` and `y` properties, and aligns them next to each other.
 *
 * The first item isn't moved. The second item is aligned next to the first, then the third next to the second, and so on.
 *
 * @function Phaser.Actions.AlignTo
 * @since 3.22.0
 *
 * @generic {Phaser.GameObjects.GameObject[]} G - [items,$return]
 *
 * @param {(array|Phaser.GameObjects.GameObject[])} items - The array of items to be updated by this action.
 * @param {number} position - The position to align the items with. This is an align constant, such as `Phaser.Display.Align.LEFT_CENTER`.
 * @param {number} [offsetX=0] - Optional horizontal offset from the position.
 * @param {number} [offsetY=0] - Optional vertical offset from the position.
 *
 * @return {(array|Phaser.GameObjects.GameObject[])} The array of objects that were passed to this Action.
 */
var AlignTo = function (items, position, offsetX, offsetY)
{
    var target = items[0];

    for (var i = 1; i < items.length; i++)
    {
        var item = items[i];

        QuickSet(item, target, position, offsetX, offsetY);

        target = item;
    }

    return items;
};

module.exports = AlignTo;
