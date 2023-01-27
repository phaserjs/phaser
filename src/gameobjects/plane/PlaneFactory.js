/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2013-2023 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Plane = require('./Plane');
var GameObjectFactory = require('../GameObjectFactory');

/**
 * Creates a new Image Game Object and adds it to the Scene.
 *
 * Note: This method will only be available if the Image Game Object has been built into Phaser.
 *
 * @method Phaser.GameObjects.GameObjectFactory#plane
 * @since 3.60.0
 *
 * @param {number} [x] - The horizontal position of this Game Object in the world.
 * @param {number} [y] - The vertical position of this Game Object in the world.
 * @param {string|Phaser.Textures.Texture} [texture] - The key, or instance of the Texture this Game Object will use to render with, as stored in the Texture Manager.
 * @param {string|number} [frame] - An optional frame from the Texture this Game Object is rendering with.
 *
 * @return {Phaser.GameObjects.Image} The Game Object that was created.
 */
GameObjectFactory.register('plane', function (x, y, texture, frame, width, height, tile)
{
    return this.displayList.add(new Plane(this.scene, x, y, texture, frame, width, height, tile));
});
