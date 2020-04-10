/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Sound Detune Event.
 * 
 * This event is dispatched by both Web Audio and HTML5 Audio Sound objects when their detune value changes.
 * 
 * Listen to it from a Sound instance using `Sound.on('detune', listener)`, i.e.:
 * 
 * ```javascript
 * var music = this.sound.add('key');
 * music.on('detune', listener);
 * music.play();
 * music.setDetune(200);
 * ```
 *
 * @event Phaser.Sound.Events#DETUNE
 * @since 3.0.0
 * 
 * @param {(Phaser.Sound.WebAudioSound|Phaser.Sound.HTML5AudioSound)} sound - A reference to the Sound that emitted the event.
 * @param {number} detune - The new detune value of the Sound.
 */
module.exports = 'detune';
