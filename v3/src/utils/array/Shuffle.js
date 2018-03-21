/**
* A standard Fisher-Yates Array shuffle implementation which modifies the array in place.
*
* @method
* @param {any[]} array - The array to shuffle.
* @return {any[]} The original array, now shuffled.
*/
var Shuffle = function (array)
{
    for (var i = array.length - 1; i > 0; i--)
    {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }

    return array;
};

module.exports = Shuffle;
