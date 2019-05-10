/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Adds the given item, or array of items, to the array.
 *
 * Each item must be unique within the array.
 *
 * The array is modified in-place and returned.
 *
 * You can optionally specify a limit to the maximum size of the array. If the quantity of items being
 * added will take the array length over this limit, it will stop adding once the limit is reached.
 *
 * You can optionally specify a callback to be invoked for each item successfully added to the array.
 *
 * @function Phaser.Utils.Array.Add
 * @since 3.4.0
 *
 * @param {array} array - The array to be added to.
 * @param {any|any[]} item - The item, or array of items, to add to the array. Each item must be unique within the array.
 * @param {integer} [limit] - Optional limit which caps the size of the array.
 * @param {function} [callback] - A callback to be invoked for each item successfully added to the array.
 * @param {object} [context] - The context in which the callback is invoked.
 *
 * @return {array} The input array.
 */
var Add = function (array, item, limit, callback, context)
{
    if (context === undefined) { context = array; }

    if (limit > 0)
    {
        var remaining = limit - array.length;

        //  There's nothing more we can do here, the array is full
        if (remaining <= 0)
        {
            return null;
        }
    }

    //  Fast path to avoid array mutation and iteration
    if (!Array.isArray(item))
    {
        if (array.indexOf(item) === -1)
        {
            array.push(item);

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

    //  If we got this far, we have an array of items to insert

    //  Ensure all the items are unique
    var itemLength = item.length - 1;

    while (itemLength >= 0)
    {
        if (array.indexOf(item[itemLength]) !== -1)
        {
            //  Already exists in array, so remove it
            item.splice(itemLength, 1);
        }

        itemLength--;
    }

    //  Anything left?
    itemLength = item.length;

    if (itemLength === 0)
    {
        return null;
    }

    if (limit > 0 && itemLength > remaining)
    {
        item.splice(remaining);

        itemLength = remaining;
    }

    for (var i = 0; i < itemLength; i++)
    {
        var entry = item[i];

        array.push(entry);

        if (callback)
        {
            callback.call(context, entry);
        }
    }

    return item;
};

module.exports = Add;
