/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var RotateMatrix = require('./RotateMatrix');

/**
 * Rotates the array matrix to the left (or -90 degrees)
 *
 * @function Phaser.Utils.Array.Matrix.RotateRight
 * @since 3.0.0
 *
 * @generic T
 * @genericUse {T[][]} - [matrix,$return]
 *
 * @param {T[][]} [matrix] - The array to rotate.
 *
 * @return {T[][]} The rotated matrix array. The source matrix should be discard for the returned matrix.
 */
var RotateRight = function (matrix)
{
    return RotateMatrix(matrix, -90);
};

module.exports = RotateRight;
