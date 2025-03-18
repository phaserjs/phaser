/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Shader = require('./Shader');
var GameObjectFactory = require('../GameObjectFactory');

/**
 * Creates a new Shader Game Object and adds it to the Scene.
 *
 * Note: This method will only be available if the Shader Game Object and WebGL support have been built into Phaser.
 *
 * @method Phaser.GameObjects.GameObjectFactory#shader
 * @webglOnly
 * @since 3.17.0
 *
 * @param {(string|Phaser.Types.GameObjects.Shader.ShaderQuadConfig)} config - The configuration object this Shader will use. It can also be a key that corresponds to a shader in the shader cache, which will be used as `fragmentKey` in a new config object.
 * @param {number} [x=0] - The horizontal position of this Game Object in the world.
 * @param {number} [y=0] - The vertical position of this Game Object in the world.
 * @param {number} [width=128] - The width of the Game Object.
 * @param {number} [height=128] - The height of the Game Object.
 * @param {string[]} [textures] - Optional array of texture keys to bind to the iChannel0...3 uniforms. The textures must already exist in the Texture Manager.
 * @param {object} [textureData] - Optional additional texture data.
 *
 * @return {Phaser.GameObjects.Shader} The Game Object that was created.
 */
if (typeof WEBGL_RENDERER)
{
    GameObjectFactory.register('shader', function (config, x, y, width, height, textures, textureData)
    {
        return this.displayList.add(new Shader(this.scene, config, x, y, width, height, textures, textureData));
    });
}
