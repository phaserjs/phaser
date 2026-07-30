/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var ApplyLighting = require('../ApplyLighting-glsl');

/**
 * Creates and returns a `ShaderAdditionConfig` that injects normal-map
 * lighting into a WebGL shader pipeline. When added to a renderer, it
 * includes the `ApplyLighting` GLSL header in the fragment shader and
 * runs `applyLighting(fragColor, normal)` during the fragment process
 * stage, blending the lighting result into the output color.
 *
 * The `normal` variable must be available in the fragment shader.
 *
 * @function Phaser.Renderer.WebGL.ShaderAdditionMakers.MakeApplyLighting
 * @since 4.0.0
 * @param {boolean} [disable=false] - Whether to disable the shader addition on creation.
 * @return {Phaser.Types.Renderer.WebGL.ShaderAdditionConfig} The shader addition configuration.
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
