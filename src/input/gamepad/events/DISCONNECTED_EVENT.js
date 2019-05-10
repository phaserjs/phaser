/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Gamepad Disconnected Event.
 * 
 * This event is dispatched by the Gamepad Plugin when a Gamepad has been disconnected.
 * 
 * Listen to this event from within a Scene using: `this.input.gamepad.once('disconnected', listener)`.
 *
 * @event Phaser.Input.Gamepad.Events#DISCONNECTED
 * @since 3.0.0
 * 
 * @param {Phaser.Input.Gamepad} pad - A reference to the Gamepad which was disconnected.
 * @param {Event} event - The native DOM Event that triggered the disconnection.
 */
module.exports = 'disconnected';
