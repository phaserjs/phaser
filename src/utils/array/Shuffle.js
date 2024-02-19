/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Shuffles the contents of the given array using the Fisher-Yates implementation.
 *
 * The original array is modified directly and returned.
 *
 * @function Phaser.Utils.Array.Shuffle
 * @since 3.0.0
 *
 * @generic T
 * @genericUse {T[]} - [array,$return]
 *
 * @param {T[]} array - The array to shuffle. This array is modified in place.
 *
 * @return {T[]} The shuffled array.
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
