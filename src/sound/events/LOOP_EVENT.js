/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * The Sound Loop Event.
 * 
 * This event is dispatched by both Web Audio and HTML5 Audio Sound objects when their loop state is changed.
 * 
 * Listen to it from a Sound instance using `Sound.on('loop', listener)`, i.e.:
 * 
 * ```javascript
 * var music = this.sound.add('key');
 * music.on('loop', listener);
 * music.setLoop(true);
 * ```
 * 
 * This is not to be confused with the [LOOPED]{@linkcode Phaser.Sound.Events#event:LOOPED} event, which emits each time a Sound loops during playback.
 *
 * @event Phaser.Sound.Events#LOOP
 * 
 * @param {(Phaser.Sound.WebAudioSound|Phaser.Sound.HTML5AudioSound)} sound - A reference to the Sound that emitted the event.
 * @param {boolean} loop - The new loop value. `true` if the Sound will loop, otherwise `false`.
 */
module.exports = 'loop';
