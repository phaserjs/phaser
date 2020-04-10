/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Audio Data Decoded Event.
 * 
 * This event is dispatched by the Web Audio Sound Manager as a result of calling the `decodeAudio` method.
 * 
 * Listen to it from the Sound Manager in a Scene using `this.sound.on('decoded', listener)`, i.e.:
 * 
 * ```javascript
 * this.sound.on('decoded', handler);
 * this.sound.decodeAudio(key, audioData);
 * ```
 *
 * @event Phaser.Sound.Events#DECODED
 * @since 3.18.0
 * 
 * @param {string} key - The key of the audio file that was decoded and added to the audio cache.
 */
module.exports = 'decoded';
