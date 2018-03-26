/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

// Based on the routine from {@link http://jsfiddle.net/MrPolywhirl/NH42z/}.

var CheckMatrix = require('./CheckMatrix');
var TransposeMatrix = require('./TransposeMatrix');

/**
 * [description]
 *
 * @function Phaser.Utils.Array.Matrix.RotateMatrix
 * @since 3.0.0
 *
 * @param {array} matrix - The array to rotate.
 * @param {(number|string)} [direction=90] - The amount to rotate the matrix by. The value can be given in degrees: 90, -90, 270, -270 or 180, or a string command: `rotateLeft`, `rotateRight` or `rotate180`.
 *
 * @return {array} The rotated matrix array. The source matrix should be discard for the returned matrix.
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
        matrix.reverse();
    }
    else if (direction === -90 || direction === 270 || direction === 'rotateRight')
    {
        matrix.reverse();
        matrix = TransposeMatrix(matrix);
    }
    else if (Math.abs(direction) === 180 || direction === 'rotate180')
    {
        for (var i = 0; i < matrix.length; i++)
        {
            matrix[i].reverse();
        }

        matrix.reverse();
    }

    return matrix;
};

module.exports = RotateMatrix;
