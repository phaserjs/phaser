/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Return a ShaderAdditionConfig for getting the texture coordinates
 * from the vertex shader via the `outTexCoord` variable.
 *
 * @function Phaser.Renderer.WebGL.Shaders.MakeGetTexCoordOut
 * @since 4.0.0
 *
 * @param {boolean} [disable=false] - Whether to disable the shader addition on creation.
 * @returns {Phaser.Types.Renderer.WebGL.ShaderAdditionConfig} The shader addition configuration.
 */
var MakeGetTexCoordOut = function (disable)
{
    return {
        name: 'TexCoordOut',
        additions: {
            fragmentProcess: 'vec2 texCoord = outTexCoord;\n#pragma phaserTemplate(texCoord)'
        },
        tags: [ 'TEXCOORD' ],
        disable: !!disable
    };
};

module.exports = MakeGetTexCoordOut;
