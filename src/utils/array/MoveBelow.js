/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2022 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Moves the given array element below another one in the array.
 * The array is modified in-place.
 *
 * @function Phaser.Utils.Array.MoveBelow
 * @since 3.55.0
 *
 * @param {array} array - The input array.
 * @param {*} item1 - The element to move below base element.
 * @param {*} item2 - The base element.
 *
 *
 * @return {array} The input array.
 */
var MoveBelow = function (array, item1, item2)
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

    if (currentIndex < baseIndex)
    {
        // item1 is already below item2
        return array;
    }

    //  Remove
    array.splice(currentIndex, 1);

    //  Add in new location
    if (baseIndex === 0)
    {
        array.unshift(item1);
    }
    else
    {
        array.splice(baseIndex, 0, item1);
    }

    return array;
};

module.exports = MoveBelow;
