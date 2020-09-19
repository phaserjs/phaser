/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Transposes the elements of the given matrix (array of arrays).
 *
 * The transpose of a matrix is a new matrix whose rows are the columns of the original.
 *
 * A matrix is a two-dimensional array (array of arrays), where all sub-arrays (rows)
 * have the same length. There must be at least two rows. This is an example matrix:
 *
 * ```
 * [
 *    [ 1, 1, 1, 1, 1, 1 ],
 *    [ 2, 0, 0, 0, 0, 4 ],
 *    [ 2, 0, 1, 2, 0, 4 ],
 *    [ 2, 0, 3, 4, 0, 4 ],
 *    [ 2, 0, 0, 0, 0, 4 ],
 *    [ 3, 3, 3, 3, 3, 3 ]
 * ]
 * ```
 *
 * @function Phaser.Utils.Array.Matrix.TransposeMatrix
 * @since 3.0.0
 *
 * @generic T
 * @genericUse {T[][]} - [array,$return]
 *
 * @param {T[][]} [array] - The array matrix to transpose.
 *
 * @return {T[][]} A new array matrix which is a transposed version of the given array.
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
