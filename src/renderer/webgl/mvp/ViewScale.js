/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Scales the view matrix.
 *
 * @method Phaser.Renderer.WebGL.MVP.ViewScale
 * @since 3.50.0
 *
 * @param {Phaser.Renderer.WebGL.Pipelines.ModelViewProjection} model - The Model View Projection object.
 * @param {number} x - The x component.
 * @param {number} y - The y component.
 * @param {number} z - The z component.
 *
 * @return {Phaser.Renderer.WebGL.Pipelines.ModelViewProjection} The Model View Projection object.
 */
var ViewScale = function (model, x, y, z)
{
    var viewMatrix = model.viewMatrix;

    viewMatrix[0] = viewMatrix[0] * x;
    viewMatrix[1] = viewMatrix[1] * x;
    viewMatrix[2] = viewMatrix[2] * x;
    viewMatrix[3] = viewMatrix[3] * x;
    viewMatrix[4] = viewMatrix[4] * y;
    viewMatrix[5] = viewMatrix[5] * y;
    viewMatrix[6] = viewMatrix[6] * y;
    viewMatrix[7] = viewMatrix[7] * y;
    viewMatrix[8] = viewMatrix[8] * z;
    viewMatrix[9] = viewMatrix[9] * z;
    viewMatrix[10] = viewMatrix[10] * z;
    viewMatrix[11] = viewMatrix[11] * z;

    model.viewMatrixDirty = true;

    return model;
};

module.exports = ViewScale;
