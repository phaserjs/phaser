/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var SpliceOne = require('./SpliceOne');

/**
 * Removes a random object from the given array and returns it.
 * Will return null if there are no array items that fall within the specified range or if there is no item for the randomly chosen index.
 *
 * @function Phaser.Utils.Array.RemoveRandomElement
 * @since 3.0.0
 *
 * @param {array} array - The array to removed a random element from.
 * @param {integer} [start=0] - The array index to start the search from.
 * @param {integer} [length=array.length] - Optional restriction on the number of elements to randomly select from.
 *
 * @return {object} The random element that was removed, or `null` if there were no array elements that fell within the given range.
 */
var RemoveRandomElement = function (array, start, length)
{
    if (start === undefined) { start = 0; }
    if (length === undefined) { length = array.length; }

    var randomIndex = start + Math.floor(Math.random() * length);

    return SpliceOne(array, randomIndex);
};

module.exports = RemoveRandomElement;
