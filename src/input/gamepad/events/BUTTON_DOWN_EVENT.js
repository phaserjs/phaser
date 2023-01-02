/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2013-2023 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Gamepad Button Down Event.
 *
 * This event is dispatched by the Gamepad Plugin when a button has been pressed on any active Gamepad.
 *
 * Listen to this event from within a Scene using: `this.input.gamepad.on('down', listener)`.
 *
 * You can also listen for a DOWN event from a Gamepad instance. See the [GAMEPAD_BUTTON_DOWN]{@linkcode Phaser.Input.Gamepad.Events#event:GAMEPAD_BUTTON_DOWN} event for details.
 *
 * @event Phaser.Input.Gamepad.Events#BUTTON_DOWN
 * @type {string}
 * @since 3.10.0
 *
 * @param {Phaser.Input.Gamepad} pad - A reference to the Gamepad on which the button was pressed.
 * @param {Phaser.Input.Gamepad.Button} button - A reference to the Button which was pressed.
 * @param {number} value - The value of the button at the time it was pressed. Between 0 and 1. Some Gamepads have pressure-sensitive buttons.
 */
module.exports = 'down';
