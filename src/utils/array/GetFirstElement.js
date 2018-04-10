/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * Returns the first element from the array which optionally has a property matching the given value.
 *
 * @function Phaser.Utils.Array.GetFirstElement
 * @since 3.4.0
 *
 * @param {array} array - The array to search.
 * @param {string} property - The property to test on each array element.
 * @param {*} value - The value to test the property against. Must pass a strict (`===`) comparison check.
 * @param {integer} [startIndex=0] - An optional start index to search from.
 * @param {integer} [endIndex=array.length] - An optional end index to search up to (but not included)
 *
 * @return {object} The first matching element from the array, or `null` if no element could be found in the range given.
 */
var GetFirstElement = function (array, property, value, startIndex, endIndex)
{
    if (startIndex === undefined) { startIndex = 0; }
    if (endIndex === undefined) { endIndex = array.length; }

    for (var i = startIndex; i < endIndex; i++)
    {
        var child = array[i];

        if (!property || child[property] === value)
        {
            return child;
        }
    }

    return null;
};

module.exports = GetFirstElement;
