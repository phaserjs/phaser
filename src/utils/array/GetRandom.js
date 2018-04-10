/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * Returns a Random element from the array.
 *
 * @function Phaser.Utils.Array.GetRandom
 * @since 3.0.0
 *
 * @param {array} array - The array to select the random entry from.
 * @param {integer} [startIndex=0] - An optional start index.
 * @param {integer} [length=array.length] - An optional length, the total number of elements (from the startIndex) to choose from.
 *
 * @return {object} A random element from the array, or `null` if no element could be found in the range given.
 */
var GetRandom = function (array, startIndex, length)
{
    if (startIndex === undefined) { startIndex = 0; }
    if (length === undefined) { length = array.length; }

    var randomIndex = startIndex + Math.floor(Math.random() * length);

    return (array[randomIndex] === undefined) ? null : array[randomIndex];
};

module.exports = GetRandom;
