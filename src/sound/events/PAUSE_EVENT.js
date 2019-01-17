/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * The Sound Pause Event.
 * 
 * This event is dispatched by both Web Audio and HTML5 Audio Sound objects when they are paused.
 * 
 * Listen to it from a Sound instance using `Sound.on('pause', listener)`, i.e.:
 * 
 * ```javascript
 * var music = this.sound.add('key');
 * music.on('pause', listener);
 * music.play();
 * music.pause();
 * ```
 *
 * @event Phaser.Sound.Events#PAUSE
 * 
 * @param {(Phaser.Sound.WebAudioSound|Phaser.Sound.HTML5AudioSound)} sound - A reference to the Sound that emitted the event.
 */
module.exports = 'pause';
