/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var SpliceOne = require('./SpliceOne');

/**
 * Removes the item from the given position in the array.
 *
 * The array is modified in-place.
 *
 * You can optionally specify a callback to be invoked for the item if it is successfully removed from the array.
 *
 * @function Phaser.Utils.Array.RemoveAt
 * @since 3.4.0
 *
 * @param {array} array - The array to be modified.
 * @param {number} index - The array index to remove the item from. The index must be in bounds or it will throw an error.
 * @param {function} [callback] - A callback to be invoked for the item removed from the array.
 * @param {object} [context] - The context in which the callback is invoked.
 *
 * @return {*} The item that was removed.
 */
var RemoveAt = function (array, index, callback, context)
{
    if (context === undefined) { context = array; }

    if (index < 0 || index > array.length - 1)
    {
        throw new Error('Index out of bounds');
    }

    var item = SpliceOne(array, index);

    if (callback)
    {
        callback.call(context, item);
    }

    return item;
};

module.exports = RemoveAt;
