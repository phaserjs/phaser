/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Game Object Removed from Scene Event.
 *
 * This event is dispatched when a Game Object is removed from a Scene.
 *
 * Listen for it on a Game Object instance using `GameObject.on('removedfromscene', listener)`.
 *
 * @event Phaser.GameObjects.Events#REMOVED_FROM_SCENE
 * @type {string}
 * @since 3.50.0
 *
 * @param {Phaser.GameObjects.GameObject} gameObject - The Game Object that was removed from the Scene.
 * @param {Phaser.Scene} scene - The Scene from which the Game Object was removed.
 */
module.exports = 'removedfromscene';
