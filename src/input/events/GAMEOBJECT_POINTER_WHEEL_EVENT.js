/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2022 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Game Object Pointer Wheel Event.
 *
 * This event is dispatched by an interactive Game Object if a pointer has its wheel moved while over it.
 *
 * Listen to this event from a Game Object using: `gameObject.on('wheel', listener)`.
 * Note that the scope of the listener is automatically set to be the Game Object instance itself.
 *
 * To receive this event, the Game Object must have been set as interactive.
 * See [GameObject.setInteractive]{@link Phaser.GameObjects.GameObject#setInteractive} for more details.
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
 * @event Phaser.Input.Events#GAMEOBJECT_POINTER_WHEEL
 * @type {string}
 * @since 3.18.0
 *
 * @param {Phaser.Input.Pointer} pointer - The Pointer responsible for triggering this event.
 * @param {number} deltaX - The horizontal scroll amount that occurred due to the user moving a mouse wheel or similar input device.
 * @param {number} deltaY - The vertical scroll amount that occurred due to the user moving a mouse wheel or similar input device. This value will typically be less than 0 if the user scrolls up and greater than zero if scrolling down.
 * @param {number} deltaZ - The z-axis scroll amount that occurred due to the user moving a mouse wheel or similar input device.
 * @param {Phaser.Types.Input.EventData} event - The Phaser input event. You can call `stopPropagation()` to halt it from going any further in the event flow.
 */
module.exports = 'wheel';
