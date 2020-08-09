/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Rotates the view matrix around the Y axis.
 *
 * @method Phaser.Renderer.WebGL.MVP.ViewRotateY
 * @since 3.50.0
 *
 * @param {Phaser.Renderer.WebGL.Pipelines.ModelViewProjection} model - The Model View Projection object.
 * @param {number} radians - The amnount to rotate by.
 *
 * @return {Phaser.Renderer.WebGL.Pipelines.ModelViewProjection} The Model View Projection object.
 */
var ViewRotateY = function (model, radians)
{
    var viewMatrix = model.viewMatrix;

    var s = Math.sin(radians);
    var c = Math.cos(radians);

    var a00 = viewMatrix[0];
    var a01 = viewMatrix[1];
    var a02 = viewMatrix[2];
    var a03 = viewMatrix[3];
    var a20 = viewMatrix[8];
    var a21 = viewMatrix[9];
    var a22 = viewMatrix[10];
    var a23 = viewMatrix[11];

    viewMatrix[0] = a00 * c - a20 * s;
    viewMatrix[1] = a01 * c - a21 * s;
    viewMatrix[2] = a02 * c - a22 * s;
    viewMatrix[3] = a03 * c - a23 * s;
    viewMatrix[8] = a00 * s + a20 * c;
    viewMatrix[9] = a01 * s + a21 * c;
    viewMatrix[10] = a02 * s + a22 * c;
    viewMatrix[11] = a03 * s + a23 * c;

    model.viewMatrixDirty = true;

    return model;
};

module.exports = ViewRotateY;
