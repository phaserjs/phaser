/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @author       Angry Bytes (and contributors)
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The comparator function.
 *
 * @ignore
 *
 * @param {*} a - The first item to test.
 * @param {*} b - The second itemt to test.
 *
 * @return {boolean} True if they localCompare, otherwise false.
 */
function Compare (a, b)
{
    return String(a).localeCompare(b);
}

/**
 * Process the array contents.
 *
 * @ignore
 *
 * @param {array} array - The array to process.
 * @param {function} compare - The comparison function.
 *
 * @return {array} - The processed array.
 */
function Process (array, compare)
{
    // Short-circuit when there's nothing to sort.
    var len = array.length;

    if (len <= 1)
    {
        return array;
    }

    // Rather than dividing input, simply iterate chunks of 1, 2, 4, 8, etc.
    // Chunks are the size of the left or right hand in merge sort.
    // Stop when the left-hand covers all of the array.
    var buffer = new Array(len);

    for (var chk = 1; chk < len; chk *= 2)
    {
        RunPass(array, compare, chk, buffer);

        var tmp = array;

        array = buffer;

        buffer = tmp;
    }

    return array;
}

/**
 * Run a single pass with the given chunk size.
 *
 * @ignore
 *
 * @param {array} arr - The array to run the pass on.
 * @param {function} comp - The comparison function.
 * @param {number} chk - The number of iterations.
 * @param {array} result - The array to store the result in.
 */
function RunPass (arr, comp, chk, result)
{
    var len = arr.length;
    var i = 0;

    // Step size / double chunk size.
    var dbl = chk * 2;

    // Bounds of the left and right chunks.
    var l, r, e;

    // Iterators over the left and right chunk.
    var li, ri;

    // Iterate over pairs of chunks.
    for (l = 0; l < len; l += dbl)
    {
        r = l + chk;
        e = r + chk;

        if (r > len)
        {
            r = len;
        }

        if (e > len)
        {
            e = len;
        }

        // Iterate both chunks in parallel.
        li = l;
        ri = r;

        while (true)
        {
            // Compare the chunks.
            if (li < r && ri < e)
            {
                // This works for a regular `sort()` compatible comparator,
                // but also for a simple comparator like: `a > b`
                if (comp(arr[li], arr[ri]) <= 0)
                {
                    result[i++] = arr[li++];
                }
                else
                {
                    result[i++] = arr[ri++];
                }
            }
            else if (li < r)
            {
                // Nothing to compare, just flush what's left.
                result[i++] = arr[li++];
            }
            else if (ri < e)
            {
                result[i++] = arr[ri++];
            }
            else
            {
                // Both iterators are at the chunk ends.
                break;
            }
        }
    }
}

/**
 * An in-place stable array sort, because `Array#sort()` is not guaranteed stable.
 *
 * This is an implementation of merge sort, without recursion.
 *
 * Function based on the Two-Screen/stable sort 0.1.8 from https://github.com/Two-Screen/stable
 *
 * @function Phaser.Utils.Array.StableSort
 * @since 3.0.0
 *
 * @param {array} array - The input array to be sorted.
 * @param {function} [compare] - The comparison function.
 *
 * @return {array} The sorted result.
 */
var StableSort = function (array, compare)
{
    if (compare === undefined) { compare = Compare; }

    var result = Process(array, compare);

    // This simply copies back if the result isn't in the original array, which happens on an odd number of passes.
    if (result !== array)
    {
        RunPass(result, null, array.length, array);
    }

    return array;
};

module.exports = StableSort;
