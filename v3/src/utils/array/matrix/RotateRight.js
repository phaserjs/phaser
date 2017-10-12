var RotateMatrix = require('./RotateMatrix');

/**
 * [description]
 *
 * @function Phaser.Utils.Array.Matrix.RotateRight
 * @since 3.0.0
 *
 * @param {array} matrix - [description]
 *
 * @return {array} [description]
 */
var RotateRight = function (matrix)
{
    return RotateMatrix(matrix, 90);
};

module.exports = RotateRight;
