//  Removes a single item from an array and returns it
//  without creating gc (like the native splice does)
//  Based on code by Mike Reinstein

/**
 * [description]
 *
 * @function Phaser.Utils.Array.SpliceOne
 * @since 3.0.0
 *
 * @param {array} array - [description]
 * @param {integer} index - [description]
 *
 * @return {any} [description]
 */
var SpliceOne = function (array, index)
{
    if (index >= array.length)
    {
        return;
    }

    var len = array.length - 1;

    var item = array[index];

    for (var i = index; i < len; i++)
    {
        array[i] = array[i + 1];
    }

    array.length = len;

    return item;
};

module.exports = SpliceOne;
