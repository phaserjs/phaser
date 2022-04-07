/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2022 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Video = require('./Video');
var GameObjectFactory = require('../GameObjectFactory');

/**
 * Creates a new Video Game Object and adds it to the Scene.
 *
 * Note: This method will only be available if the Video Game Object has been built into Phaser.
 *
 * @method Phaser.GameObjects.GameObjectFactory#video
 * @since 3.20.0
 *
 * @param {number} x - The horizontal position of this Game Object in the world.
 * @param {number} y - The vertical position of this Game Object in the world.
 * @param {string} [key] - Optional key of the Video this Game Object will play, as stored in the Video Cache.
 *
 * @return {Phaser.GameObjects.Video} The Game Object that was created.
 */
GameObjectFactory.register('video', function (x, y, key)
{
    return this.displayList.add(new Video(this.scene, x, y, key));
});
