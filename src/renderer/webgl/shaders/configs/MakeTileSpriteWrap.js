/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Returns a ShaderAdditionConfig for wrapping a TileSprite texture.
 * This makes the texture repeat within the bounds of the TileSprite frame -
 * it's what makes a TileSprite work.
 *
 * @function Phaser.Renderer.WebGL.Shaders.MakeTileSpriteWrap
 * @since 3.90.0
 * @param {boolean} [disable=false] - Whether to disable the shader addition on creation.
 * @returns {Phaser.Types.Renderer.WebGL.ShaderAdditionConfig} The shader addition configuration.
 */
var MakeTileSpriteWrap = function (disable)
{
    return {
        name: 'TileSpriteWrap',
        additions: {
            vertexHeader: 'attribute vec4 inFrame;',
            outVariables: 'varying vec4 outFrame;',
            vertexProcess: 'outFrame = inFrame;',
            texCoordProcess: '// Wrap texture coordinate into the UV space of the texture frame.\ntexCoord = mod(texCoord, 1.0) * outFrame.zw + outFrame.xy;'
        },
        disable: !!disable
    };
};

module.exports = MakeTileSpriteWrap;
