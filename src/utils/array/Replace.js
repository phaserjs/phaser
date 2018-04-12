/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * Replaces an element of the array with the new element.
 * The new element cannot already be a member of the array.
 * The array is modified in-place.
 *
 * @function Phaser.Utils.Array.Replace
 * @since 3.4.0
 *
 * @param {*} oldChild - The element in the array that will be replaced.
 * @param {*} newChild - The element to be inserted into the array at the position of `oldChild`.
 *
 * @return {boolean} Returns true if the oldChild was successfully replaced, otherwise returns false.
 */
var Replace = function (array, oldChild, newChild)
{
    var index1 = array.indexOf(oldChild);
    var index2 = array.indexOf(newChild);

    if (index1 !== -1 && index2 === -1)
    {
        array[index1] = newChild;

        return true;
    }
    else
    {
        return false;
    }
};

module.exports = Replace;
