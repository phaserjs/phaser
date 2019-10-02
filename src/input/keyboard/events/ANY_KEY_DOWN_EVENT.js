/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Global Key Down Event.
 * 
 * This event is dispatched by the Keyboard Plugin when any key on the keyboard is pressed down.
 * 
 * Listen to this event from within a Scene using: `this.input.keyboard.on('keydown', listener)`.
 * 
 * You can also listen for a specific key being pressed. See [Keyboard.Events.KEY_DOWN]{@linkcode Phaser.Input.Keyboard.Events#event:KEY_DOWN} for details.
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
 * @event Phaser.Input.Keyboard.Events#ANY_KEY_DOWN
 * @since 3.0.0
 * 
 * @param {KeyboardEvent} event - The native DOM Keyboard Event. You can inspect this to learn more about the key that was pressed, any modifiers, etc.
 */
module.exports = 'keydown';
