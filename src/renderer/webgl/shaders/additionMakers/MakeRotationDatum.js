/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Creates and returns a `ShaderAdditionConfig` that reads the rotation value
 * from the `inTexDatum` vertex attribute and exposes it as a `float rotation`
 * variable in the vertex shader's processing stage. This addition is tagged
 * for use with lighting shaders, enabling directional and normal-mapped
 * lighting calculations to account for the rotation of the rendered geometry.
 *
 * @function Phaser.Renderer.WebGL.ShaderAdditionMakers.MakeRotationDatum
 * @since 4.0.0
 * @param {boolean} [disable=false] - Whether to disable the shader addition on creation.
 * @return {Phaser.Types.Renderer.WebGL.ShaderAdditionConfig} The shader addition configuration.
 */
var MakeRotationDatum = function (disable)
{
    return {
        name: 'RotDatum',
        additions: {
            vertexProcess: 'float rotation = inTexDatum;'
        },
        tags: ['LIGHTING'],
        disable: !!disable
    };
};

module.exports = MakeRotationDatum;
