/**
 * @author       pi-kei
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Sound Pan Event.
 *
 * This event is dispatched by both Web Audio and HTML5 Audio Sound objects when their pan changes.
 *
 * Listen to it from a Sound instance using `Sound.on('pan', listener)`, i.e.:
 *
 * ```javascript
 * var sound = this.sound.add('key');
 * sound.on('pan', listener);
 * sound.play();
 * sound.setPan(0.5);
 * ```
 *
 * @event Phaser.Sound.Events#PAN
 * @type {string}
 * @since 3.50.0
 *
 * @param {(Phaser.Sound.WebAudioSound|Phaser.Sound.HTML5AudioSound)} sound - A reference to the Sound that emitted the event.
 * @param {number} pan - The new pan of the Sound.
 */
module.exports = 'pan';
