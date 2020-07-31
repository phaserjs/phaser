/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Translates the view matrix.
 *
 * @method Phaser.Renderer.WebGL.MVP.ViewTranslate
 * @since 3.50.0
 *
 * @param {Phaser.Renderer.WebGL.Pipelines.ModelViewProjection} model - The Model View Projection object.
 * @param {number} x - The x component.
 * @param {number} y - The y component.
 * @param {number} z - The z component.
 *
 * @return {Phaser.Renderer.WebGL.Pipelines.ModelViewProjection} The Model View Projection object.
 */
var ViewTranslate = function (model, x, y, z)
{
    var viewMatrix = model.viewMatrix;

    viewMatrix[12] = viewMatrix[0] * x + viewMatrix[4] * y + viewMatrix[8] * z + viewMatrix[12];
    viewMatrix[13] = viewMatrix[1] * x + viewMatrix[5] * y + viewMatrix[9] * z + viewMatrix[13];
    viewMatrix[14] = viewMatrix[2] * x + viewMatrix[6] * y + viewMatrix[10] * z + viewMatrix[14];
    viewMatrix[15] = viewMatrix[3] * x + viewMatrix[7] * y + viewMatrix[11] * z + viewMatrix[15];

    model.viewMatrixDirty = true;

    return model;
};

module.exports = ViewTranslate;
