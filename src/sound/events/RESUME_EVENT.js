/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Sound Resume Event.
 *
 * This event is dispatched by both Web Audio and HTML5 Audio Sound objects when they are resumed from a paused state.
 *
 * Listen to it from a Sound instance using `Sound.on('resume', listener)`, i.e.:
 *
 * ```javascript
 * var music = this.sound.add('key');
 * music.on('resume', listener);
 * music.play();
 * music.pause();
 * music.resume();
 * ```
 *
 * @event Phaser.Sound.Events#RESUME
 * @type {string}
 * @since 3.0.0
 *
 * @param {(Phaser.Sound.WebAudioSound|Phaser.Sound.HTML5AudioSound)} sound - A reference to the Sound that emitted the event.
 */
module.exports = 'resume';
