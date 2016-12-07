/**
* A Matrix is simply an array of arrays, where each sub-array (the rows) have the same length:
*
* let matrix2 = [
*    [ 1, 1, 1, 1, 1, 1 ],
*    [ 2, 0, 0, 0, 0, 4 ],
*    [ 2, 0, 1, 2, 0, 4 ],
*    [ 2, 0, 3, 4, 0, 4 ],
*    [ 2, 0, 0, 0, 0, 4 ],
*    [ 3, 3, 3, 3, 3, 3 ]
*];
*/
var CheckMatrix = function (matrix)
{
    if (!Array.isArray(matrix) || matrix.length < 2 || !Array.isArray(matrix[0]))
    {
        return false;
    }

    //  How long is the first row?
    var size = matrix[0].length;

    //  Validate the rest of the rows are the same length
    for (var i = 1; i < matrix.length; i++)
    {
        if (matrix[i].length !== size)
        {
            return false;
        }
    }

    return true;
};

module.exports = CheckMatrix;
