/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * The Sound Seek Event.
 * 
 * This event is dispatched by both Web Audio and HTML5 Audio Sound objects when they are seeked to a new position.
 * 
 * Listen to it from a Sound instance using `Sound.on('seek', listener)`, i.e.:
 * 
 * ```javascript
 * var music = this.sound.add('key');
 * music.on('seek', listener);
 * music.play();
 * music.setSeek(5000);
 * ```
 *
 * @event Phaser.Sound.Events#SEEK
 * 
 * @param {(Phaser.Sound.WebAudioSound|Phaser.Sound.HTML5AudioSound)} sound - A reference to the Sound that emitted the event.
 * @param {number} detune - The new detune value of the Sound.
 */
module.exports = 'seek';
