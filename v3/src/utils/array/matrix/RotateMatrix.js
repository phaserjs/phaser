var CheckMatrix = require('./CheckMatrix');
var TransposeMatrix = require('./TransposeMatrix');

/**
* Rotates the given matrix (array of arrays).
*
* Based on the routine from {@link http://jsfiddle.net/MrPolywhirl/NH42z/}.
*
* @method
* @param {Array<any[]>} matrix - The array to rotate; this matrix _may_ be altered.
* @param {number|string} direction - The amount to rotate: the rotation in degrees (90, -90, 270, -270, 180) or a string command ('rotateLeft', 'rotateRight' or 'rotate180').
* @return {Array<any[]>} The rotated matrix. The source matrix should be discarded for the returned matrix.
*/
var RotateMatrix = function (matrix, direction)
{
    if (direction === undefined) { direction = 90; }

    if (!CheckMatrix(matrix))
    {
        return null;
    }

    if (typeof direction !== 'string')
    {
        direction = ((direction % 360) + 360) % 360;
    }

    if (direction === 90 || direction === -270 || direction === 'rotateLeft')
    {
        matrix = TransposeMatrix(matrix);
        matrix = matrix.reverse();
    }
    else if (direction === -90 || direction === 270 || direction === 'rotateRight')
    {
        matrix = matrix.reverse();
        matrix = TransposeMatrix(matrix);
    }
    else if (Math.abs(direction) === 180 || direction === 'rotate180')
    {
        for (var i = 0; i < matrix.length; i++)
        {
            matrix[i].reverse();
        }

        matrix = matrix.reverse();
    }

    return matrix;
};

module.exports = RotateMatrix;
