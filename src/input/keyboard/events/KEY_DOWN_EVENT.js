/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Key Down Event.
 *
 * This event is dispatched by the Keyboard Plugin when any key on the keyboard is pressed down.
 *
 * Unlike the `ANY_KEY_DOWN` event, this one has a special dynamic event name. For example, to listen for the `A` key being pressed
 * use the following from within a Scene: `this.input.keyboard.on('keydown-A', listener)`. You can replace the `-A` part of the event
 * name with any valid [Key Code string]{@link Phaser.Input.Keyboard.KeyCodes}. For example, this will listen for the space bar:
 * `this.input.keyboard.on('keydown-SPACE', listener)`.
 *
 * You can also create a generic 'global' listener. See [Keyboard.Events.ANY_KEY_DOWN]{@linkcode Phaser.Input.Keyboard.Events#event:ANY_KEY_DOWN} for details.
 *
 * Finally, you can create Key objects, which you can also listen for events from. See [Keyboard.Events.DOWN]{@linkcode Phaser.Input.Keyboard.Events#event:DOWN} for details.
 *
 * _Note_: Many keyboards are unable to process certain combinations of keys due to hardware limitations known as ghosting.
 * Read [this article on ghosting]{@link http://www.html5gamedevs.com/topic/4876-impossible-to-use-more-than-2-keyboard-input-buttons-at-the-same-time/} for details.
 *
 * Also, please be aware that some browser extensions can disable or override Phaser keyboard handling.
 * For example, the Chrome extension vimium is known to disable Phaser from using the D key, while EverNote disables the backtick key.
 * There are others. So, please check your extensions if you find you have specific keys that don't work.
 *
 * @event Phaser.Input.Keyboard.Events#KEY_DOWN
 * @type {string}
 * @since 3.0.0
 *
 * @param {KeyboardEvent} event - The native DOM Keyboard Event. You can inspect this to learn more about the key that was pressed, any modifiers, etc.
 */
module.exports = 'keydown-';
