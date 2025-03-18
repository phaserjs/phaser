/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var ApplyLighting = require('../ApplyLighting-glsl');

/**
 * Return a ShaderAdditionConfig for applying lighting to a flat piece of geometry.
 *
 * @function Phaser.Renderer.WebGL.Shaders.MakeApplyFlatLighting
 * @since 4.0.0
 * @param {boolean} [disable=false] - Whether to disable the shader addition on creation.
 * @returns {Phaser.Types.Renderer.WebGL.ShaderAdditionConfig} The shader addition configuration.
 */
var MakeApplyFlatLighting = function (disable)
{
    return {
        name: 'ApplyFlatLighting',
        additions: {
            fragmentHeader: ApplyLighting,
            fragmentProcess: 'fragColor = applyLighting(fragColor, vec3(0.0, 0.0, 1.0));'
        },
        tags: ['LIGHTING'],
        disable: !!disable
    };
};

module.exports = MakeApplyFlatLighting;
