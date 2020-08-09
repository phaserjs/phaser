/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Copies a 4x4 matrix into the view matrix
 *
 * @method Phaser.Renderer.WebGL.MVP.ViewLoad
 * @since 3.50.0
 *
 * @param {Phaser.Renderer.WebGL.Pipelines.ModelViewProjection} model - The Model View Projection object.
 * @param {Float32Array} matrix - A Float32Array containing the Matrix2d to copy into the MVP view matrix.
 *
 * @return {Phaser.Renderer.WebGL.Pipelines.ModelViewProjection} The Model View Projection object.
 */
var ViewLoad = function (model, matrix)
{
    var vm = model.viewMatrix;

    vm[0] = matrix[0];
    vm[1] = matrix[1];
    vm[2] = matrix[2];
    vm[3] = matrix[3];
    vm[4] = matrix[4];
    vm[5] = matrix[5];
    vm[6] = matrix[6];
    vm[7] = matrix[7];
    vm[8] = matrix[8];
    vm[9] = matrix[9];
    vm[10] = matrix[10];
    vm[11] = matrix[11];
    vm[12] = matrix[12];
    vm[13] = matrix[13];
    vm[14] = matrix[14];
    vm[15] = matrix[15];

    model.viewMatrixDirty = true;

    return model;
};

module.exports = ViewLoad;
