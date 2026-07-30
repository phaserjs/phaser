/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Returns a ShaderAdditionConfig for defining the maximum number of
 * animation frames. This is used by TilemapGPULayer.
 *
 * @function Phaser.Renderer.WebGL.ShaderAdditionMakers.MakeAnimLength
 * @since 4.0.0
 * @param {number} maxAnims - The maximum number of animation frames to support. This value is injected into the shader as the `MAX_ANIM_FRAMES` preprocessor constant.
 * @param {boolean} [disable=false] - Whether to disable the shader addition on creation.
 * @return {Phaser.Types.Renderer.WebGL.ShaderAdditionConfig} The shader addition configuration.
 */
var MakeAnimLength = function (maxAnims, disable)
{
    return {
        name: maxAnims + 'Anims',
        additions: {
            fragmentDefine: '#undef MAX_ANIM_FRAMES\n#define MAX_ANIM_FRAMES ' + maxAnims
        },
        tags: [ 'MAXANIMS' ],
        disable: !!disable
    };
};

module.exports = MakeAnimLength;
