/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * The Gamepad Button Up Event.
 * 
 * This event is dispatched by the Gamepad Plugin when a button has been released on any active Gamepad.
 * 
 * Listen to this event from within a Scene using: `this.input.gamepad.on('up', listener)`.
 * 
 * You can also listen for an UP event from a Gamepad instance. See the [GAMEPAD_BUTTON_UP]{@linkcode Phaser.Input.Gamepad.Events#event:GAMEPAD_BUTTON_UP} event for details.
 *
 * @event Phaser.Input.Gamepad.Events#BUTTON_UP
 * 
 * @param {Phaser.Input.Gamepad} pad - A reference to the Gamepad on which the button was released.
 * @param {Phaser.Input.Gamepad.Button} button - A reference to the Button which was released.
 * @param {number} value - The value of the button at the time it was released. Between 0 and 1. Some Gamepads have pressure-sensitive buttons.
 */
module.exports = 'up';
