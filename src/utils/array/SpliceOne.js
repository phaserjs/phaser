/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * Removes a single item from an array and returns it without creating gc, like the native splice does.
 * Based on code by Mike Reinstein.
 *
 * @function Phaser.Utils.Array.SpliceOne
 * @since 3.0.0
 *
 * @param {array} array - The array to splice from.
 * @param {integer} index - The index of the item which should be spliced.
 *
 * @return {*} The item which was spliced (removed).
 */
var SpliceOne = function (array, index)
{
    if (index >= array.length)
    {
        return;
    }

    var len = array.length - 1;

    var item = array[index];

    for (var i = index; i < len; i++)
    {
        array[i] = array[i + 1];
    }

    array.length = len;

    return item;
};

module.exports = SpliceOne;
