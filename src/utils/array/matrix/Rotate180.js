/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var RotateMatrix = require('./RotateMatrix');

/**
 * Rotates the array matrix 180 degrees.
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
 * @function Phaser.Utils.Array.Matrix.Rotate180
 * @since 3.0.0
 *
 * @generic T
 * @genericUse {T[][]} - [matrix,$return]
 *
 * @param {T[][]} [matrix] - The array to rotate.
 *
 * @return {T[][]} The rotated matrix array. The source matrix should be discard for the returned matrix.
 */
var Rotate180 = function (matrix)
{
    return RotateMatrix(matrix, 180);
};

module.exports = Rotate180;
