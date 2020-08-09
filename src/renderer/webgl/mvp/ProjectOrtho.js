/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Translates the model matrix by the given values.
 *
 * @method Phaser.Renderer.WebGL.MVP.ProjectOrtho
 * @since 3.50.0
 *
 * @param {Phaser.Renderer.WebGL.Pipelines.ModelViewProjection} model - The Model View Projection object.
 * @param {number} left - The left value.
 * @param {number} right - The right value.
 * @param {number} bottom - The bottom value.
 * @param {number} top - The top value.
 * @param {number} near - The near value.
 * @param {number} far - The far value.
 *
 * @return {Phaser.Renderer.WebGL.Pipelines.ModelViewProjection} The Model View Projection object.
 */
var ProjectOrtho = function (model, left, right, bottom, top, near, far)
{
    var projectionMatrix = model.projectionMatrix;
    var leftRight = 1 / (left - right);
    var bottomTop = 1 / (bottom - top);
    var nearFar = 1 / (near - far);

    projectionMatrix[0] = -2 * leftRight;
    projectionMatrix[1] = 0;
    projectionMatrix[2] = 0;
    projectionMatrix[3] = 0;
    projectionMatrix[4] = 0;
    projectionMatrix[5] = -2 * bottomTop;
    projectionMatrix[6] = 0;
    projectionMatrix[7] = 0;
    projectionMatrix[8] = 0;
    projectionMatrix[9] = 0;
    projectionMatrix[10] = 2 * nearFar;
    projectionMatrix[11] = 0;
    projectionMatrix[12] = (left + right) * leftRight;
    projectionMatrix[13] = (top + bottom) * bottomTop;
    projectionMatrix[14] = (far + near) * nearFar;
    projectionMatrix[15] = 1;

    model.projectionMatrixDirty = true;

    return model;
};

module.exports = ProjectOrtho;
