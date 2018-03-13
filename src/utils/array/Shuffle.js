/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * Shuffles the contents of the given array using the Fisher-Yates implementation.
 *
 * The original array is modified directly and returned.
 *
 * @function Phaser.Utils.Array.Shuffle
 * @since 3.0.0
 *
 * @param {array} array - The array to shuffle. This array is modified in place.
 *
 * @return {array} The shuffled array.
 */
var Shuffle = function (array)
{
    for (var i = array.length - 1; i > 0; i--)
    {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }

    return array;
};

module.exports = Shuffle;
