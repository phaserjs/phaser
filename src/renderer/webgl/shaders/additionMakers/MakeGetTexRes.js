/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var GetTexRes = require('../GetTexRes-glsl');

/**
 * Creates and returns a ShaderAdditionConfig that injects a GLSL fragment
 * shader header providing a helper function for looking up a texture's
 * resolution from a uniform array of resolutions, as used in multi-texture
 * rendering where each bound texture may have a different size.
 *
 * @function Phaser.Renderer.WebGL.ShaderAdditionMakers.MakeGetTexRes
 * @since 4.0.0
 * @param {boolean} [disable=false] - Whether to disable the shader addition on creation.
 * @return {Phaser.Types.Renderer.WebGL.ShaderAdditionConfig} The shader addition configuration.
 */
var MakeGetTexRes = function (disable)
{
    return {
        name: 'GetTexRes',
        additions: {
            fragmentHeader: GetTexRes
        },
        tags: [ 'TEXRES' ],
        disable: !!disable
    };
};

module.exports = MakeGetTexRes;
