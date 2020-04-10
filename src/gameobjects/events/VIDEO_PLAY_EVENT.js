/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Video Game Object Play Event.
 * 
 * This event is dispatched when a Video begins playback. For videos that do not require
 * interaction unlocking, this is usually as soon as the `Video.play` method is called.
 * However, for videos that require unlocking, it is fired once playback begins after
 * they've been unlocked.
 * 
 * Listen for it from a Video Game Object instance using `Video.on('play', listener)`.
 *
 * @event Phaser.GameObjects.Events#VIDEO_PLAY
 * @since 3.20.0
 * 
 * @param {Phaser.GameObjects.Video} video - The Video Game Object which started playback.
 */
module.exports = 'play';
