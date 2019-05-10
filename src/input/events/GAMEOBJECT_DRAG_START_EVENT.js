/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Game Object Drag Start Event.
 * 
 * This event is dispatched by an interactive Game Object if a pointer starts to drag it.
 * 
 * Listen to this event from a Game Object using: `gameObject.on('dragstart', listener)`.
 * Note that the scope of the listener is automatically set to be the Game Object instance itself.
 * 
 * To receive this event, the Game Object must have been set as interactive and enabled for drag.
 * See [GameObject.setInteractive]{@link Phaser.GameObjects.GameObject#setInteractive} for more details.
 * 
 * There are lots of useful drag related properties that are set within the Game Object when dragging occurs.
 * For example, `gameObject.input.dragStartX`, `dragStartY` and so on.
 *
 * @event Phaser.Input.Events#GAMEOBJECT_DRAG_START
 * @since 3.0.0
 * 
 * @param {Phaser.Input.Pointer} pointer - The Pointer responsible for triggering this event.
 * @param {number} dragX - The x coordinate where the Pointer is currently dragging the Game Object, in world space.
 * @param {number} dragY - The y coordinate where the Pointer is currently dragging the Game Object, in world space.
 */
module.exports = 'dragstart';
