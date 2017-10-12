/**
 * [description]
 *
 * @function Phaser.Utils.Array.Matrix.ReverseColumns
 * @since 3.0.0
 *
 * @param {array} matrix - [description]
 *
 * @return {array} [description]
 */
var ReverseColumns = function (matrix)
{
    for (var i = 0; i < matrix.length; i++)
    {
        matrix[i].reverse();
    }

    return matrix;
};

module.exports = ReverseColumns;
