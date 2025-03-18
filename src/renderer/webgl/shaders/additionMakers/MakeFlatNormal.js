/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Return a ShaderAdditionConfig for defining a flat normal.
 * This is used to light objects without a normal map.
 *
 * @function Phaser.Renderer.WebGL.Shaders.MakeFlatNormal
 * @since 4.0.0
 * @param {boolean} [disable=false] - Whether to disable the shader addition on creation.
 * @returns {Phaser.Types.Renderer.WebGL.ShaderAdditionConfig} The shader addition configuration.
 */
var MakeFlatNormal = function (disable)
{
    return {
        name: 'FlatNormal',
        additions: {
            fragmentProcess: 'vec3 normal = vec3(0.0, 0.0, 1.0);'
        },
        tags: [ 'LIGHTING' ],
        disable: !!disable
    };
};

module.exports = MakeFlatNormal;
