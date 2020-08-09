/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Translates the model matrix by the given values.
 *
 * @method Phaser.Renderer.WebGL.MVP.Translate
 * @since 3.50.0
 *
 * @param {Phaser.Renderer.WebGL.Pipelines.ModelViewProjection} model - The Model View Projection object.
 * @param {number} x - The x component.
 * @param {number} y - The y component.
 * @param {number} z - The z component.
 *
 * @return {Phaser.Renderer.WebGL.Pipelines.ModelViewProjection} The Model View Projection object.
 */
var Translate = function (model, x, y, z)
{
    var modelMatrix = model.modelMatrix;

    modelMatrix[12] = modelMatrix[0] * x + modelMatrix[4] * y + modelMatrix[8] * z + modelMatrix[12];
    modelMatrix[13] = modelMatrix[1] * x + modelMatrix[5] * y + modelMatrix[9] * z + modelMatrix[13];
    modelMatrix[14] = modelMatrix[2] * x + modelMatrix[6] * y + modelMatrix[10] * z + modelMatrix[14];
    modelMatrix[15] = modelMatrix[3] * x + modelMatrix[7] * y + modelMatrix[11] * z + modelMatrix[15];

    model.modelMatrixDirty = true;

    return model;
};

module.exports = Translate;
