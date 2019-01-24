/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * The Key Up Event.
 * 
 * This event is dispatched by the Keyboard Plugin when any key on the keyboard is released.
 * 
 * Unlike the `ANY_KEY_UP` event, this one has a special dynamic event name. For example, to listen for the `A` key being released
 * use the following from within a Scene: `this.input.keyboard.on('keyup-A', listener)`. You can replace the `-A` part of the event
 * name with any valid [Key Code string]{@link Phaser.Input.Keyboard.KeyCodes}. For example, this will listen for the space bar: 
 * `this.input.keyboard.on('keyup-SPACE', listener)`.
 * 
 * You can also create a generic 'global' listener. See [Keyboard.Events.ANY_KEY_UP]{@linkcode Phaser.Input.Keyboard.Events#event:ANY_KEY_UP} for details.
 * 
 * Finally, you can create Key objects, which you can also listen for events from. See [Keyboard.Events.UP]{@linkcode Phaser.Input.Keyboard.Events#event:UP} for details.
 *
 * @event Phaser.Input.Keyboard.Events#KEY_UP
 * 
 * @param {KeyboardEvent} event - The native DOM Keyboard Event. You can inspect this to learn more about the key that was released, any modifiers, etc.
 */
module.exports = 'keyup-';
