/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Video Game Object Playing Event.
 *
 * The playing event is fired after playback is first started,
 * and whenever it is restarted. For example it is fired when playback
 * resumes after having been paused or delayed due to lack of data.
 *
 * Listen for it from a Video Game Object instance using `Video.on('playing', listener)`.
 *
 * @event Phaser.GameObjects.Events#VIDEO_PLAYING
 * @type {string}
 * @since 3.60.0
 *
 * @param {Phaser.GameObjects.Video} video - The Video Game Object which started playback.
 */
module.exports = 'playing';
