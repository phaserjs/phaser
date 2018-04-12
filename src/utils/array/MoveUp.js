/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * Moves the given array element up one place in the array.
 * The array is modified in-place.
 *
 * @function Phaser.Utils.Array.MoveUp
 * @since 3.4.0
 *
 * @param {array} array - The input array.
 * @param {*} item - The element to move up the array.
 *
 * @return {array} The input array.
 */
var MoveUp = function (array, item)
{
    var currentIndex = array.indexOf(item);

    if (currentIndex !== -1 && currentIndex < array.length - 2)
    {
        var item2 = array[currentIndex + 1];

        var index2 = array.indexOf(item2);

        array[currentIndex] = item2;
        array[index2] = item;
    }

    return array;
};

module.exports = MoveUp;
