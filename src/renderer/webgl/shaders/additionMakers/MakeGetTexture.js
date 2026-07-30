/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var GetTexture = require('../GetTexture-glsl');

/**
 * Creates a ShaderAdditionConfig for multi-texture sampling in a WebGL shader.
 * The returned config injects a `getTexture` GLSL function into the fragment
 * shader header, built as an if...else chain that selects from up to
 * `maxTextures` texture units based on the texture ID. It also injects a
 * single-line process that samples the current fragment color via that function.
 *
 * @function Phaser.Renderer.WebGL.ShaderAdditionMakers.MakeGetTexture
 * @since 4.0.0
 * @param {number} [maxTextures=1] - The number of texture units to support. Determines how many branches are generated in the texture-selection if...else chain.
 * @param {boolean} [disable=false] - Whether to disable the shader addition on creation.
 * @return {Phaser.Types.Renderer.WebGL.ShaderAdditionConfig} The shader addition configuration.
 */
var MakeGetTexture = function (maxTextures, disable)
{
    if (maxTextures === undefined) { maxTextures = 1; }

    var texIdProcess = '';
    for (var i = 1; i < maxTextures; i++)
    {
        texIdProcess += 'ELSE_TEX_CASE(' + i + ')\n';
    }
    var header = GetTexture.replace('#pragma phaserTemplate(texIdProcess)', texIdProcess);

    return {
        name: 'GetTexture' + maxTextures,
        additions: {
            fragmentHeader: header,
            fragmentProcess: 'vec4 fragColor = getTexture(texCoord);'
        },
        tags: [ 'TEXTURE' ],
        disable: !!disable
    };
};

module.exports = MakeGetTexture;
