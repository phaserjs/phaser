/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var GameObjectFactory = require('../GameObjectFactory');
var RenderTexture = require('./RenderTexture');

/**
 * Creates a new Render Texture Game Object and adds it to the Scene.
 *
 * Note: This method will only be available if the Render Texture Game Object has been built into Phaser.
 *
 * @method Phaser.GameObjects.GameObjectFactory#renderTexture
 * @since 3.2.0
 *
 * @param {number} x - The horizontal position of this Game Object in the world.
 * @param {number} y - The vertical position of this Game Object in the world.
 * @param {integer} [width=32] - The width of the Render Texture.
 * @param {integer} [height=32] - The height of the Render Texture.
 * 
 * @return {Phaser.GameObjects.RenderTexture} The Game Object that was created.
 */
GameObjectFactory.register('renderTexture', function (x, y, width, height)
{
    return this.displayList.add(new RenderTexture(this.scene, x, y, width, height));
});
