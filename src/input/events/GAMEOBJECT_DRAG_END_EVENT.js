/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Game Object Drag End Event.
 *
 * This event is dispatched by an interactive Game Object if a pointer stops dragging it.
 *
 * Listen to this event from a Game Object using: `gameObject.on('dragend', listener)`.
 * Note that the scope of the listener is automatically set to be the Game Object instance itself.
 *
 * To receive this event, the Game Object must have been set as interactive and enabled for drag.
 * See [GameObject.setInteractive](Phaser.GameObjects.GameObject#setInteractive) for more details.
 *
 * @event Phaser.Input.Events#GAMEOBJECT_DRAG_END
 * @type {string}
 * @since 3.0.0
 *
 * @param {Phaser.Input.Pointer} pointer - The Pointer responsible for triggering this event.
 * @param {number} dragX - The x coordinate where the Pointer stopped dragging the Game Object, in world space.
 * @param {number} dragY - The y coordinate where the Pointer stopped dragging the Game Object, in world space.
 * @param {boolean} dropped - Whether the Game Object was dropped onto a target.
 */
module.exports = 'dragend';
