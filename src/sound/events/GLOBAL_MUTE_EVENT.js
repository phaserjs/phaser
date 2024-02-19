/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Sound Manager Global Mute Event.
 *
 * This event is dispatched by the Sound Manager when its `mute` property is changed, either directly
 * or via the `setMute` method. This changes the mute state of all active sounds.
 *
 * Listen to it from a Scene using: `this.sound.on('mute', listener)`.
 *
 * @event Phaser.Sound.Events#GLOBAL_MUTE
 * @type {string}
 * @since 3.0.0
 *
 * @param {(Phaser.Sound.WebAudioSoundManager|Phaser.Sound.HTML5AudioSoundManager)} soundManager - A reference to the Sound Manager that emitted the event.
 * @param {boolean} mute - The mute value. `true` if the Sound Manager is now muted, otherwise `false`.
 */
module.exports = 'mute';
