/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * The Pointer Drop Input Event.
 * 
 * This event is dispatched by the Input Plugin belonging to a Scene if a pointer drops a Game Object on a Drag Target.
 * 
 * Listen to this event from within a Scene using: `this.input.on('drop', listener)`.
 * 
 * To listen for this event from a _specific_ Game Object, use the [GAMEOBJECT_DROP]{@linkcode Phaser.Input.Events#event:GAMEOBJECT_DROP} event instead.
 *
 * @event Phaser.Input.Events#DROP
 * 
 * @param {Phaser.Input.Pointer} pointer - The Pointer responsible for triggering this event.
 * @param {Phaser.GameObjects.GameObject} gameObject - The interactive Game Object that this pointer was dragging.
 * @param {Phaser.GameObjects.GameObject} target - The Drag Target the `gameObject` has been dropped on.
 */
module.exports = 'drop';
