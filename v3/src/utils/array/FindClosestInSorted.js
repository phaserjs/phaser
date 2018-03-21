/**
* Snaps a value to the nearest value in an array.
* The result will always be in the range `[first_value, last_value]`.
*
* @method
* @param {number} value - The search value
* @param {number[]} arr - The input array which _must_ be sorted.
* @return {number} The nearest value found.
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
