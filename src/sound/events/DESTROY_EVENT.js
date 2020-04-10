/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Sound Destroy Event.
 * 
 * This event is dispatched by both Web Audio and HTML5 Audio Sound objects when they are destroyed, either
 * directly or via a Sound Manager.
 * 
 * Listen to it from a Sound instance using `Sound.on('destroy', listener)`, i.e.:
 * 
 * ```javascript
 * var music = this.sound.add('key');
 * music.on('destroy', listener);
 * music.destroy();
 * ```
 *
 * @event Phaser.Sound.Events#DESTROY
 * @since 3.0.0
 * 
 * @param {(Phaser.Sound.WebAudioSound|Phaser.Sound.HTML5AudioSound)} sound - A reference to the Sound that emitted the event.
 */
module.exports = 'destroy';
