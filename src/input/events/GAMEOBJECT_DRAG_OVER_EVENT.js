/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Game Object Drag Over Event.
 * 
 * This event is dispatched by an interactive Game Object if a pointer drags it over a drag target.
 * 
 * When the Game Object first enters the drag target it will emit a `dragenter` event. If it then moves while within
 * the drag target, it will emit this event instead.
 * 
 * Listen to this event from a Game Object using: `gameObject.on('dragover', listener)`.
 * Note that the scope of the listener is automatically set to be the Game Object instance itself.
 * 
 * To receive this event, the Game Object must have been set as interactive and enabled for drag.
 * See [GameObject.setInteractive]{@link Phaser.GameObjects.GameObject#setInteractive} for more details.
 *
 * @event Phaser.Input.Events#GAMEOBJECT_DRAG_OVER
 * @since 3.0.0
 * 
 * @param {Phaser.Input.Pointer} pointer - The Pointer responsible for triggering this event.
 * @param {Phaser.GameObjects.GameObject} target - The drag target that this pointer has moved over.
 */
module.exports = 'dragover';
