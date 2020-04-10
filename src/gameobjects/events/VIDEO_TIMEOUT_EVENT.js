/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Video Game Object Timeout Event.
 * 
 * This event is dispatched when a Video has exhausted its allocated time while trying to connect to a video
 * source to start playback.
 * 
 * Listen for it from a Video Game Object instance using `Video.on('timeout', listener)`.
 *
 * @event Phaser.GameObjects.Events#VIDEO_TIMEOUT
 * @since 3.20.0
 * 
 * @param {Phaser.GameObjects.Video} video - The Video Game Object which timed out.
 */
module.exports = 'timeout';
