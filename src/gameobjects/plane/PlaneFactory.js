/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2013-2023 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Plane = require('./Plane');
var GameObjectFactory = require('../GameObjectFactory');

/**
 * Creates a new Plane Game Object and adds it to the Scene.
 *
 * Note: This method will only be available if the Plane Game Object has been built into Phaser.
 *
 * @method Phaser.GameObjects.GameObjectFactory#plane
 * @since 3.60.0
 *
 * @param {number} [x] - The horizontal position of this Plane in the world.
 * @param {number} [y] - The vertical position of this Plane in the world.
 * @param {string|Phaser.Textures.Texture} [texture] - The key, or instance of the Texture this Plane will use to render with, as stored in the Texture Manager.
 * @param {string|number} [frame] - An optional frame from the Texture this Plane is rendering with.
 * @param {number} [width=8] - The width of this Plane, in cells, not pixels.
 * @param {number} [height=8] - The height of this Plane, in cells, not pixels.
 * @param {boolean} [tile=false] - Is the texture tiled? I.e. repeated across each cell.
 *
 * @return {Phaser.GameObjects.Plane} The Plane Game Object that was created.
 */
GameObjectFactory.register('plane', function (x, y, texture, frame, width, height, tile)
{
    return this.displayList.add(new Plane(this.scene, x, y, texture, frame, width, height, tile));
});
