/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Loads a 2D view matrix (3x2 matrix) into a 4x4 view matrix.
 *
 * @method Phaser.Renderer.WebGL.MVP.ViewLoad2D
 * @since 3.50.0
 *
 * @param {Phaser.Renderer.WebGL.Pipelines.ModelViewProjection} model - The Model View Projection object.
 * @param {Float32Array} matrix2D - The Matrix2D.
 *
 * @return {Phaser.Renderer.WebGL.Pipelines.ModelViewProjection} The Model View Projection object.
 */
var ViewLoad2D = function (model, matrix2D)
{
    var vm = model.viewMatrix;

    vm[0] = matrix2D[0];
    vm[1] = matrix2D[1];
    vm[2] = 0;
    vm[3] = 0;
    vm[4] = matrix2D[2];
    vm[5] = matrix2D[3];
    vm[6] = 0;
    vm[7] = 0;
    vm[8] = matrix2D[4];
    vm[9] = matrix2D[5];
    vm[10] = 1;
    vm[11] = 0;
    vm[12] = 0;
    vm[13] = 0;
    vm[14] = 0;
    vm[15] = 1;

    model.viewMatrixDirty = true;

    return model;
};

module.exports = ViewLoad2D;
