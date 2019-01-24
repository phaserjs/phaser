/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * The Gamepad Connected Event.
 * 
 * This event is dispatched by the Gamepad Plugin when a Gamepad has been connected.
 * 
 * Listen to this event from within a Scene using: `this.input.gamepad.once('connected', listener)`.
 * 
 * Note that the browser may require you to press a button on a gamepad before it will allow you to access it,
 * this is for security reasons. However, it may also trust the page already, in which case you won't get the
 * 'connected' event and instead should check `GamepadPlugin.total` to see if it thinks there are any gamepads
 * already connected.
 *
 * @event Phaser.Input.Gamepad.Events#CONNECTED
 * 
 * @param {Phaser.Input.Gamepad} pad - A reference to the Gamepad which was connected.
 * @param {Event} event - The native DOM Event that triggered the connection.
 */
module.exports = 'connected';
