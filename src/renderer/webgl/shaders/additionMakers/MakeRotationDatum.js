/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Return a ShaderAdditionConfig for deriving rotation from `inTexDatum`.
 * This is useful for shaders that need to know their orientation.
 *
 * @function Phaser.Renderer.WebGL.Shaders.MakeRotationDatum
 * @since 4.0.0
 * @param {boolean} [disable=false] - Whether to disable the shader addition on creation.
 * @returns {Phaser.Types.Renderer.WebGL.ShaderAdditionConfig} The shader addition configuration.
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
