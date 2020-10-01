/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var currentTextureUnit = null;

var SetActiveTexture = function (state, textureUnit)
{
    var gl = state.gl;

    if (textureUnit === undefined)
    {
        textureUnit = gl.TEXTURE0 + state.maxTextures - 1;
    }

    if (currentTextureUnit !== textureUnit)
    {
        gl.activeTexture(textureUnit);

        currentTextureUnit = textureUnit;
    }

    return currentTextureUnit;
};

module.exports = SetActiveTexture;
