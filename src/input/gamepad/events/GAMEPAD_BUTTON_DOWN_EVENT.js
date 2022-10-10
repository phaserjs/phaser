/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2022 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Gamepad Button Down Event.
 *
 * This event is dispatched by a Gamepad instance when a button has been pressed on it.
 *
 * Listen to this event from a Gamepad instance. Once way to get this is from the `pad1`, `pad2`, etc properties on the Gamepad Plugin:
 * `this.input.gamepad.pad1.on('down', listener)`.
 *
 * Note that you will not receive any Gamepad button events until the browser considers the Gamepad as being 'connected'.
 *
 * You can also listen for a DOWN event from the Gamepad Plugin. See the [BUTTON_DOWN]{@linkcode Phaser.Input.Gamepad.Events#event:BUTTON_DOWN} event for details.
 *
 * @event Phaser.Input.Gamepad.Events#GAMEPAD_BUTTON_DOWN
 * @type {string}
 * @since 3.10.0
 *
 * @param {number} index - The index of the button that was pressed.
 * @param {number} value - The value of the button at the time it was pressed. Between 0 and 1. Some Gamepads have pressure-sensitive buttons.
 * @param {Phaser.Input.Gamepad.Button} button - A reference to the Button which was pressed.
 */
module.exports = 'down';
