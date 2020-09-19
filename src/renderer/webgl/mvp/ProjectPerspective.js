/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Sets up a perspective projection matrix into the projection matrix.
 *
 * @method Phaser.Renderer.WebGL.MVP.ProjectPerspective
 * @since 3.50.0
 *
 * @param {Phaser.Renderer.WebGL.Pipelines.ModelViewProjection} model - The Model View Projection object.
 * @param {number} fovY - The fov value.
 * @param {number} aspectRatio - The aspectRatio value.
 * @param {number} near - The near value.
 * @param {number} far - The far value.
 *
 * @return {Phaser.Renderer.WebGL.Pipelines.ModelViewProjection} The Model View Projection object.
 */
var ProjectPerspective = function (model, fovY, aspectRatio, near, far)
{
    var projectionMatrix = model.projectionMatrix;
    var fov = 1 / Math.tan(fovY / 2);
    var nearFar = 1 / (near - far);

    projectionMatrix[0] = fov / aspectRatio;
    projectionMatrix[1] = 0;
    projectionMatrix[2] = 0;
    projectionMatrix[3] = 0;
    projectionMatrix[4] = 0;
    projectionMatrix[5] = fov;
    projectionMatrix[6] = 0;
    projectionMatrix[7] = 0;
    projectionMatrix[8] = 0;
    projectionMatrix[9] = 0;
    projectionMatrix[10] = (far + near) * nearFar;
    projectionMatrix[11] = -1;
    projectionMatrix[12] = 0;
    projectionMatrix[13] = 0;
    projectionMatrix[14] = (2 * far * near) * nearFar;
    projectionMatrix[15] = 0;

    model.projectionMatrixDirty = true;

    return model;
};

module.exports = ProjectPerspective;
