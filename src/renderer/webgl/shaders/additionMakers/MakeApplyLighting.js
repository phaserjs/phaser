/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var ApplyLighting = require('../ApplyLighting-glsl');

/**
 * Return a ShaderAdditionConfig for applying lighting to a texture.
 *
 * The `rotation` variable must be available in the vertex renderer.
 *
 * @function Phaser.Renderer.WebGL.Shaders.MakeApplyLighting
 * @since 4.0.0
 * @param {boolean} [disable=false] - Whether to disable the shader addition on creation.
 * @returns {Phaser.Types.Renderer.WebGL.ShaderAdditionConfig} The shader addition configuration.
 */
var MakeApplyLighting = function (disable)
{
    return {
        name: 'ApplyLighting',
        additions: {
            fragmentHeader: ApplyLighting,
            fragmentProcess: 'fragColor = applyLighting(fragColor, normal);'
        },
        tags: ['LIGHTING'],
        disable: !!disable
    };
};

module.exports = MakeApplyLighting;
