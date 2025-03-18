/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var GameObjectFactory = require('../GameObjectFactory');
var RenderTexture = require('./RenderTexture');

/**
 * Creates a new Render Texture Game Object and adds it to the Scene.
 *
 * Note: This method will only be available if the Render Texture Game Object has been built into Phaser.
 *
 * A Render Texture is a combination of Dynamic Texture and an Image Game Object, that uses the
 * Dynamic Texture to display itself with.
 *
 * A Dynamic Texture is a special texture that allows you to draw textures, frames and most kind of
 * Game Objects directly to it.
 *
 * You can take many complex objects and draw them to this one texture, which can then be used as the
 * base texture for other Game Objects, such as Sprites. Should you then update this texture, all
 * Game Objects using it will instantly be updated as well, reflecting the changes immediately.
 *
 * It's a powerful way to generate dynamic textures at run-time that are WebGL friendly and don't invoke
 * expensive GPU uploads on each change.
 *
 * @method Phaser.GameObjects.GameObjectFactory#renderTexture
 * @since 3.2.0
 *
 * @param {number} x - The horizontal position of this Game Object in the world.
 * @param {number} y - The vertical position of this Game Object in the world.
 * @param {number} [width=32] - The width of the Render Texture.
 * @param {number} [height=32] - The height of the Render Texture.
 *
 * @return {Phaser.GameObjects.RenderTexture} The Game Object that was created.
 */
GameObjectFactory.register('renderTexture', function (x, y, width, height)
{
    return this.displayList.add(new RenderTexture(this.scene, x, y, width, height));
});
