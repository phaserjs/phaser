/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Pointer Drag Over Input Event.
 * 
 * This event is dispatched by the Input Plugin belonging to a Scene if a pointer drags a Game Object over a Drag Target.
 * 
 * When the Game Object first enters the drag target it will emit a `dragenter` event. If it then moves while within
 * the drag target, it will emit this event instead.
 * 
 * Listen to this event from within a Scene using: `this.input.on('dragover', listener)`.
 * 
 * A Pointer can only drag a single Game Object at once.
 * 
 * To listen for this event from a _specific_ Game Object, use the [GAMEOBJECT_DRAG_OVER]{@linkcode Phaser.Input.Events#event:GAMEOBJECT_DRAG_OVER} event instead.
 *
 * @event Phaser.Input.Events#DRAG_OVER
 * @since 3.0.0
 * 
 * @param {Phaser.Input.Pointer} pointer - The Pointer responsible for triggering this event.
 * @param {Phaser.GameObjects.GameObject} gameObject - The interactive Game Object that this pointer is dragging.
 * @param {Phaser.GameObjects.GameObject} target - The drag target that this pointer has moved over.
 */
module.exports = 'dragover';
