/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var SafeRange = require('./SafeRange');

/**
 * Passes each element in the array, between the start and end indexes, to the given callback.
 *
 * @function Phaser.Utils.Array.EachInRange
 * @since 3.4.0
 *
 * @param {array} array - The array to search.
 * @param {function} callback - A callback to be invoked for each item in the array.
 * @param {object} context - The context in which the callback is invoked.
 * @param {number} startIndex - The start index to search from.
 * @param {number} endIndex - The end index to search to.
 * @param {...*} [args] - Additional arguments that will be passed to the callback, after the child.
 *
 * @return {array} The input array.
 */
var EachInRange = function (array, callback, context, startIndex, endIndex)
{
    if (startIndex === undefined) { startIndex = 0; }
    if (endIndex === undefined) { endIndex = array.length; }

    if (SafeRange(array, startIndex, endIndex))
    {
        var i;
        var args = [ null ];

        for (i = 5; i < arguments.length; i++)
        {
            args.push(arguments[i]);
        }

        for (i = startIndex; i < endIndex; i++)
        {
            args[0] = array[i];

            callback.apply(context, args);
        }
    }

    return array;
};

module.exports = EachInRange;
