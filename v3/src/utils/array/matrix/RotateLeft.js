var RotateMatrix = require('./RotateMatrix');

/**
 * [description]
 *
 * @function Phaser.Utils.Array.Matrix.RotateLeft
 * @since 3.0.0
 *
 * @param {array} matrix - [description]
 *
 * @return {array} [description]
 */
var RotateLeft = function (matrix)
{
    return RotateMatrix(matrix, -90);
};

module.exports = RotateLeft;
