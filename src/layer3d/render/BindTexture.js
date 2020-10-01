/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var SetActiveTexture = require('./SetActiveTexture');

var currentBoundTextures = [];

var BindTexture = function (state, type, texture)
{
    var gl = state.gl;

    var textureUnit = SetActiveTexture(state);

    var boundTexture = currentBoundTextures[textureUnit];

    if (!boundTexture)
    {
        boundTexture = {
            type: undefined,
            texture: undefined
        };

        currentBoundTextures[textureUnit] = boundTexture;
    }

    if (boundTexture.type !== type || boundTexture.texture !== texture)
    {
        gl.bindTexture(type, texture || state.emptyTextures[type]);

        boundTexture.type = type;
        boundTexture.texture = texture;
    }
};

module.exports = BindTexture;
