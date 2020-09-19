/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Loads an identity matrix into the model matrix.
 *
 * @method Phaser.Renderer.WebGL.MVP.SetIdentity
 * @since 3.50.0
 *
 * @param {Float32Array} array - The array to set to be an identity matrix.
 */
var SetIdentity = function (array)
{
    array[0] = 1;
    array[1] = 0;
    array[2] = 0;
    array[3] = 0;
    array[4] = 0;
    array[5] = 1;
    array[6] = 0;
    array[7] = 0;
    array[8] = 0;
    array[9] = 0;
    array[10] = 1;
    array[11] = 0;
    array[12] = 0;
    array[13] = 0;
    array[14] = 0;
    array[15] = 1;
};

module.exports = SetIdentity;
