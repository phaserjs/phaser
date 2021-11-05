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
 * @event Phaser.Sound.Events#DECODED_KEY
 * @since 3.60.0
 */
module.exports = 'decoded-';
