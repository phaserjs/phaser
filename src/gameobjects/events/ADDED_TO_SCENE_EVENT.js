/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Game Object Added to Scene Event.
 *
 * This event is dispatched when a Game Object is added to a Scene.
 *
 * Listen for it on a Game Object instance using `GameObject.on('addedtoscene', listener)`.
 *
 * @event Phaser.GameObjects.Events#ADDED_TO_SCENE
 * @since 3.50.0
 *
 * @param {Phaser.GameObjects.GameObject} gameObject - The Game Object that was added to the Scene.
 * @param {Phaser.Scene} scene - The Scene to which the Game Object was added.
 */
module.exports = 'addedtoscene';
