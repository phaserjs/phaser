var RotateMatrix = require('./RotateMatrix');

/**
 * [description]
 *
 * @function Phaser.Utils.Array.Matrix.Rotate180
 * @since 3.0.0
 *
 * @param {array} matrix - [description]
 *
 * @return {array} [description]
 */
var Rotate180 = function (matrix)
{
    return RotateMatrix(matrix, 180);
};

module.exports = Rotate180;
