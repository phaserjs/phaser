/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * The Pointer Drag Enter Input Event.
 * 
 * This event is dispatched by the Input Plugin belonging to a Scene if a pointer drags a Game Object into a Drag Target.
 * 
 * Listen to this event from within a Scene using: `this.input.on('dragenter', listener)`.
 * 
 * A Pointer can only drag a single Game Object at once.
 * 
 * To listen for this event from a _specific_ Game Object, use the [GAMEOBJECT_DRAG_ENTER]{@linkcode Phaser.Input.Events#event:GAMEOBJECT_DRAG_ENTER} event instead.
 *
 * @event Phaser.Input.Events#DRAG_ENTER
 * 
 * @param {Phaser.Input.Pointer} pointer - The Pointer responsible for triggering this event.
 * @param {Phaser.GameObjects.GameObject} gameObject - The interactive Game Object that this pointer is dragging.
 * @param {Phaser.GameObjects.GameObject} target - The drag target that this pointer has moved into.
 */
module.exports = 'dragenter';
