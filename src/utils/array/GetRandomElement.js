/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * [description]
 *
 * @function Phaser.Utils.Array.GetRandomElement
 * @since 3.0.0
 *
 * @param {array} array - The array to select the random entry from.
 * @param {integer} [start=0] - [description]
 * @param {integer} [length=array.length] - [description]
 *
 * @return {object} A random element from the array, or `null` if no element could be found in the range given.
 */
var GetRandomElement = function (array, start, length)
{
    if (start === undefined) { start = 0; }
    if (length === undefined) { length = array.length; }

    var randomIndex = start + Math.floor(Math.random() * length);

    return (array[randomIndex] === undefined) ? null : array[randomIndex];
};

module.exports = GetRandomElement;
