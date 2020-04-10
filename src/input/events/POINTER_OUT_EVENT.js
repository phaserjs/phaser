/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Pointer Out Input Event.
 * 
 * This event is dispatched by the Input Plugin belonging to a Scene if a pointer moves out of any interactive Game Object.
 * 
 * Listen to this event from within a Scene using: `this.input.on('pointerout', listener)`.
 * 
 * The event hierarchy is as follows:
 * 
 * 1. [GAMEOBJECT_POINTER_OUT]{@linkcode Phaser.Input.Events#event:GAMEOBJECT_POINTER_OUT}
 * 2. [GAMEOBJECT_OUT]{@linkcode Phaser.Input.Events#event:GAMEOBJECT_OUT}
 * 3. [POINTER_OUT]{@linkcode Phaser.Input.Events#event:POINTER_OUT}
 * 
 * With the top event being dispatched first and then flowing down the list. Note that higher-up event handlers can stop
 * the propagation of this event.
 *
 * @event Phaser.Input.Events#POINTER_OUT
 * @since 3.0.0
 * 
 * @param {Phaser.Input.Pointer} pointer - The Pointer responsible for triggering this event.
 * @param {Phaser.GameObjects.GameObject[]} justOut - An array containing all interactive Game Objects that the pointer moved out of when the event was created.
 */
module.exports = 'pointerout';
