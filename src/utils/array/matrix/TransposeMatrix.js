/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * Transposes the elements of the given matrix (array of arrays).
 *
 * The transpose of a matrix is a new matrix whose rows are the columns of the original.
 *
 * @function Phaser.Utils.Array.Matrix.TransposeMatrix
 * @since 3.0.0
 *
 * @param {array} array - The array matrix to transpose.
 *
 * @return {array} A new array matrix which is a transposed version of the given array.
 */
var TransposeMatrix = function (array)
{
    var sourceRowCount = array.length;
    var sourceColCount = array[0].length;

    var result = new Array(sourceColCount);

    for (var i = 0; i < sourceColCount; i++)
    {
        result[i] = new Array(sourceRowCount);

        for (var j = sourceRowCount - 1; j > -1; j--)
        {
            result[i][j] = array[j][i];
        }
    }

    return result;
};

module.exports = TransposeMatrix;
