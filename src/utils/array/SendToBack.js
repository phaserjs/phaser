/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Moves the given element to the bottom of the array (index 0), shifting all other
 * elements up by one position. The array is modified in-place. If the element is not
 * found in the array, or is already at index 0, the array is left unchanged.
 *
 * @function Phaser.Utils.Array.SendToBack
 * @since 3.4.0
 *
 * @param {array} array - The array to search and modify.
 * @param {*} item - The element to move to the bottom of the array.
 *
 * @return {*} The element that was moved.
 */
var SendToBack = function (array, item)
{
    var currentIndex = array.indexOf(item);

    if (currentIndex !== -1 && currentIndex > 0)
    {
        array.splice(currentIndex, 1);
        array.unshift(item);
    }

    return item;
};

module.exports = SendToBack;
