/**
* Moves the element at the end of the array to the start, shifting all items in the process.
* The "rotation" happens to the right.
*
* @param {any[]} array - The array to shift/rotate. The array is modified.
* @param {integer} [total=1] - The number of times to shift the array. Only the most recently shifted element is returned.
* @return {any} The shifted value.
*/
var RotateRight = function (array, total)
{
    if (total === undefined) { total = 1; }

    var element = null;

    for (var i = 0; i < total; i++)
    {
        element = array.pop();
        array.unshift(element);
    }

    return element;
};

module.exports = RotateRight;
