/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Key Down Event.
 *
 * This event is dispatched by a [Key]{@link Phaser.Input.Keyboard.Key} object when it is pressed.
 *
 * Listen for this event from the Key object instance directly:
 *
 * ```javascript
 * var spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
 *
 * spaceBar.on('down', listener)
 * ```
 *
 * You can also create a generic 'global' listener. See [Keyboard.Events.ANY_KEY_DOWN]{@linkcode Phaser.Input.Keyboard.Events#event:ANY_KEY_DOWN} for details.
 *
 * @event Phaser.Input.Keyboard.Events#DOWN
 * @type {string}
 * @since 3.0.0
 *
 * @param {Phaser.Input.Keyboard.Key} key - The Key object that was pressed.
 * @param {KeyboardEvent} event - The native DOM Keyboard Event. You can inspect this to learn more about any modifiers, etc.
 */
module.exports = 'down';
