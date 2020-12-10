/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var SpliceOne = require('./SpliceOne');

/**
 * Removes the given item, or array of items, from the array.
 *
 * The array is modified in-place.
 *
 * You can optionally specify a callback to be invoked for each item successfully removed from the array.
 *
 * @function Phaser.Utils.Array.Remove
 * @since 3.4.0
 *
 * @param {array} array - The array to be modified.
 * @param {*|Array.<*>} item - The item, or array of items, to be removed from the array.
 * @param {function} [callback] - A callback to be invoked for each item successfully removed from the array.
 * @param {object} [context] - The context in which the callback is invoked.
 *
 * @return {*|Array.<*>} The item, or array of items, that were successfully removed from the array.
 */
var Remove = function (array, item, callback, context)
{
    if (context === undefined) { context = array; }

    var index;

    //  Fast path to avoid array mutation and iteration
    if (!Array.isArray(item))
    {
        index = array.indexOf(item);

        if (index !== -1)
        {
            SpliceOne(array, index);

            if (callback)
            {
                callback.call(context, item);
            }

            return item;
        }
        else
        {
            return null;
        }
    }

    //  If we got this far, we have an array of items to remove

    var itemLength = item.length - 1;
    var removed = [];

    while (itemLength >= 0)
    {
        var entry = item[itemLength];

        index = array.indexOf(entry);

        if (index !== -1)
        {
            SpliceOne(array, index);

            removed.push(entry);

            if (callback)
            {
                callback.call(context, entry);
            }
        }

        itemLength--;
    }

    return removed;
};

module.exports = Remove;
