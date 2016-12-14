var SpliceOne = require('./SpliceOne');

/**
* Removes a random object from the given array and returns it.
*
* Will return null if there are no array items that fall within the specified range
* or if there is no item for the randomly chosen index.
*
* @method
* @param {any[]} objects - An array of objects.
* @param {integer} startIndex - Optional offset off the front of the array. Default value is 0, or the beginning of the array.
* @param {integer} length - Optional restriction on the number of values you want to randomly select from.
* @return {object} The random object that was removed.
*/

var RemoveRandomElement = function (array, start, length)
{
    if (start === undefined) { start = 0; }
    if (length === undefined) { length = array.length; }

    var randomIndex = start + Math.floor(Math.random() * length);

    return SpliceOne(array, randomIndex);
};

module.exports = RemoveRandomElement;
