/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

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
