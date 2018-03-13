/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * [description]
 *
 * @function Phaser.Utils.Array.FindClosestInSorted
 * @since 3.0.0
 *
 * @param {number} value - The value to search for in the array.
 * @param {array} array - The array to search, which must be sorted.
 *
 * @return {number} The nearest value found in the array.
 */
var FindClosestInSorted = function (value, array)
{
    if (!array.length)
    {
        return NaN;
    }
    else if (array.length === 1 || value < array[0])
    {
        return array[0];
    }

    var i = 1;

    while (array[i] < value)
    {
        i++;
    }

    var low = array[i - 1];
    var high = (i < array.length) ? array[i] : Number.POSITIVE_INFINITY;

    return ((high - value) <= (value - low)) ? high : low;
};

module.exports = FindClosestInSorted;
