/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var SetIdentity = require('./SetIdentity');

/**
 * Loads an identity matrix into the model matrix.
 *
 * @method Phaser.Renderer.WebGL.MVP.Identity
 * @since 3.50.0
 *
 * @param {Phaser.Renderer.WebGL.Pipelines.ModelViewProjection} model - The Model View Projection object.
 *
 * @return {Phaser.Renderer.WebGL.Pipelines.ModelViewProjection} The Model View Projection object.
 */
var Identity = function (model)
{
    SetIdentity(model.modelMatrix);

    model.modelMatrixDirty = true;

    return model;
};

module.exports = Identity;
