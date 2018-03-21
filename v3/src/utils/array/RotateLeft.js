/**
* Moves the element at the start of the array to the end, shifting all items in the process.
* The "rotation" happens to the left.
*
* @method Phaser.ArrayUtils.rotate
* @param {any[]} array - The array to shift/rotate. The array is modified.
* @param {integer} [total=1] - The number of times to shift the array. Only the most recently shifted element is returned.
* @return {any} The shifted value.
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
