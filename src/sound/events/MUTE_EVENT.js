/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Sound Mute Event.
 *
 * This event is dispatched by both Web Audio and HTML5 Audio Sound objects when their mute state changes.
 *
 * Listen to it from a Sound instance using `Sound.on('mute', listener)`, i.e.:
 *
 * ```javascript
 * var music = this.sound.add('key');
 * music.on('mute', listener);
 * music.play();
 * music.setMute(true);
 * ```
 *
 * @event Phaser.Sound.Events#MUTE
 * @type {string}
 * @since 3.0.0
 *
 * @param {(Phaser.Sound.WebAudioSound|Phaser.Sound.HTML5AudioSound)} sound - A reference to the Sound that emitted the event.
 * @param {boolean} mute - The mute value. `true` if the Sound is now muted, otherwise `false`.
 */
module.exports = 'mute';
