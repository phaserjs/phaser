/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Returns a ShaderAdditionConfig for defining the texture count
 * in a multi-texture shader. This is used by other additions
 * to process the correct number of textures.
 *
 * @function Phaser.Renderer.WebGL.ShaderAdditionMakers.MakeDefineTexCount
 * @since 4.0.0
 * @param {number} maxTextures - The maximum number of textures the shader supports. This value is used to set the `TEXTURE_COUNT` preprocessor define in the fragment shader.
 * @param {boolean} [disable=false] - Whether to disable the shader addition on creation.
 * @return {Phaser.Types.Renderer.WebGL.ShaderAdditionConfig} The shader addition configuration.
 */
var MakeDefineTexCount = function (maxTextures, disable)
{
    return {
        name: maxTextures + 'TexCount',
        additions: {
            fragmentDefine: '#define TEXTURE_COUNT ' + maxTextures
        },
        tags: [ 'TexCount' ],
        disable: !!disable
    };
};

module.exports = MakeDefineTexCount;
