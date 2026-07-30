/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var GetNormalFromMap = require('../GetNormalFromMap-glsl');

/**
 * Return a ShaderAdditionConfig that injects the `getNormalFromMap` function
 * into the fragment shader header and samples the normal map at the current
 * texture coordinate during fragment processing. The resulting normal vector
 * is used by the lighting pipeline to apply per-pixel lighting to a texture.
 *
 * @function Phaser.Renderer.WebGL.ShaderAdditionMakers.MakeGetNormalFromMap
 * @since 4.0.0
 * @param {boolean} [disable=false] - Whether to disable the shader addition on creation.
 * @return {Phaser.Types.Renderer.WebGL.ShaderAdditionConfig} The shader addition configuration.
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
