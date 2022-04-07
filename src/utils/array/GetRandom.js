/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2022 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Returns a Random element from the array.
 *
 * @function Phaser.Utils.Array.GetRandom
 * @since 3.0.0
 *
 * @param {array} array - The array to select the random entry from.
 * @param {number} [startIndex=0] - An optional start index.
 * @param {number} [length=array.length] - An optional length, the total number of elements (from the startIndex) to choose from.
 *
 * @return {*} A random element from the array, or `null` if no element could be found in the range given.
 */
var GetRandom = function (array, startIndex, length)
{
    if (startIndex === undefined) { startIndex = 0; }
    if (length === undefined) { length = array.length; }

    var randomIndex = startIndex + Math.floor(Math.random() * length);

    return (array[randomIndex] === undefined) ? null : array[randomIndex];
};

module.exports = GetRandom;
