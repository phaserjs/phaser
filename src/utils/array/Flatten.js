/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Takes an array and deeply flattens it, recursively unpacking any nested arrays into
 * a single flat array. The original array is not modified. An optional output array
 * can be provided to collect the results, which is useful when calling this function
 * recursively or when appending to an existing array.
 *
 * @function Phaser.Utils.Array.Flatten
 * @since 3.60.0
 *
 * @param {array} array - The array to flatten.
 * @param {array} [output] - An array to hold the results in.
 *
 * @return {array} The flattened output array.
 */
var Flatten = function (array, output)
{
    if (output === undefined) { output = []; }

    for (var i = 0; i < array.length; i++)
    {
        if (Array.isArray(array[i]))
        {
            Flatten(array[i], output);
        }
        else
        {
            output.push(array[i]);
        }
    }

    return output;
};

module.exports = Flatten;
