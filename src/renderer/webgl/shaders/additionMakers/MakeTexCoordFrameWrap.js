/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Returns a ShaderAdditionConfig for wrapping coordinates inside a frame.
 * This makes the texture repeat within the bounds of the frame -
 * it's what makes a TileSprite work.
 *
 * @function Phaser.Renderer.WebGL.Shaders.MakeTexCoordFrameWrap
 * @since 4.0.0
 * @param {boolean} [disable=false] - Whether to disable the shader addition on creation.
 * @returns {Phaser.Types.Renderer.WebGL.ShaderAdditionConfig} The shader addition configuration.
 */
var MakeTexCoordFrameWrap = function (disable)
{
    return {
        name: 'TexCoordFrameWrap',
        additions: {
            texCoord: '// Wrap texture coordinate into the UV space of the texture frame.\ntexCoord = mod(texCoord, 1.0) * outFrame.zw + outFrame.xy;'
        },
        disable: !!disable
    };
};

module.exports = MakeTexCoordFrameWrap;
