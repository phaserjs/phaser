/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Searches a pre-sorted array for the closet value to the given number.
 *
 * If the `key` argument is given it will assume the array contains objects that all have the required `key` property name,
 * and will check for the closest value of those to the given number.
 *
 * @function Phaser.Utils.Array.FindClosestInSorted
 * @since 3.0.0
 *
 * @param {number} value - The value to search for in the array.
 * @param {array} array - The array to search, which must be sorted.
 * @param {string} [key] - An optional property key. If specified the array elements property will be checked against value.
 *
 * @return {(number|any)} The nearest value found in the array, or if a `key` was given, the nearest object with the matching property value.
 */
var FindClosestInSorted = function (value, array, key)
{
    if (!array.length)
    {
        return NaN;
    }
    else if (array.length === 1)
    {
        return array[0];
    }

    var i = 1;
    var low;
    var high;

    if (key)
    {
        if (value < array[0][key])
        {
            return array[0];
        }

        while (array[i][key] < value)
        {
            i++;
        }
    }
    else
    {
        while (array[i] < value)
        {
            i++;
        }
    }

    if (i > array.length)
    {
        i = array.length;
    }

    if (key)
    {
        low = array[i - 1][key];
        high = array[i][key];

        return ((high - value) <= (value - low)) ? array[i] : array[i - 1];
    }
    else
    {
        low = array[i - 1];
        high = array[i];

        return ((high - value) <= (value - low)) ? high : low;
    }
};

module.exports = FindClosestInSorted;
