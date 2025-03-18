/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var GetNormalFromMap = require('../GetNormalFromMap-glsl');

/**
 * Return a ShaderAdditionConfig for creating an outInverseRotationMatrix
 * in the vertex shader, which is used to apply lighting to a texture.
 *
 * @function Phaser.Renderer.WebGL.Shaders.MakeGetNormalFromMap
 * @since 4.0.0
 * @param {boolean} [disable=false] - Whether to disable the shader addition on creation.
 * @returns {Phaser.Types.Renderer.WebGL.ShaderAdditionConfig} The shader addition configuration.
 */
var MakeGetNormalFromMap = function (disable)
{
    return {
        name: 'NormalMap',
        additions: {
            fragmentHeader: GetNormalFromMap,
            fragmentProcess: 'vec3 normal = getNormalFromMap(texCoord);'
        },
        tags: [ 'LIGHTING' ],
        disable: !!disable
    };
};

module.exports = MakeGetNormalFromMap;
