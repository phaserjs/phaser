/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
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
 * 
 * @param {(Phaser.Sound.WebAudioSound|Phaser.Sound.HTML5AudioSound)} sound - A reference to the Sound that emitted the event.
 * @param {boolean} mute - The mute value. `true` if the Sound is now muted, otherwise `false`.
 */
module.exports = 'mute';
