/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Video Game Object Error Event.
 * 
 * This event is dispatched when a Video tries to play a source that does not exist, or is the wrong file type.
 * 
 * Listen for it from a Video Game Object instance using `Video.on('error', listener)`.
 *
 * @event Phaser.GameObjects.Events#VIDEO_ERROR
 * @since 3.20.0
 * 
 * @param {Phaser.GameObjects.Video} video - The Video Game Object which threw the error.
 * @param {Event} event - The native DOM event the browser raised during playback.
 */
module.exports = 'error';
