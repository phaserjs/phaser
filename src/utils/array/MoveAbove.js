/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Moves the given array element above another one in the array.
 * If the given element is already above the other, it isn't moved.
 * Above means toward the end of the array.
 * The array is modified in-place.
 *
 * @function Phaser.Utils.Array.MoveAbove
 * @since 3.55.0
 *
 * @param {array} array - The input array.
 * @param {*} item1 - The element to move above base element.
 * @param {*} item2 - The base element.
 *
 *
 * @return {array} The input array.
 */
var MoveAbove = function (array, item1, item2)
{
    if (item1 === item2)
    {
        return array;
    }

    var currentIndex = array.indexOf(item1);
    var baseIndex = array.indexOf(item2);

    if (currentIndex < 0 || baseIndex < 0)
    {
        throw new Error('Supplied items must be elements of the same array');
    }

    if (currentIndex > baseIndex)
    {
        // item1 is already above item2
        return array;
    }

    // Remove item1 from its current position
    array.splice(currentIndex, 1);

    // Recalculate baseIndex after removal
    baseIndex = array.indexOf(item2);

    // Insert item1 immediately after item2
    array.splice(baseIndex + 1, 0, item1);
    
    return array;
};

module.exports = MoveAbove;
