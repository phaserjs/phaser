/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Key Up Event.
 * 
 * This event is dispatched by a [Key]{@link Phaser.Input.Keyboard.Key} object when it is released.
 * 
 * Listen for this event from the Key object instance directly:
 * 
 * ```javascript
 * var spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
 * 
 * spaceBar.on('up', listener)
 * ```
 * 
 * You can also create a generic 'global' listener. See [Keyboard.Events.ANY_KEY_UP]{@linkcode Phaser.Input.Keyboard.Events#event:ANY_KEY_UP} for details.
 *
 * @event Phaser.Input.Keyboard.Events#UP
 * @since 3.0.0
 * 
 * @param {Phaser.Input.Keyboard.Key} key - The Key object that was released.
 * @param {KeyboardEvent} event - The native DOM Keyboard Event. You can inspect this to learn more about any modifiers, etc.
 */
module.exports = 'up';
