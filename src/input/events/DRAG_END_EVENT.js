/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * The Pointer Drag End Input Event.
 * 
 * This event is dispatched by the Input Plugin belonging to a Scene if a pointer stops dragging a Game Object.
 * 
 * Listen to this event from within a Scene using: `this.input.on('dragend', listener)`.
 * 
 * To listen for this event from a _specific_ Game Object, use the [GAMEOBJECT_DRAG_END]{@linkcode Phaser.Input.Events#event:GAMEOBJECT_DRAG_END} event instead.
 *
 * @event Phaser.Input.Events#DRAG_END
 * 
 * @param {Phaser.Input.Pointer} pointer - The Pointer responsible for triggering this event.
 * @param {Phaser.GameObjects.GameObject} gameObject - The interactive Game Object that this pointer stopped dragging.
 */
module.exports = 'dragend';
