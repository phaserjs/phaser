/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var RotateMatrix = require('./RotateMatrix');

/**
 * Rotates the array matrix 180 degrees.
 *
 * @function Phaser.Utils.Array.Matrix.Rotate180
 * @since 3.0.0
 *
 * @param {array} matrix - The array to rotate.
 *
 * @return {array} The rotated matrix array. The source matrix should be discard for the returned matrix.
 */
var Rotate180 = function (matrix)
{
    return RotateMatrix(matrix, 180);
};

module.exports = Rotate180;
