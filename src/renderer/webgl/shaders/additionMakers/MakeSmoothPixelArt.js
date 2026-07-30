/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var DefineBlockyTexCoord = require('../DefineBlockyTexCoord-glsl');

/**
 * Creates and returns a ShaderAdditionConfig that enables smooth pixel art rendering.
 *
 * When applied to a shader, this addition replaces standard texture coordinate
 * interpolation with a blocky sampling method that preserves crisp pixel edges
 * while applying sub-pixel anti-aliasing at texel boundaries. The result is that
 * pixel art assets scaled up or rendered at non-integer scales retain sharp,
 * clean edges rather than the blurriness introduced by bilinear filtering.
 *
 * Internally this uses the `GL_OES_standard_derivatives` WebGL extension to
 * compute per-fragment derivative information, which drives the anti-aliased
 * edge blending via the `getBlockyTexCoord` GLSL helper.
 *
 * @function Phaser.Renderer.WebGL.ShaderAdditionMakers.MakeSmoothPixelArt
 * @since 4.0.0
 * @param {boolean} [disable=false] - Whether to disable the shader addition on creation.
 * @return {Phaser.Types.Renderer.WebGL.ShaderAdditionConfig} The shader addition configuration.
 */
var MakeSmoothPixelArt = function (disable)
{
    return {
        name: 'SmoothPixelArt',
        additions: {
            extensions: '#extension GL_OES_standard_derivatives : enable',
            fragmentHeader: DefineBlockyTexCoord,
            texCoord: 'texCoord = getBlockyTexCoord(texCoord, getTexRes());'
        },
        disable: !!disable
    };
};

module.exports = MakeSmoothPixelArt;
