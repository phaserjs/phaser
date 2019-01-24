/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * The Pointer Drag Input Event.
 * 
 * This event is dispatched by the Input Plugin belonging to a Scene if a pointer moves while dragging a Game Object.
 * 
 * Listen to this event from within a Scene using: `this.input.on('drag', listener)`.
 * 
 * A Pointer can only drag a single Game Object at once.
 * 
 * To listen for this event from a _specific_ Game Object, use the [GAMEOBJECT_DRAG]{@linkcode Phaser.Input.Events#event:GAMEOBJECT_DRAG} event instead.
 *
 * @event Phaser.Input.Events#DRAG
 * 
 * @param {Phaser.Input.Pointer} pointer - The Pointer responsible for triggering this event.
 * @param {Phaser.GameObjects.GameObject} gameObject - The interactive Game Object that this pointer is dragging.
 * @param {number} dragX - The x coordinate where the Pointer is currently dragging the Game Object, in world space.
 * @param {number} dragY - The y coordinate where the Pointer is currently dragging the Game Object, in world space.
 */
module.exports = 'drag';
