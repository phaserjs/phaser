/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var GameObjectFactory = require('../GameObjectFactory');
var RenderTexture = require('./RenderTexture');

/**
 * Creates a new Render Texture Game Object and adds it to the Scene.
 *
 * Note: This method will only be available if the Render Texture Game Object has been built into Phaser.
 * 
 * A Render Texture is a special texture that allows any number of Game Objects to be drawn to it. You can take many complex objects and
 * draw them all to this one texture, which can they be used as the texture for other Game Object's. It's a way to generate dynamic
 * textures at run-time that are WebGL friendly and don't invoke expensive GPU uploads.
 *
 * @method Phaser.GameObjects.GameObjectFactory#renderTexture
 * @since 3.2.0
 *
 * @param {number} x - The horizontal position of this Game Object in the world.
 * @param {number} y - The vertical position of this Game Object in the world.
 * @param {integer} [width=32] - The width of the Render Texture.
 * @param {integer} [height=32] - The height of the Render Texture.
 * @property {string} [key] - The texture key to make the RenderTexture from.
 * @property {string} [frame] - the frame to make the RenderTexture from.
 * 
 * @return {Phaser.GameObjects.RenderTexture} The Game Object that was created.
 */
GameObjectFactory.register('renderTexture', function (x, y, width, height, key, frame)
{
    return this.displayList.add(new RenderTexture(this.scene, x, y, width, height, key, frame));
});
