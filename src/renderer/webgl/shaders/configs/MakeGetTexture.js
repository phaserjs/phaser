/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var GetTextureSingle = require('../GetTextureSingle-glsl');
var GetTextureMulti = require('../GetTextureMulti-glsl');

/**
 * Return a ShaderAdditionConfig for getting a texture from a sampler2D.
 * This maker can return a single texture shader addition
 * or a multi-texture shader addition, depending on the maxTextures parameter.
 * The addition will change its name based on the number of textures supported,
 * so it is tagged with 'TEXTURE' for quick identification at runtime.
 *
 * @function Phaser.Renderer.WebGL.Shaders.MakeGetTexture
 * @since 3.90.0
 * @param {number} maxTextures - The maximum number of textures to support.
 * @param {boolean} [disable=false] - Whether to disable the shader addition on creation.
 * @returns {Phaser.Types.Renderer.WebGL.ShaderAdditionConfig} The shader addition configuration.
 */
var MakeGetTexture = function (maxTextures, disable)
{
    var fragmentProcess = 'vec4 fragColor = getTexture();';

    if (maxTextures === 1)
    {
        return {
            name: '1TEXTURE',
            additions: {
                fragmentHeader: GetTextureSingle,
                fragmentProcess: fragmentProcess
            },
            tags: [ 'TEXTURE' ],
            disable: !!disable
        };
    }

    var src = '';

    for (var i = 0; i < maxTextures; i++)
    {
        if (i > 0)
        {
            src += '\n\telse ';
        }

        if (i < maxTextures - 1)
        {
            src += 'if (texId < ' + i + '.5)';
        }

        src += '\n\t{';
        src += '\n\t\ttexture = texture2D(uMainSampler[' + i + '], texCoord);';
        src += '\n\t}';
    }

    return {
        name: maxTextures + 'TEXTURES',
        additions: {
            fragmentDefine: '#define TEXTURE_COUNT ' + maxTextures,
            fragmentHeader: GetTextureMulti.replace(
                '#pragma phaserTemplate(texSamplerProcess)',
                src
            ),
            fragmentProcess: fragmentProcess
        },
        tags: [ 'TEXTURE' ],
        disable: !!disable
    };
};

module.exports = MakeGetTexture;
