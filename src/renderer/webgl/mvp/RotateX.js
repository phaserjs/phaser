/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Rotates the model matrix around the X axis.
 *
 * @method Phaser.Renderer.WebGL.MVP.RotateX
 * @since 3.50.0
 *
 * @param {Phaser.Renderer.WebGL.Pipelines.ModelViewProjection} model - The Model View Projection object.
 * @param {number} radians - The amount to rotate by.
 *
 * @return {Phaser.Renderer.WebGL.Pipelines.ModelViewProjection} The Model View Projection object.
 */
var RotateX = function (model, radians)
{
    var modelMatrix = model.modelMatrix;

    var s = Math.sin(radians);
    var c = Math.cos(radians);

    var a10 = modelMatrix[4];
    var a11 = modelMatrix[5];
    var a12 = modelMatrix[6];
    var a13 = modelMatrix[7];
    var a20 = modelMatrix[8];
    var a21 = modelMatrix[9];
    var a22 = modelMatrix[10];
    var a23 = modelMatrix[11];

    modelMatrix[4] = a10 * c + a20 * s;
    modelMatrix[5] = a11 * c + a21 * s;
    modelMatrix[6] = a12 * c + a22 * s;
    modelMatrix[7] = a13 * c + a23 * s;
    modelMatrix[8] = a20 * c - a10 * s;
    modelMatrix[9] = a21 * c - a11 * s;
    modelMatrix[10] = a22 * c - a12 * s;
    modelMatrix[11] = a23 * c - a13 * s;

    model.modelMatrixDirty = true;

    return model;
};

module.exports = RotateX;
