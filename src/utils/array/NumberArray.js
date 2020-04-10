/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Create an array representing the range of numbers (usually integers), between, and inclusive of,
 * the given `start` and `end` arguments. For example:
 *
 * `var array = numberArray(2, 4); // array = [2, 3, 4]`
 * `var array = numberArray(0, 9); // array = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]`
 *
 * This is equivalent to `numberArrayStep(start, end, 1)`.
 *
 * You can optionally provide a prefix and / or suffix string. If given the array will contain
 * strings, not integers. For example:
 *
 * `var array = numberArray(1, 4, 'Level '); // array = ["Level 1", "Level 2", "Level 3", "Level 4"]`
 * `var array = numberArray(5, 7, 'HD-', '.png'); // array = ["HD-5.png", "HD-6.png", "HD-7.png"]`
 *
 * @function Phaser.Utils.Array.NumberArray
 * @since 3.0.0
 *
 * @param {number} start - The minimum value the array starts with.
 * @param {number} end - The maximum value the array contains.
 * @param {string} [prefix] - Optional prefix to place before the number. If provided the array will contain strings, not integers.
 * @param {string} [suffix] - Optional suffix to place after the number. If provided the array will contain strings, not integers.
 *
 * @return {(number[]|string[])} The array of number values, or strings if a prefix or suffix was provided.
 */
var NumberArray = function (start, end, prefix, suffix)
{
    var result = [];

    for (var i = start; i <= end; i++)
    {
        if (prefix || suffix)
        {
            var key = (prefix) ? prefix + i.toString() : i.toString();

            if (suffix)
            {
                key = key.concat(suffix);
            }

            result.push(key);
        }
        else
        {
            result.push(i);
        }
    }

    return result;
};

module.exports = NumberArray;
