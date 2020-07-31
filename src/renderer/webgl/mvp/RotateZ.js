/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Rotates the model matrix around the Z axis.
 *
 * @method Phaser.Renderer.WebGL.MVP.RotateZ
 * @since 3.50.0
 *
 * @param {Phaser.Renderer.WebGL.Pipelines.ModelViewProjection} model - The Model View Projection object.
 * @param {number} radians - The amount to rotate by.
 *
 * @return {Phaser.Renderer.WebGL.Pipelines.ModelViewProjection} The Model View Projection object.
 */
var RotateZ = function (model, radians)
{
    var modelMatrix = model.modelMatrix;

    var s = Math.sin(radians);
    var c = Math.cos(radians);

    var a00 = modelMatrix[0];
    var a01 = modelMatrix[1];
    var a02 = modelMatrix[2];
    var a03 = modelMatrix[3];
    var a10 = modelMatrix[4];
    var a11 = modelMatrix[5];
    var a12 = modelMatrix[6];
    var a13 = modelMatrix[7];

    modelMatrix[0] = a00 * c + a10 * s;
    modelMatrix[1] = a01 * c + a11 * s;
    modelMatrix[2] = a02 * c + a12 * s;
    modelMatrix[3] = a03 * c + a13 * s;
    modelMatrix[4] = a10 * c - a00 * s;
    modelMatrix[5] = a11 * c - a01 * s;
    modelMatrix[6] = a12 * c - a02 * s;
    modelMatrix[7] = a13 * c - a03 * s;

    model.modelMatrixDirty = true;

    return model;
};

module.exports = RotateZ;
