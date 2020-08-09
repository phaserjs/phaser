/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Scales the model matrix by the given values.
 *
 * @method Phaser.Renderer.WebGL.MVP.Scale
 * @since 3.50.0
 *
 * @param {Phaser.Renderer.WebGL.Pipelines.ModelViewProjection} model - The Model View Projection object.
 * @param {number} x - The x component.
 * @param {number} y - The y component.
 * @param {number} z - The z component.
 *
 * @return {Phaser.Renderer.WebGL.Pipelines.ModelViewProjection} The Model View Projection object.
 */
var Scale = function (model, x, y, z)
{
    var modelMatrix = model.modelMatrix;

    modelMatrix[0] = modelMatrix[0] * x;
    modelMatrix[1] = modelMatrix[1] * x;
    modelMatrix[2] = modelMatrix[2] * x;
    modelMatrix[3] = modelMatrix[3] * x;
    modelMatrix[4] = modelMatrix[4] * y;
    modelMatrix[5] = modelMatrix[5] * y;
    modelMatrix[6] = modelMatrix[6] * y;
    modelMatrix[7] = modelMatrix[7] * y;
    modelMatrix[8] = modelMatrix[8] * z;
    modelMatrix[9] = modelMatrix[9] * z;
    modelMatrix[10] = modelMatrix[10] * z;
    modelMatrix[11] = modelMatrix[11] * z;

    model.modelMatrixDirty = true;

    return model;
};

module.exports = Scale;
