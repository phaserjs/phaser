/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2013-2023 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Global Key Up Event.
 *
 * This event is dispatched by the Keyboard Plugin when any key on the keyboard is released.
 *
 * Listen to this event from within a Scene using: `this.input.keyboard.on('keyup', listener)`.
 *
 * You can also listen for a specific key being released. See [Keyboard.Events.KEY_UP]{@linkcode Phaser.Input.Keyboard.Events#event:KEY_UP} for details.
 *
 * Finally, you can create Key objects, which you can also listen for events from. See [Keyboard.Events.UP]{@linkcode Phaser.Input.Keyboard.Events#event:UP} for details.
 *
 * @event Phaser.Input.Keyboard.Events#ANY_KEY_UP
 * @type {string}
 * @since 3.0.0
 *
 * @param {KeyboardEvent} event - The native DOM Keyboard Event. You can inspect this to learn more about the key that was released, any modifiers, etc.
 */
module.exports = 'keyup';
