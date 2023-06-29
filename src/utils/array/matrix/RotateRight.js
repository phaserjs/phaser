/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2013-2023 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var RotateMatrix = require('./RotateMatrix');

/**
 * Rotates the array matrix to the left (or -90 degrees)
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
 * @function Phaser.Utils.Array.Matrix.RotateRight
 * @since 3.0.0
 *
 * @generic T
 * @genericUse {T[][]} - [matrix,$return]
 *
 * @param {T[][]} [matrix] - The array to rotate.
 * @param {number} [amount=1] - The number of times to rotate the matrix.
 *
 * @return {T[][]} The rotated matrix array. The source matrix should be discard for the returned matrix.
 */
var RotateRight = function (matrix, amount)
{
    if (amount === undefined) { amount = 1; }

    for (var i = 0; i < amount; i++)
    {
        matrix = RotateMatrix(matrix, -90);
    }

    return matrix;
};

module.exports = RotateRight;
