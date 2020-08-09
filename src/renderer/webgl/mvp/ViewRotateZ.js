/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Rotates the view matrix around the Z axis.
 *
 * @method Phaser.Renderer.WebGL.MVP.ViewRotateZ
 * @since 3.50.0
 *
 * @param {Phaser.Renderer.WebGL.Pipelines.ModelViewProjection} model - The Model View Projection object.
 * @param {number} radians - The amnount to rotate by.
 *
 * @return {Phaser.Renderer.WebGL.Pipelines.ModelViewProjection} The Model View Projection object.
 */
var ViewRotateZ = function (model, radians)
{
    var viewMatrix = model.viewMatrix;

    var s = Math.sin(radians);
    var c = Math.cos(radians);

    var a00 = viewMatrix[0];
    var a01 = viewMatrix[1];
    var a02 = viewMatrix[2];
    var a03 = viewMatrix[3];
    var a10 = viewMatrix[4];
    var a11 = viewMatrix[5];
    var a12 = viewMatrix[6];
    var a13 = viewMatrix[7];

    viewMatrix[0] = a00 * c + a10 * s;
    viewMatrix[1] = a01 * c + a11 * s;
    viewMatrix[2] = a02 * c + a12 * s;
    viewMatrix[3] = a03 * c + a13 * s;
    viewMatrix[4] = a10 * c - a00 * s;
    viewMatrix[5] = a11 * c - a01 * s;
    viewMatrix[6] = a12 * c - a02 * s;
    viewMatrix[7] = a13 * c - a03 * s;

    model.viewMatrixDirty = true;

    return model;
};

module.exports = ViewRotateZ;
