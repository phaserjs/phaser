/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2013-2023 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Game Object Drag Event.
 *
 * This event is dispatched by an interactive Game Object if a pointer moves while dragging it.
 *
 * Listen to this event from a Game Object using: `gameObject.on('drag', listener)`.
 * Note that the scope of the listener is automatically set to be the Game Object instance itself.
 *
 * To receive this event, the Game Object must have been set as interactive and enabled for drag.
 * See [GameObject.setInteractive]{@link Phaser.GameObjects.GameObject#setInteractive} for more details.
 *
 * @event Phaser.Input.Events#GAMEOBJECT_DRAG
 * @type {string}
 * @since 3.0.0
 *
 * @param {Phaser.Input.Pointer} pointer - The Pointer responsible for triggering this event.
 * @param {number} dragX - The x coordinate where the Pointer is currently dragging the Game Object, in world space.
 * @param {number} dragY - The y coordinate where the Pointer is currently dragging the Game Object, in world space.
 */
module.exports = 'drag';
