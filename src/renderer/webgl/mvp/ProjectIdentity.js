/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var SetIdentity = require('./SetIdentity');

/**
 * Loads an identity matrix into the projection matrix.
 *
 * @method Phaser.Renderer.WebGL.MVP.ProjectIdentity
 * @since 3.50.0
 *
 * @param {Phaser.Renderer.WebGL.Pipelines.ModelViewProjection} model - The Model View Projection object.
 *
 * @return {Phaser.Renderer.WebGL.Pipelines.ModelViewProjection} The Model View Projection object.
 */
var ProjectIdentity = function (model)
{
    SetIdentity(model.projectionMatrix);

    model.projectionMatrixDirty = true;

    return model;
};

module.exports = ProjectIdentity;
