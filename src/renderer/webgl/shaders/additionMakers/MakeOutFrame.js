/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Returns a ShaderAdditionConfig for providing the vertex shader with the `inFrame` attribute.
 *
 * @function Phaser.Renderer.WebGL.Shaders.MakeOutFrame
 * @since 4.0.0
 * @param {boolean} [disable=false] - Whether to disable the shader addition on creation.
 * @returns {Phaser.Types.Renderer.WebGL.ShaderAdditionConfig} The shader addition configuration.
 */
var MakeOutFrame = function (disable)
{
    return {
        name: 'OutFrame',
        additions: {
            vertexHeader: 'attribute vec4 inFrame;',
            vertexProcess: 'outFrame = inFrame;',
            outVariables: 'varying vec4 outFrame;',
        },
        disable: !!disable
    };
};

module.exports = MakeOutFrame;
