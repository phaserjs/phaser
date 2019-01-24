/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * Reverses the columns in the given Array Matrix.
 *
 * @function Phaser.Utils.Array.Matrix.ReverseColumns
 * @since 3.0.0
 *
 * @param {array} matrix - The array matrix to reverse the columns for.
 *
 * @return {array} The column reversed matrix.
 */
var ReverseColumns = function (matrix)
{
    return matrix.reverse();
};

module.exports = ReverseColumns;
