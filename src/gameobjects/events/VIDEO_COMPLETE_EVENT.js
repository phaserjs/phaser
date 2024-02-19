/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Video Game Object Complete Event.
 *
 * This event is dispatched when a Video finishes playback by reaching the end of its duration. It
 * is also dispatched if a video marker sequence is being played and reaches the end.
 *
 * Note that not all videos can fire this event. Live streams, for example, have no fixed duration,
 * so never technically 'complete'.
 *
 * If a video is stopped from playback, via the `Video.stop` method, it will emit the
 * `VIDEO_STOP` event instead of this one.
 *
 * Listen for it from a Video Game Object instance using `Video.on('complete', listener)`.
 *
 * @event Phaser.GameObjects.Events#VIDEO_COMPLETE
 * @type {string}
 * @since 3.20.0
 *
 * @param {Phaser.GameObjects.Video} video - The Video Game Object which completed playback.
 */
module.exports = 'complete';
