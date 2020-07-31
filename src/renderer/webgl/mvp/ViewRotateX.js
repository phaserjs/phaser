/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Rotates the view matrix around the X axis.
 *
 * @method Phaser.Renderer.WebGL.MVP.ViewRotateX
 * @since 3.50.0
 *
 * @param {Phaser.Renderer.WebGL.Pipelines.ModelViewProjection} model - The Model View Projection object.
 * @param {number} radians - The amnount to rotate by.
 *
 * @return {Phaser.Renderer.WebGL.Pipelines.ModelViewProjection} The Model View Projection object.
 */
var ViewRotateX = function (model, radians)
{
    var viewMatrix = model.viewMatrix;

    var s = Math.sin(radians);
    var c = Math.cos(radians);

    var a10 = viewMatrix[4];
    var a11 = viewMatrix[5];
    var a12 = viewMatrix[6];
    var a13 = viewMatrix[7];
    var a20 = viewMatrix[8];
    var a21 = viewMatrix[9];
    var a22 = viewMatrix[10];
    var a23 = viewMatrix[11];

    viewMatrix[4] = a10 * c + a20 * s;
    viewMatrix[5] = a11 * c + a21 * s;
    viewMatrix[6] = a12 * c + a22 * s;
    viewMatrix[7] = a13 * c + a23 * s;
    viewMatrix[8] = a20 * c - a10 * s;
    viewMatrix[9] = a21 * c - a11 * s;
    viewMatrix[10] = a22 * c - a12 * s;
    viewMatrix[11] = a23 * c - a13 * s;

    model.viewMatrixDirty = true;

    return model;
};

module.exports = ViewRotateX;
