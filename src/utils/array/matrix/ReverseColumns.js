/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Reverses the columns in the given Array Matrix.
 *
 * @function Phaser.Utils.Array.Matrix.ReverseColumns
 * @since 3.0.0
 *
 * @generic T
 * @genericUse {T[][]} - [matrix,$return]
 *
 * @param {T[][]} [matrix] - The array matrix to reverse the columns for.
 *
 * @return {T[][]} The column reversed matrix.
 */
var ReverseColumns = function (matrix)
{
    return matrix.reverse();
};

module.exports = ReverseColumns;
