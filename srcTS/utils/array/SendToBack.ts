/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * Moves the given element to the bottom of the array.
 * The array is modified in-place.
 *
 * @function Phaser.Utils.Array.SendToBack
 * @since 3.4.0
 *
 * @param {array} array - The array.
 * @param {*} item - The element to move.
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
