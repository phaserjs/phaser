/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var ApplyTint = require('../ApplyTint-glsl');

/**
 * Return a ShaderAdditionConfig for applying a tint to a texture.
 *
 * @function Phaser.Renderer.WebGL.Shaders.MakeApplyTint
 * @since 4.0.0
 * @param {boolean} [disable=false] - Whether to disable the shader addition on creation.
 * @returns {Phaser.Types.Renderer.WebGL.ShaderAdditionConfig} The shader addition configuration.
 */
var MakeApplyTint = function (disable)
{
    return {
        name: 'Tint',
        additions: {
            fragmentHeader: ApplyTint,
            fragmentProcess: 'fragColor = applyTint(fragColor);'
        },
        tags: ['TINT'],
        disable: !!disable
    };
};

module.exports = MakeApplyTint;
