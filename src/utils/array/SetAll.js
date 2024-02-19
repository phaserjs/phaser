/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var SafeRange = require('./SafeRange');

/**
 * Scans the array for elements with the given property. If found, the property is set to the `value`.
 *
 * For example: `SetAll('visible', true)` would set all elements that have a `visible` property to `false`.
 *
 * Optionally you can specify a start and end index. For example if the array had 100 elements,
 * and you set `startIndex` to 0 and `endIndex` to 50, it would update only the first 50 elements.
 *
 * @function Phaser.Utils.Array.SetAll
 * @since 3.4.0
 *
 * @param {array} array - The array to search.
 * @param {string} property - The property to test for on each array element.
 * @param {*} value - The value to set the property to.
 * @param {number} [startIndex] - An optional start index to search from.
 * @param {number} [endIndex] - An optional end index to search to.
 *
 * @return {array} The input array.
 */
var SetAll = function (array, property, value, startIndex, endIndex)
{
    if (startIndex === undefined) { startIndex = 0; }
    if (endIndex === undefined) { endIndex = array.length; }

    if (SafeRange(array, startIndex, endIndex))
    {
        for (var i = startIndex; i < endIndex; i++)
        {
            var entry = array[i];

            if (entry.hasOwnProperty(property))
            {
                entry[property] = value;
            }
        }
    }

    return array;
};

module.exports = SetAll;
