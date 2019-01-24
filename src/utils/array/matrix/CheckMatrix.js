/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * Checks if an array can be used as a matrix.
 *
 * A matrix is a two-dimensional array (array of arrays), where all sub-arrays (rows) have the same length. There must be at least two rows:
 *
 * ```
 *    [
 *        [ 1, 1, 1, 1, 1, 1 ],
 *        [ 2, 0, 0, 0, 0, 4 ],
 *        [ 2, 0, 1, 2, 0, 4 ],
 *        [ 2, 0, 3, 4, 0, 4 ],
 *        [ 2, 0, 0, 0, 0, 4 ],
 *        [ 3, 3, 3, 3, 3, 3 ]
 *    ]
 * ```
 *
 * @function Phaser.Utils.Array.Matrix.CheckMatrix
 * @since 3.0.0
 *
 * @param {array} matrix - The array to check.
 *
 * @return {boolean} `true` if the given `matrix` array is a valid matrix.
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
