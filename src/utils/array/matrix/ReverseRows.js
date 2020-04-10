/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Reverses the rows in the given Array Matrix.
 *
 * @function Phaser.Utils.Array.Matrix.ReverseRows
 * @since 3.0.0
 *
 * @generic T
 * @genericUse {T[][]} - [matrix,$return]
 *
 * @param {T[][]} [matrix] - The array matrix to reverse the rows for.
 *
 * @return {T[][]} The column reversed matrix.
 */
var ReverseRows = function (matrix)
{
    for (var i = 0; i < matrix.length; i++)
    {
        matrix[i].reverse();
    }

    return matrix;
};

module.exports = ReverseRows;
