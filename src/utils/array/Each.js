/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2022 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Passes each element in the array to the given callback.
 *
 * @function Phaser.Utils.Array.Each
 * @since 3.4.0
 *
 * @param {array} array - The array to search.
 * @param {function} callback - A callback to be invoked for each item in the array.
 * @param {object} context - The context in which the callback is invoked.
 * @param {...*} [args] - Additional arguments that will be passed to the callback, after the current array item.
 *
 * @return {array} The input array.
 */
var Each = function (array, callback, context)
{
    var i;
    var args = [ null ];

    for (i = 3; i < arguments.length; i++)
    {
        args.push(arguments[i]);
    }

    for (i = 0; i < array.length; i++)
    {
        args[0] = array[i];

        callback.apply(context, args);
    }

    return array;
};

module.exports = Each;
