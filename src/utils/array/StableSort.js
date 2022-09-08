/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @author       Angry Bytes (and contributors)
 * @copyright    2022 Photon Storm Ltd.
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

    return array.sort(compare);
};

module.exports = StableSort;
