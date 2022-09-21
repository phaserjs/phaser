/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2022 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Pointer Wheel Input Event.
 *
 * This event is dispatched by the Input Plugin belonging to a Scene if a pointer has its wheel updated.
 *
 * Listen to this event from within a Scene using: `this.input.on('wheel', listener)`.
 *
 * The event hierarchy is as follows:
 *
 * 1. [GAMEOBJECT_POINTER_WHEEL]{@linkcode Phaser.Input.Events#event:GAMEOBJECT_POINTER_WHEEL}
 * 2. [GAMEOBJECT_WHEEL]{@linkcode Phaser.Input.Events#event:GAMEOBJECT_WHEEL}
 * 3. [POINTER_WHEEL]{@linkcode Phaser.Input.Events#event:POINTER_WHEEL}
 *
 * With the top event being dispatched first and then flowing down the list. Note that higher-up event handlers can stop
 * the propagation of this event.
 *
 * @event Phaser.Input.Events#POINTER_WHEEL
 * @type {string}
 * @since 3.18.0
 *
 * @param {Phaser.Input.Pointer} pointer - The Pointer responsible for triggering this event.
 * @param {Phaser.GameObjects.GameObject[]} currentlyOver - An array containing all interactive Game Objects that the pointer was over when the event was created.
 * @param {number} deltaX - The horizontal scroll amount that occurred due to the user moving a mouse wheel or similar input device.
 * @param {number} deltaY - The vertical scroll amount that occurred due to the user moving a mouse wheel or similar input device. This value will typically be less than 0 if the user scrolls up and greater than zero if scrolling down.
 * @param {number} deltaZ - The z-axis scroll amount that occurred due to the user moving a mouse wheel or similar input device.
 */
module.exports = 'wheel';
