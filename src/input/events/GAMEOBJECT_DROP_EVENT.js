/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * The Game Object Drop Event.
 * 
 * This event is dispatched by an interactive Game Object if a pointer drops it on a Drag Target.
 * 
 * Listen to this event from a Game Object using: `gameObject.on('drop', listener)`.
 * Note that the scope of the listener is automatically set to be the Game Object instance itself.
 * 
 * To receive this event, the Game Object must have been set as interactive and enabled for drag.
 * See [GameObject.setInteractive]{@link Phaser.GameObjects.GameObject#setInteractive} for more details.
 *
 * @event Phaser.Input.Events#GAMEOBJECT_DROP
 * 
 * @param {Phaser.Input.Pointer} pointer - The Pointer responsible for triggering this event.
 * @param {Phaser.GameObjects.GameObject} target - The Drag Target the `gameObject` has been dropped on.
 */
module.exports = 'drop';
