/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * Removes the item within the given range in the array.
 * 
 * The array is modified in-place.
 * 
 * You can optionally specify a callback to be invoked for the item/s successfully removed from the array.
 *
 * @function Phaser.Utils.Array.RemoveBetween
 * @since 3.4.0
 *
 * @param {array} array - The array to be modified.
 * @param {integer} startIndex - The start index to remove from.
 * @param {integer} endIndex - The end index to remove to.
 * @param {function} [callback] - A callback to be invoked for the item removed from the array.
 * @param {object} [context] - The context in which the callback is invoked.
 *
 * @return {Array.<*>} An array of items that were removed.
 */
var RemoveBetween = function (array, startIndex, endIndex, callback, context)
{
    if (context === undefined) { context = array; }

    var len = array.length;

    if (startIndex === undefined) { startIndex = 0; }
    if (endIndex === undefined) { endIndex = len; }

    if (endIndex > len)
    {
        endIndex = len;
    }

    if (startIndex < 0 || startIndex > len || startIndex >= endIndex)
    {
        throw new Error('Range Error: Values outside acceptable range');
    }

    var size = endIndex - startIndex;

    var removed = array.splice(startIndex, size);

    if (callback)
    {
        for (var i = 0; i < removed.length; i++)
        {
            var entry = removed[i];

            callback.call(context, entry);
        }
    }

    return removed;
};

module.exports = RemoveBetween;
