/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Sound Complete Event.
 * 
 * This event is dispatched by both Web Audio and HTML5 Audio Sound objects when they complete playback.
 * 
 * Listen to it from a Sound instance using `Sound.on('complete', listener)`, i.e.:
 * 
 * ```javascript
 * var music = this.sound.add('key');
 * music.on('complete', listener);
 * music.play();
 * ```
 *
 * @event Phaser.Sound.Events#COMPLETE
 * @since 3.16.1
 * 
 * @param {(Phaser.Sound.WebAudioSound|Phaser.Sound.HTML5AudioSound)} sound - A reference to the Sound that emitted the event.
 */
module.exports = 'complete';
