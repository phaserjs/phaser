/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Rotates the model matrix around the Y axis.
 *
 * @method Phaser.Renderer.WebGL.MVP.RotateY
 * @since 3.50.0
 *
 * @param {Phaser.Renderer.WebGL.Pipelines.ModelViewProjection} model - The Model View Projection object.
 * @param {number} radians - The amount to rotate by.
 *
 * @return {Phaser.Renderer.WebGL.Pipelines.ModelViewProjection} The Model View Projection object.
 */
var RotateY = function (model, radians)
{
    var modelMatrix = model.modelMatrix;

    var s = Math.sin(radians);
    var c = Math.cos(radians);

    var a00 = modelMatrix[0];
    var a01 = modelMatrix[1];
    var a02 = modelMatrix[2];
    var a03 = modelMatrix[3];
    var a20 = modelMatrix[8];
    var a21 = modelMatrix[9];
    var a22 = modelMatrix[10];
    var a23 = modelMatrix[11];

    modelMatrix[0] = a00 * c - a20 * s;
    modelMatrix[1] = a01 * c - a21 * s;
    modelMatrix[2] = a02 * c - a22 * s;
    modelMatrix[3] = a03 * c - a23 * s;
    modelMatrix[8] = a00 * s + a20 * c;
    modelMatrix[9] = a01 * s + a21 * c;
    modelMatrix[10] = a02 * s + a22 * c;
    modelMatrix[11] = a03 * s + a23 * c;

    model.modelMatrixDirty = true;

    return model;
};

module.exports = RotateY;
