/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Moves the element at the start of the array to the end, shifting all items in the process.
 * The "rotation" happens to the left.
 *
 * @function Phaser.Utils.Array.RotateLeft
 * @since 3.0.0
 *
 * @param {array} array - The array to shift to the left. This array is modified in place.
 * @param {number} [total=1] - The number of times to shift the array.
 *
 * @return {*} The most recently shifted element.
 */
var RotateLeft = function (array, total)
{
    if (total === undefined) { total = 1; }

    var element = null;

    for (var i = 0; i < total; i++)
    {
        element = array.shift();
        array.push(element);
    }

    return element;
};

module.exports = RotateLeft;
